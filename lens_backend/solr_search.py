import indexer
import static_data as sd
import json
import emoji
import pickle
import pysolr

import simplejson
import pprint



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

from flask_cors import CORS


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

def tokenizer(text):
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
    ps = PorterStemmer()
    tokenized_text = [word for word in tokenized_text if word not in stop_words]
    #tokenized_text = [ps.stem(word) for word in tokenized_text]
    return tokenized_text

def checkPayloadRequirement(doc, payload):
    lang_dict = {
        "en": "English",
        "hi": "Hindi",
        "es": "Spanish"
    }
    print(len(payload['countries'][0]))
    if 'poi_name' not in doc:
        return False
    if len(payload['countries'][0]) > 0 and doc['country'] not in payload['countries']:
        return False
    if len(payload['languages'][0]) > 0 and lang_dict[doc['tweet_lang']] not in payload['languages']:
        return False
    if len(payload['poi_names'][0]) > 0 and doc['poi_name'] not in payload['poi_names']:
        return False
    if 'topic' in payload and len(payload['topic']>0):
        topic_words = getTopicsOfDoc(doc)
        for topic in topic_words:
           if payload['topic'] in topic:
               return True
        return False

    return True

def getPoiTweetCount(payload, tweet_list, poi_set):

    temp_poi_set = set()
    if len(payload['poi_names'][0]) > 0:
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

def getLangTweetCount(payload, tweet_list, language_set):
    temp_language_set = set()
    lang_dict = {"English": "en", "Hindi": "hi", "Spanish": "es"}
    if len(payload['languages']) > 1:
        for lang in payload['languages']:
            temp_language_set.add(lang_dict[lang])
    else:
        temp_language_set = language_set.copy()
    language_tweet_count = {}
    for lang in temp_language_set:
        language_tweet_count[lang] = 0

    for tweet in tweet_list:
        lang = tweet['tweet_lang']
        if lang in temp_language_set:
            language_tweet_count[lang] += 1
    return language_tweet_count

def getCountryTweetCount(payload, tweet_list, country_set):

    temp_country_set = set()
    if len(payload['countries'][0]) > 0:
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
    if len(payload['poi_names'][0]) > 0:
        for poi in payload['poi_names']:
            temp_poi_set.add(poi)
    else:
        temp_poi_set = poi_set.copy()
    poi_reply_count = {}
    poi_reply_sentiment = {}
    for poi in temp_poi_set:
        poi_reply_count[poi] = 0
        poi_reply_sentiment[poi] = 0.0

    poi_reply = sd.saveAllReply(ind)
    print(poi_reply.keys(), len(tweet_list))
    analyzer = SentimentIntensityAnalyzer()
    #''''
    for tweet in tweet_list:
        poi_name = tweet['poi_name']
        if poi_name in temp_poi_set:
            tweet_id = tweet['id']
            sentiment = 0.0
            if poi_name in poi_reply:
                for reply in poi_reply[poi_name]:
                    #print(type(reply['replied_to_tweet_id']), type(tweet_id))
                    if str(reply['replied_to_tweet_id']) == str(tweet_id):
                        poi_reply_count[poi_name] += 1
                        vs = analyzer.polarity_scores(reply['reply_text'])
                        sentiment += vs['pos']

            '''
            query = "replied_to_tweet_id:" + tweet_id
            reply_tweet_list = sd.solr_search_query(ind.connection, query, 500)
            poi_reply_count[poi_name] += len(reply_tweet_list)

            sentiment = 0.0
            for reply_tweet in reply_tweet_list:
                vs = analyzer.polarity_scores(reply_tweet['reply_text'])
                sentiment += vs['pos']
                # print(vs)
            # print( vs['pos'])
            #'''
            poi_reply_sentiment[poi_name] += sentiment
    #'''
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
                    extra_percent + 'tweet_lang' + extra_percent +'poi_id'

    fl = "q.op=OR&fl=" + result_fields
    fq = "fq="
    rows = "rows=10000"
    wt = "wt=json"
    # wt        = "wt=python"
    params = [q, fl, fq, wt, rows]
    p = "&".join(params)
    actual_url = url + (p)

    print(actual_url)
    #actual_url = 'http://3.134.191.90:8983/solr/IRF_21/select?fl=id%2C%20poi_name%2C%20score&q.op=OR&q=text_en%3AModi%20and%20India'
    #'''
    connection = urllib2.urlopen(actual_url)
    print("Connection OK")

    if wt == "wt=json":
        response = simplejson.load(connection)
    else:
        response = eval(connection.read())
    #'''
    #ret_key = "tweet_text, id, poi_name, hashtags, tweet_date, tweet_lang, country, score, poi_id"
    #query = "text_en:" + query_text
    #tweet_list = ind.connection.search(q = query, fl = ret_key ,rows=10000)
   # for tweet in tweet_list:
    #    print(tweet)
    #return
    print("Number of hits: " + str(response['response']['numFound']))
    #print(type(response))
    result_tweet_list = []
    poi_set = set()
    country_set = set()
    language_set = set()
    for doc in response['response']['docs']:
    #for doc in tweet_list:
        if checkPayloadRequirement(doc, payload) == False:
            continue
        print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ", doc['country'])
        if 'poi_name' in doc.keys():
            result_tweet_list.append(doc)
            poi_set.add(doc['poi_name'])
        if 'country' in doc.keys():
            country_set.add(doc['country'])
        if 'tweet_lang' in doc.keys():
            language_set.add(doc['tweet_lang'])

    analyzer = SentimentIntensityAnalyzer()
    lens_doc = []

    cur_page, total_tweet  = 1, 10
    if "page_group" in payload:
        cur_page = payload['page_group']
    if  "result_in_page" in payload:
        total_tweet = payload['result_in_page']

    sentiment_count = {"pos":0, "neg":0, "neu":0}
    print("OK")
    for doc in result_tweet_list[(cur_page-1)*total_tweet::]:
        vs = analyzer.polarity_scores(doc['tweet_text'])
        if vs['neu'] > .90:
            sentiment_count['neu'] += 1
        elif vs['pos'] > vs['neg']:
            sentiment_count['pos'] += 1
        else:
            sentiment_count['neg'] += 1

        if(len(lens_doc) < total_tweet):
            if vs['pos'] < .0000000001:
                vs['pos'] = .5
            doc['sentiment'] = vs['pos']
            doc['topics'] = "Nothing"
            #doc['topics'] = sd.getTopicsOfDoc(doc)
            #doc['top_pos_reply'], doc['top_neg_reply']  = sd.getTopPosNegReply(doc, ind)
            doc['top_pos_reply'], doc['top_neg_reply'] = "No reply in indexed data", "No reply in indexed data"
            lens_doc.append(doc)
            #break
    print(sentiment_count)
    poi_tweet_count = getPoiTweetCount(payload, result_tweet_list, poi_set)
    country_tweet_count = getCountryTweetCount(payload, result_tweet_list, country_set)
    poi_reply_count, poi_reply_sentiment = getPoiReplyCount(payload, result_tweet_list, poi_set)
    language_tweet_count = getLangTweetCount(payload, result_tweet_list, language_set)
    #print(lens_doc)
    return lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, len(result_tweet_list), sentiment_count, language_tweet_count



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
    payload = json.loads(request.data.decode("utf-8").replace("'", '"'))
    if "query" in payload:
        query = payload['query']
        print(payload['query'])

    # Search document in solr with query
    lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, \
    total_tweet_count, sentiment_count, language_tweet_count = search_query(payload, ind)

    response = {
        'tweet_list': lens_doc,
        'poi_tweet_count': poi_tweet_count,
        'country_tweet_count': country_tweet_count,
        'poi_reply_count': poi_reply_count,
        'poi_reply_sentiment': poi_reply_sentiment,
        'total_tweet_count': total_tweet_count,
        'sentiment_count':sentiment_count,
        'language_tweet_count': language_tweet_count
    }
    return flask.jsonify(response)

@app.route("/getPoi", methods=['GET'])
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

@app.route("/getTopicsLabel", methods=['GET'])
def getTopicsLabel():
    topics_label = sd.getTopicsLabel()
    return flask.jsonify(topics_label)

def testQuery():
    payload = {
        "query": "Modi and India",
        "poi_names": ["ShashiTharoor", "nsitharaman"],
        "countries": ["India"],
        "languages": ["English", "Hindi"],
        "page_group": 1,
        "result_in_page": 10
    }
    total_tweet_count, sentiment_count, language_tweet_count = search_query(payload, ind)

if __name__ == "__main__":
    #search_query(payload, ind)
    #get_poi()

    #print("OK")

    #testQuery()
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=8888)
