import indexer
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

app = Flask(__name__)

ind = indexer.Indexer()

def save_file(data, filename):
    df = pd.DataFrame(data)
    df.to_pickle("data/all_data/" + filename)

def remove_emoji(text):
    return emoji.get_emoji_regexp().sub(u'', text)

def solr_search_query(connection, query, rows=0):
    results = connection.search(q=query, rows=rows)
    print("Saw {0} result(s).".format(len(results)))
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
def get_poi():
    results = []
    root_dir = '/home/ubuntu/IRF_Project_21/project4/project1_data/'
    dir_names = glob.glob(root_dir + "/*")

    for dir_name in dir_names:
        dir_name = dir_name.split('/')[6]
        if 'keyword' not in dir_name:
            results.append(dir_name)

    print(results)
    return results

def get_from_solr(core_name, text):
    host = "localhost"
    port = "8983"
    collection = core_name
    qt = "select"
    url = "http://" + host + ":" + port + "/solr/" + collection + "/" + qt + "?"

    #text = text[:-1]
    query_string = "text_en%3A" + text + "text_hi%3A" + text + "text_es%3A" + text

   # query_string = "\"" + query_string + "\"~3"
    print("Query------>>>>>  ", query_string)
    q = "defType=edismax&df=text_en&df=text_hi&df=text_es&q=" + query_string
    q = "defType=edismax&q=" + query_string
    q += "&qf=hashtags%5E1.5%20text_en%5E1.5%20text_hi%5E1.5%20text_es%5E1.5"

    extra_percent = '%2C%20'
    result_fields = "id" + extra_percent + 'poi_name' + extra_percent + 'tweet_text'  + \
                    extra_percent + 'hashtags' + extra_percent + 'tweet_date' + extra_percent + 'country' + extra_percent + 'score'

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

    print("Number of hits: " + str(response['response']['numFound']))

    print(type(response))

    dict_result = []

    cnt =0
    for doc in response['response']['docs']:
        if 'poi_name' in doc.keys():
            #print(doc['id'])
            dict_result.append(doc)
            cnt += 1
            #if cnt == 10:
                #break

    analyzer = SentimentIntensityAnalyzer()
    lens_doc = []
    for doc in dict_result:
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
        #print(dict_result[0])

    print(lens_doc[0].keys())

    return lens_doc



def search_query(query, solr_core):
    connection = solr_core.connection
    lang = 'Mexico'
    search_query = 'country:' + lang
    core_name = 'IRF_21'


    #print("Collecting data  ", line[0], line[1::])
    search_query = ""

    tokenized_text = tokenizer(query)
    print(tokenized_text)
    #continue
    for word in tokenized_text:
        search_query += word + "%20"
    print("Search query==", search_query)
    #search_query = re.sub(r'[^\x00-\x7F]+',' ', search_query)
    print("query id   core name and query  _______>>>>>>>>>    ", core_name, search_query)
    lens_doc = get_from_solr(core_name, (search_query))

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
    lens_doc = search_query(query, ind)

    response = {
        "Response": lens_doc
    }
    return flask.jsonify(lens_doc)

@app.route("/getPoi", methods=['GET'])
def getPoi():
    poi_list = get_poi()

    response = {
        "poi_names": poi_list
    }
    print(response)
    return flask.jsonify(response)

if __name__ == "__main__":
    #search_query("Modi and India", ind)
    #get_poi()

    #app.run(debug=True)
    app.run(host="0.0.0.0", port=9999)