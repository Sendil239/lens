import os
from pathlib import Path
import glob
import json
from ast import literal_eval

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


def solr_search_query(connection, query, rows=0):
    results = connection.search(q=query, rows=rows)
    #print("Saw {0} result(s).".format(len(results)))
    return results

def get_poi():
    results = []
    path = os.path.dirname(Path(__file__))
    # root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    root_dir = path + '/project1_data/'
    dir_names = glob.glob(root_dir + "/*")
    #print(root_dir, dir_names)

    #print(path, root_dir, dir_names)
    for dir_name in dir_names:
        dir_name = dir_name.split('/')[-1]
        #print(dir_name)
        if 'keyword' not in dir_name:
            # f_name = dir_name.split('/')[6]
            results.append(dir_name)

    #print(results)
    return results

def getAllPoiTweetCount(ind):
    temp_poi_set = set(get_poi())
    poi_tweet_count = {}
    path = os.path.dirname(Path(__file__))
    # root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    root_dir = path + '/static_data/poi_distribution.json'
    with open(root_dir) as json_file:
        data = json.load(json_file)
    return data
    for poi in temp_poi_set:
        poi_tweet_count[poi] = 0
    for poi in temp_poi_set:
        query = "poi_name:" + poi
        print(query)
        tweet_list = solr_search_query(ind.connection, query, 5000)
        poi_tweet_count[poi] = len(tweet_list)
        print(poi, len(tweet_list))
    return poi_tweet_count

def getAllCountryTweetCount(ind):
    country_tweet_count = {"India":0, "USA":0, "Mexico":0}
    country_tweet_count = {"Mexico": 26650, "USA":29675, "India":20809}
    return country_tweet_count

    for country in country_tweet_count:
        query = "country:" + country
        print(query)
        tweet_list = solr_search_query(ind.connection, query, 50000)
        country_tweet_count[country] = len(tweet_list)
        print(country, len(tweet_list))
    return country_tweet_count

def getAllLanguageTweetCount(ind):
    language_tweet_count = {"en":0, "hi":0, "es":0}
    language_tweet_count = {"en": 36470, "hi": 14018, "es": 26646}
    return language_tweet_count

    for language in language_tweet_count:
        query = "tweet_lang:" + country
        #print(query)
        tweet_list = solr_search_query(ind.connection, query, 50000)
        language_tweet_count[language] = len(tweet_list)
        print(language, len(tweet_list))
    return language_tweet_count

def getAllPoiTimeSeriesData(ind):
    temp_poi_set = set(get_poi())
    poi_date_info = {}

    path = os.path.dirname(Path(__file__))
    # root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    root_dir = path + '/static_data/poi_time_series.json'
    with open(root_dir) as json_file:
        data = json.load(json_file)
    return data
    for poi in temp_poi_set:
        #poi_date_info[poi] = []
        query = "poi_name:" + poi
        #print(query)
        tweet_list = solr_search_query(ind.connection, query, 3000)
        poi_date = {}
        print(poi, len(tweet_list))
        for tweet in tweet_list:
            #print(tweet["tweet_date"])
            tweet["tweet_date"] = tweet["tweet_date"].split('T')[0]
            #datetime.datetime.strptime(tweet["tweet_date"], "%d/%m/%Y").strftime("%Y-%m-%d")
            #print(tweet["tweet_date"])
            #return
            if tweet["tweet_date"] not in poi_date:
                poi_date[tweet["tweet_date"]] = 1
                #poi_date['tweet_count'] = 1
            else:
                poi_date[tweet["tweet_date"]] += 1

        poi_date_info[poi] = poi_date
        #print(poi_date_info)
    #print(poi_date_info)

    #with open('/home/ubuntu/lens/lens_backend/static_data/poi_time_series.json', 'w') as outfile:
    #    json.dump(poi_date_info, outfile)
    return poi_date_info

def getAllCountryTimeSeriesData(ind):
    country_set= {"India":0, "USA":0, "Mexico":0}
    country_date_info = {}

    #with open("/home/ubuntu/lens/lens_backend/static_data/poi_time_series.json") as json_file:
    #    data = json.load(json_file)
    #return data
    for country in country_set:
        #poi_date_info[poi] = []
        print(country)
        return
        query = "country:" + country
        #print(query)
        tweet_list = solr_search_query(ind.connection, query, 35000)
        country_date = {}
        print(country, len(tweet_list))
        for tweet in tweet_list:
            tweet["tweet_date"] = tweet["tweet_date"].split('T')[0]
            #datetime.datetime.strptime(tweet["tweet_date"], "%d/%m/%Y").strftime("%Y-%m-%d")
            #print(tweet["tweet_date"])
            #return
            if tweet["tweet_date"] not in country_date:
                country_date[tweet["tweet_date"]] = 1
                #poi_date['tweet_count'] = 1
            else:
                country_date[tweet["tweet_date"]] += 1

        country_date_info[country] = country_date
    path = os.path.dirname(Path(__file__))
    # root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    root_dir = path + '/static_data/country_time_series.json'
    with open(root_dir, 'w') as outfile:
        json.dump(country_date_info, outfile)
    return country_date_info

def saveAllReply(ind):
    path = os.path.dirname(Path(__file__))
    # root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    root_dir = path + '/static_data/poi_reply.json'
    with open(root_dir) as json_file:
        data = json.load(json_file)
            
    return data
    poi_id_name = {}
    for poi in get_poi():
        query = "poi_name:" + poi
        result = solr_search_query(ind.connection, query, 1)
        for tweet in result:
            #print(result)
            poi_id_name[tweet['poi_id']] = tweet['poi_name']

    #print(poi_id_name)
    #return
    query = "replied_to_tweet_id:" + "*"
    reply_tweet_list = solr_search_query(ind.connection, query, 14000)
    print(len(reply_tweet_list))

    poi_reply = {}
    for reply_tweet in reply_tweet_list:
        if reply_tweet['replied_to_user_id'] not in poi_id_name:
            continue
        replied_to_user_id = poi_id_name[reply_tweet['replied_to_user_id']]
        if replied_to_user_id not in poi_reply:
            poi_reply[replied_to_user_id] = []

        poi_reply[replied_to_user_id].append(reply_tweet)

    #print(poi_reply)
    #print(reply_count)

    with open('/home/ubuntu/lens/lens_backend/static_data/poi_reply.json', 'w') as outfile:
       json.dump(poi_reply, outfile)

    return poi_reply

def getTopPosNegReply(doc, ind):
    poi_reply = saveAllReply(ind)
    analyzer = SentimentIntensityAnalyzer()
    top_pos_tweet = ""
    top_neg_tweet = ""
    max_pos = 0
    max_neg = 0

    query = "replied_to_tweet_id:" + doc['id']
    result = solr_search_query(ind.connection, query, 10)
    print(len(result))
    for tweet in result:
        vs = analyzer.polarity_scores(tweet['reply_text'])
        print(vs)
        if vs['pos'] > max_pos:
            max_pos = vs['pos']
            top_pos_tweet = tweet['reply_text']
        if vs['neg'] < max_neg:
            max_neg = vs['neg']
            top_neg_tweet = tweet['reply_text']

    #print("TOP--->>>>>   ", top_pos_tweet, top_neg_tweet)
    return top_pos_tweet, top_neg_tweet

def getTopicsOfDoc(doc):
    with open("/home/ubuntu/lens/lens_backend/static_data/document_topic_score.json") as json_file:
        data = json.load(json_file)
        data = literal_eval(data)
        print(len(data), type(data))

        for key in data.keys():
            print(key, data[key])
            print(type(doc['id']), type(key), type(data[key]))
            break
        print(data[doc['id']])
    return data[doc['id']]

def getTopicsLabel():
    topic_label_set = set()
    with open("/home/ubuntu/lens/lens_backend/static_data/topic_words.json") as json_file:
        data = json.load(json_file)
        #print(data)
        data = literal_eval(data)
        print(type(data))
        for key in data.keys():
            topic_label_set.add(data[key][0])

    print(list(topic_label_set))
    return list(topic_label_set)