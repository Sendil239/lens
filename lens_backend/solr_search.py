import indexer
import static_data as sd
import json
import emoji
import pickle
import pysolr

import simplejson
import pprint
import os
from pathlib import Path


import urllib.request as urllib2
from urllib.parse import quote

import pandas as pd

import collections
from nltk.stem import PorterStemmer
import re
from nltk.corpus import stopwords
import nltk
import glob
import datetime
nltk.download('stopwords')

import re
from urllib.parse import urlparse
from urllib.parse import urlunparse

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import gensim
from gensim.summarization.summarizer import summarize

import flask
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

ind = indexer.Indexer()
AWS_IP = 'localhost'
PORT = '8983'

def save_file(data, filename):
    df = pd.DataFrame(data)
    df.to_pickle("data/all_data/" + filename)

def remove_emoji(text):
    return emoji.get_emoji_regexp().sub(u'', text)

def solr_search_query(connection, query, rows=0):
    results = connection.search(q=query, rows=rows)
    #print("Saw {0} result(s).".format(len(results)))
    return results

def tokenizer(text):
    """ Implement logic to pre-process & tokenize document text.
        Write the code in such a way that it can be re-used for processing the user's query.
        To be implemented."""

    # print("Original ---->>>>  ", text)
    stop_words = set(stopwords.words('english'))

    text = text.lower()
    text = text.replace("'", "")
    text = text.replace("’", "")
    text = text.replace("#", "%23")
    #text = re.sub(r'[-]+', ' ', text)
    #text = re.sub(r'[^A-Za-z0-9 ]+', ' ', text)
    text = re.sub('[,]', ' ', text)
    text = re.sub(' +', ' ', text)


    tokenized_text = text.split()

    #print(text)
    #print(tokenized_text)

    ps = PorterStemmer()
    tokenized_text = [word for word in tokenized_text if word not in stop_words]
    #tokenized_text = [ps.stem(word) for word in tokenized_text]

    # print(tokenized_text)

    return tokenized_text



def checkPayloadRequirement(doc, payload):
    lang_dict = {
        "en": "English",
        "hi": "Hindi",
        "es": "Spanish"
    }
    if 'poi_name' not in doc:
        return False
    if len(payload['countries']) > 0 and doc['country'] not in payload['countries']:
        return False
    if len(payload['languages']) > 0 and lang_dict[doc['tweet_lang']] not in payload['languages']:
        return False
    if len(payload['poi_names']) > 0 and doc['poi_name'] not in payload['poi_names']:
        return False

    return True

def getPoiTweetCount(payload, tweet_list, poi_set):

    temp_poi_set = set()
    if len(payload['poi_names']) > 0:
        for poi in payload['poi_names']:
            temp_poi_set.add(poi)
    else:
        temp_poi_set = poi_set.copy()
    poi_tweet_count = {}
    for poi in temp_poi_set:
        poi_tweet_count[poi] = 0

    for tweet in tweet_list:
        poi_name = tweet['poi_name']
        if poi_name in temp_poi_set:
            poi_tweet_count[poi_name] += 1

    return poi_tweet_count

def getCountryTweetCount(payload, tweet_list, country_set):

    temp_country_set = set()
    if len(payload['countries']) > 0:
        for country in payload['countries']:
            temp_country_set.add(country)
    else:
        temp_country_set = country_set.copy()
    country_tweet_count = {}
    for country in temp_country_set:
        country_tweet_count[country] = 0

    for tweet in tweet_list:
        country_name = tweet['country']
        if country_name in temp_country_set:
            country_tweet_count[country_name] += 1

    return country_tweet_count

def getPoiReplyCount(payload, tweet_list, poi_set):

    temp_poi_set = set()
    if len(payload['poi_names']) > 0:
        for poi in payload['poi_names']:
            temp_poi_set.add(poi)
    else:
        temp_poi_set = poi_set.copy()
    poi_reply_count = {}
    poi_reply_sentiment = {}
    for poi in temp_poi_set:
        poi_reply_count[poi] = 0
        poi_reply_sentiment[poi] = 0.0

    analyzer = SentimentIntensityAnalyzer()
    for tweet in tweet_list:
        poi_name = tweet['poi_name']

        if poi_name in temp_poi_set:
            tweet_id = tweet['id']
            query = "replied_to_tweet_id:" + tweet_id
            reply_tweet_list = solr_search_query(ind.connection, query, 5000000)
            poi_reply_count[poi_name] += len(reply_tweet_list)

            sentiment = 0.0
            for reply_tweet in reply_tweet_list:
                vs = analyzer.polarity_scores(reply_tweet['reply_text'])
                sentiment += vs['pos']
                #print(vs)
            #print( vs['pos'])
            poi_reply_sentiment[poi_name] += sentiment
    for poi_name in temp_poi_set:
        if poi_reply_count[poi_name] > 0.000001:
            poi_reply_sentiment[poi_name] /= poi_reply_count[poi_name]

    return poi_reply_count, poi_reply_sentiment

def get_from_solr(core_name, query_text, payload):
    host = AWS_IP
    port = PORT
    collection = core_name
    qt = "select"
    url = "http://" + host + ":" + port + "/solr/" + collection + "/" + qt + "?"

    query_string = "text_en%3A" + query_text + "text_hi%3A" + query_text + "text_es%3A" + query_text

    print("Query------>>>>>  ", query_string)
    q = "defType=edismax&df=text_en&df=text_hi&df=text_es&q=" + query_string
    q = "defType=edismax&q=" + query_string
    q += "&qf=hashtags%5E1.5%20text_en%5E1.5%20text_hi%5E1.5%20text_es%5E1.5"

    extra_percent = '%2C%20'
    result_fields = "id" + extra_percent + 'poi_name' + extra_percent + 'tweet_text'  + \
                    extra_percent + 'hashtags' + extra_percent + 'tweet_date' + extra_percent + 'country' + extra_percent + 'score' + \
                    extra_percent + 'tweet_lang'

    fl = "q.op=OR&fl=" + result_fields
    fq = "fq="
    rows = "rows=200000"
    wt = "wt=json"
    # wt        = "wt=python"
    params = [q, fl, fq, wt, rows]
    p = "&".join(params)
    actual_url = url + (p)

    print(actual_url)
    #actual_url = 'http://3.134.191.90:8983/solr/IRF_21/select?fl=id%2C%20poi_name%2C%20score&q.op=OR&q=text_en%3AModi%20and%20India'
    connection = urllib2.urlopen(actual_url)

    if wt == "wt=json":
        response = simplejson.load(connection)
    else:
        response = eval(connection.read())

    #print("Number of hits: " + str(response['response']['numFound']))
    #print(type(response))
    result_tweet_list = []
    poi_set = set()
    country_set = set()
    for doc in response['response']['docs']:
        if checkPayloadRequirement(doc, payload) == False:
            continue
        if 'poi_name' in doc.keys():
            result_tweet_list.append(doc)
            poi_set.add(doc['poi_name'])
        if 'country' in doc.keys():
            country_set.add(doc['country'])

    analyzer = SentimentIntensityAnalyzer()
    lens_doc = []

    cur_page, total_tweet  = 1, 10
    if "page_group" in payload:
        cur_page = payload['page_group']
    if  "result_in_page" in payload:
        total_tweet = payload['result_in_page']

    for doc in result_tweet_list[(cur_page-1)*total_tweet::]:
        vs = analyzer.polarity_scores(doc['tweet_text'])
       # print( vs['pos'])
        doc['sentiment'] = vs['pos']

        if len(doc['tweet_text']) < 500000:
            short_summary = doc['tweet_text']
        else:
            short_summary = summarize(doc['tweet_text'])
        doc['topics'] = short_summary
        doc['top_pos_reply'] = 'Top Positive reply. need to be implemented'
        doc['top_neg_reply'] = 'Top Negative reply. need to be implemented'
        lens_doc.append(doc)
        #print(doc)
        if(len(lens_doc) == total_tweet):
            break

    poi_tweet_count = getPoiTweetCount(payload, result_tweet_list, poi_set)
    country_tweet_count = getCountryTweetCount(payload, result_tweet_list, country_set)
    poi_reply_count, poi_reply_sentiment = getPoiReplyCount(payload, result_tweet_list, poi_set)
    #print(lens_doc)
    return lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, len(result_tweet_list)



def search_query(payload, solr_core):
    core_name = 'IRF_21'

    search_query = ""
    query = payload['query']

    tokenized_text = tokenizer(query)
    print(tokenized_text)
    #continue
    for word in tokenized_text:
        search_query += word + "%20"
    print("Search query==", search_query)
    #search_query = re.sub(r'[^\x00-\x7F]+',' ', search_query)
    #print("query id   core name and query  _______>>>>>>>>>    ", core_name, search_query)
    lens_doc = get_from_solr(core_name, (search_query), payload)

    return lens_doc

@app.route("/searchQuery", methods=['POST'])
def searchQuery():
    """ This function handles the POST request to your endpoint.
        Do NOT change it."""
    #start_time = time.time()

    payload = json.loads(request.data.decode("utf-8").replace("'", '"'))
    #print(payload)

    if "query" in payload:
        query = payload['query']
        print(payload['query'])

    # Search document in solr with query
    lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, total_tweet_count = search_query(payload, ind)

    response = {
        'tweet_list': lens_doc,
        'poi_tweet_count': poi_tweet_count,
        'country_tweet_count': country_tweet_count,
        'poi_reply_count': poi_reply_count,
        'poi_reply_sentiment': poi_reply_sentiment,
        'total_tweet_count': total_tweet_count
    }
    return flask.jsonify(response)

@app.route("/getPoi", methods=['GET'])
@cross_origin()
def getPoi():
    poi_list = sd.get_poi()
    response = {
        "poi_names": poi_list
    }
    return flask.jsonify(response)

@app.route("/getPoiDistribution", methods=['GET'])
def getPoiDistribution():
    poi_tweet_count = sd.getAllPoiTweetCount(ind)
    return flask.jsonify(poi_tweet_count)

@app.route("/getCountryDistribution", methods=['GET'])
def getCountryDistribution():
    country_tweet_count = sd.getAllCountryTweetCount(ind)
    return flask.jsonify(country_tweet_count)

@app.route("/getLanguageDistribution", methods=['GET'])
def getLanguageDistribution():
    language_tweet_count = sd.getAllLanguageTweetCount(ind)
    return flask.jsonify(language_tweet_count)

@app.route("/getTimeSeriesData", methods=['GET'])
def getTimeSeriesData():
    time_series_data = sd.getAllPoiTimeSeriesData(ind)
    return flask.jsonify(time_series_data)

@app.route("/getCountryTimeSeriesData", methods=['GET'])
def getCountryTimeSeriesData():
    country_time_series_data = sd.getAllCountryTimeSeriesData(ind)
    return flask.jsonify(country_time_series_data)

if __name__ == "__main__":
    #search_query(payload, ind)
    #get_poi()

    #print("OK")

    #getAllCountryTweetCount()
    #getAllCountryTimeSeriesData()

    #app.run(debug=True)
    app.run(host="0.0.0.0", port=8888)
