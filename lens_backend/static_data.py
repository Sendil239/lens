import os
from pathlib import Path
import glob
import json

def solr_search_query(connection, query, rows=0):
    results = connection.search(q=query, rows=rows)
    #print("Saw {0} result(s).".format(len(results)))
    return results

def get_poi():
    results = []
    path = os.path.dirname(Path(__file__))
    root_dir = '/home/ubuntu/lens/lens_backend/project1_data/'
    dir_names = glob.glob(root_dir + "/*")

    print(path, root_dir, dir_names)
    for dir_name in dir_names:
        dir_name = dir_name.split('\\')[-1]
        #print(dir_name)
        if 'keyword' not in dir_name:
            f_name = dir_name.split('/')[6]
            results.append(f_name)

    print(results)
    return results

def getAllPoiTweetCount(ind):
    temp_poi_set = set(get_poi())
    poi_tweet_count = {}
    with open("/home/ubuntu/lens/lens_backend/static_data/poi_distribution.json") as json_file:
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

    with open("/home/ubuntu/lens/lens_backend/static_data/poi_time_series.json") as json_file:
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

    with open('/home/ubuntu/lens/lens_backend/static_data/country_time_series.json', 'w') as outfile:
        json.dump(country_date_info, outfile)
    return country_date_info

def saveAllReply(ind):
    query = "replied_to_tweet_id:" + "*"
    reply_tweet_list = solr_search_query(ind.connection, query, 15000)

    reply_count = {}
    for reply_tweet in reply_tweet_list:
        replied_to_tweet_id = reply_tweet['replied_to_tweet_id']
        if replied_to_tweet_id not in reply_count:
            reply_count[replied_to_tweet_id] = 1
        else:
            reply_count[replied_to_tweet_id] += 1

    print(reply_count)

