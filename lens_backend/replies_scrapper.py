import tweepy
import json
import os
import pandas as pd
import re

# Oauth keys
consumer_key = "XXX"
consumer_secret = "XXX"
access_token = "XXX"
access_token_secret = "XXX"

class Twitter:
    def __init__(self):
        self.auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
        self.auth.set_access_token(access_token, access_token_secret)
        self.api = tweepy.API(self.auth, wait_on_rate_limit=True)
        self.TwitterClient=tweepy.Client(bearer_token="XXX", wait_on_rate_limit=True)

    def scrap_replies(self, name, tweet_id):
        replies=[]
        for page in tweepy.Cursor(self.api.search,q='to:'+name, result_type='recent',timeout=999999).pages(10):
            for tweet in page:
                if hasattr(tweet, 'in_reply_to_status_id_str'):
                    if (tweet.in_reply_to_status_id_str==tweet_id):
                        replies.append(tweet._json)
        return replies


twitter = Twitter()
currentdir=os.getcwd()

config_path=currentdir+"/config.json"

def read_config(path):
    with open(path,encoding="utf-8") as json_file:
        data = json.load(json_file)
    return data

def scrapping():
    config = read_config(config_path)
    pois = config["pois"]
    tweet_lang = []
    replied_to_tweet_id = []
    replied_to_user_id = []
    reply_text = []
    rid = []
    verified = []
    # text_en = []
    tweet_date = []
    country = []
    tweet_text = []
    tweet_emoticons = []
    hashtags = []
    mentions = []
    tweet_urls = []
    tweet_list = []
    key_list = []
    # text_hi = []
    for i in range(len(pois)):
        poi_folder = currentdir+"/project1_data/"+pois[i]["screen_name"]
        csv_folder = poi_folder + "/"+"data_poi_"+pois[i]["screen_name"]+".csv"
        df = pd.read_csv(csv_folder, delimiter=",")
        for id in df['id']:
            replies = twitter.scrap_replies(pois[i]["screen_name"], id)
            for each in replies:
                key_list.append("modi")
                replied_to_user_id.append(each['in_reply_to_user_id'])
                rid.append(each['id'])



        df_new = pd.DataFrame({'keyword': key_list, 'tweets': tweet_list}) # add necessary key and list
        df_new.to_csv(poi_folder+"/"+"replies_"+pois[i]["screen_name"]+".csv", index=False)
    
scrapping()