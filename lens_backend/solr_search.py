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
    text = text.replace("'", "")
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

def checkPayloadRequirement(doc, payload, doc_topic, topic_words_list):
    lang_dict = {
        "en": "English",
        "hi": "Hindi",
        "es": "Spanish"
    }
    #print(len(payload['countries'][0]))
    if 'poi_name' not in doc:
        return False
    if len(payload['countries']) > 0 and doc['country'] not in payload['countries']:
        return False
    if len(payload['languages']) > 0 and lang_dict[doc['tweet_lang']] not in payload['languages']:
        return False
    if len(payload['poi_names']) > 0 and doc['poi_name'] not in payload['poi_names']:
        return False

    if 'topic' in payload and len(payload['topic']) > 0:
        topic_words = topic_words_list[str(doc_topic[doc['id']])]
        if payload['topic'][0] in topic_words:
            return True
        else:
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
    
    for tweet in tweet_list:
        poi_name = tweet['poi_name']
        if poi_name in temp_poi_set:
            try:
                poi_tweet_count[poi_name] = poi_tweet_count[poi_name] + 1
            except:
                poi_tweet_count[poi_name] = 1

    return poi_tweet_count

def getLangTweetCount(payload, tweet_list, language_set):
    temp_language_set = set()
    lang_dict = {"English": "en", "Hindi": "hi", "Spanish": "es"}
    if len(payload['languages']) > 0:
        for lang in payload['languages']:
            temp_language_set.add(lang_dict[lang])
    else:
        temp_language_set = language_set.copy()
    language_tweet_count = {}

    for tweet in tweet_list:
        lang = tweet['tweet_lang']
        if lang in temp_language_set:
            try:
                language_tweet_count[lang] = language_tweet_count[lang] + 1
            except:
                language_tweet_count[lang] = 1
    return language_tweet_count

def getCountryTweetCount(payload, tweet_list, country_set):

    temp_country_set = set()
    if len(payload['countries']) > 0:
        for country in payload['countries']:
            temp_country_set.add(country)
    else:
        temp_country_set = country_set.copy()
    country_tweet_count = {}

    for tweet in tweet_list:
        country_name = tweet['country']
        if country_name in temp_country_set:
            try:
                country_tweet_count[country_name] = country_tweet_count[country_name] + 1
            except:
                country_tweet_count[country_name] = 1

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

    print("before loading")
    doc_reply_count = sd.saveAllReply(ind)
    print("after loading")
    #print(poi_reply.keys(), len(tweet_list))
    analyzer = SentimentIntensityAnalyzer()
    #''''
    for tweet in tweet_list:
        poi_name = tweet['poi_name']
        if poi_name in temp_poi_set:
            tweet_id = tweet['id']
            sentiment = 0.0
            if tweet_id in doc_reply_count:
                poi_reply_count[poi_name] += doc_reply_count[tweet_id]
                query = "replied_to_tweet_id:" + tweet_id
                reply_tweet_list = sd.solr_search_query(ind.connection, query, doc_reply_count[tweet_id])

                sentiment = 0.0
                for reply_tweet in reply_tweet_list:
                    vs = analyzer.polarity_scores(reply_tweet['reply_text'])
                    sentiment += vs['pos']

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
                    extra_percent + 'tweet_lang' + extra_percent +'poi_id' + extra_percent +'verified' + extra_percent +'tweet_urls'

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
    '''
    connection = urllib2.urlopen(actual_url)
    print("Connection OK")

    if wt == "wt=json":
        response = simplejson.load(connection)
    else:
        response = eval(connection.read())
    #'''
    ret_key = "tweet_text, id, poi_name, hashtags, tweet_date, tweet_lang, country, score, poi_id, verified, tweet_urls"
    query = "tweet_text:" + query_text
    tweet_list = ind.connection.search(q = query, fl = ret_key ,rows=10000)
    #for tweet in tweet_list:
    #    print(tweet)
    #return
    #print("Number of hits: " + str(response['response']['numFound']))
    #print(type(response))
    result_tweet_list = []
    poi_set = set()
    country_set = set()
    language_set = set()

    doc_topic, topic_words_list = sd.getAllTopicsAndWords()
    #for doc in response['response']['docs']:
    for doc in tweet_list:
        if checkPayloadRequirement(doc, payload, doc_topic, topic_words_list) == False:
            continue
        #print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>   ", doc['country'])
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


    #print("Len----->>>>>  ", len(result_tweet_list), total_tweet)
    doc_reply_count = sd.saveAllReply(ind)

    for doc in result_tweet_list[(cur_page-1)*total_tweet::]:
        vs = analyzer.polarity_scores(doc['tweet_text'])
        if vs['neu'] > .90:
            sentiment_count['neu'] += 1
        elif vs['pos'] > vs['neg']:
            sentiment_count['pos'] += 1
        else:
            sentiment_count['neg'] += 1
        #print("OK--->>>")
        if(len(lens_doc) < total_tweet):
            doc['topics'] = ""
            topic_words = topic_words_list[str(doc_topic[doc['id']])]
            #print(type(topic_words), topic_words[0])
            for word in topic_words[:7]:
                doc['topics'] += word + " "

            if vs['pos'] < .0000000001:
                vs['pos'] = .5
            doc['sentiment'] = vs['pos']

            if doc['id'] in doc_reply_count and doc_reply_count[doc['id']] > 0:
                doc['top_pos_reply'], doc['top_neg_reply']  = sd.getTopPosNegReply(doc, ind, doc_reply_count)
            else:
                doc['top_pos_reply'], doc['top_neg_reply'] = "", ""
            lens_doc.append(doc)
            #break
    #print(sentiment_count)
    if "NaN" in poi_set:
        poi_set.remove("NaN")

    poi_tweet_count = getPoiTweetCount(payload, result_tweet_list, poi_set)
    #print("total  1   ", len(lens_doc))
    country_tweet_count = getCountryTweetCount(payload, result_tweet_list, country_set)
    #print("total 2    ", len(lens_doc))
    poi_reply_count, poi_reply_sentiment = getPoiReplyCount(payload, result_tweet_list, poi_set)
    #print("total 3    ", len(lens_doc))
    language_tweet_count = getLangTweetCount(payload, result_tweet_list, language_set)
    #print("total  4   ",len(lens_doc))
    return lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, len(result_tweet_list), language_tweet_count, sentiment_count

def search_query(payload, solr_core):
    core_name = indexer.CORE_NAME

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
    lens_doc, poi_tweet_count, country_tweet_count, poi_reply_count, poi_reply_sentiment, total_tweet_count, language_tweet_count, sentiment_count = search_query(payload, ind)

    response = {
        'tweet_list': lens_doc,
        'poi_tweet_count': poi_tweet_count,
        'country_tweet_count': country_tweet_count,
        'poi_reply_count': poi_reply_count,
        'poi_reply_sentiment': poi_reply_sentiment,
        'total_tweet_count': total_tweet_count,
        'language_tweet_count': language_tweet_count,
        'sentiment_count':sentiment_count
    }
    return flask.jsonify(response)

@app.route("/getFilterData", methods=['GET'])
def getFilterData():
    topics_label = sd.getTopicsLabel()
    poi_list = sd.get_poi()
    
    response = {
        "topics_label": topics_label,
        "poi_names": poi_list
    }
    return flask.jsonify(response)

@app.route("/getCorpusChartData", methods=['GET'])
def getCorpusChartData():
    topic_importance = sd.getTopicImportance()
    hashtag_distribution = sd.getHashtagDistribution()
    vaccine_hesitancy = sd.getPoiVaccineHesitance()
    country_vaccine_hesitancy = sd.getCountryVaccineHesitance()
    country_time_series_data = sd.getAllCountryTimeSeriesData(ind)
    all_poi_time_series_data = sd.getAllPoiTimeSeriesData(ind)
    lang_distribution = sd.getAllLanguageTweetCount(ind)
    country_distribution = sd.getAllCountryTweetCount(ind)
    poi_tweet_distribution = sd.getAllPoiTweetCount(ind)
    response = {
        "topic_importance":topic_importance,
        "hashtag_distribution":hashtag_distribution,
        "vaccine_hesitancy":vaccine_hesitancy,
        "country_vaccine_hesitancy":country_vaccine_hesitancy,
        "all_poi_time_series_data": all_poi_time_series_data,
        "country_time_series_data": country_time_series_data,
        "lang_distribution": lang_distribution,
        "country_distribution": country_distribution,
        "poi_tweet_distribution" : poi_tweet_distribution

    }
    return flask.jsonify(response)

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

    #print("OK")

    #testQuery()
    #app.run(debug=True)
    app.run(host="0.0.0.0", port=9999)