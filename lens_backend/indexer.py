import os
from pathlib import Path
import glob
import pysolr
import requests
import json
import pandas as pd
import pickle5 as pickle



path = os.path.dirname(Path(__file__))

# https://tecadmin.net/install-apache-solr-on-ubuntu/


CORE_NAME = "IRF_new"
AWS_IP = "3.134.191.90"


# [CAUTION] :: Run this script once, i.e. during core creation


def delete_core(core=CORE_NAME):
    print(os.system('sudo su - solr -c "/opt/solr/bin/solr delete -c {core}"'.format(core=core)))


def create_core(core=CORE_NAME):
    print(os.system(
        'sudo su - solr -c "/opt/solr/bin/solr create -c {core} -n data_driven_schema_configs"'.format(
            core=core)))


# collection

collection = [{
    "id": 1,
    "first_name": "Chickie",
    "last_name": "Proven",
    "email": "cproven0@alexa.com",
    "age": 77,
    "pincodes": [2121212, 3232323]
}, {
    "id": 2,
    "first_name": "Dex",
    "last_name": "Bofield",
    "email": "dbofield1@about.com",
    "age": 88,
    "pincodes": [2121212, 3232323]
}, {
    "id": 3,
    "first_name": "Saba",
    "last_name": "Ace",
    "email": "sace2@craigslist.org",
    "age": 55,
    "pincodes": [2121212, 3232323]
}]

class Indexer:
    def __init__(self):
        self.solr_url = f'http://{AWS_IP}:8983/solr/'
        self.connection = pysolr.Solr(self.solr_url + CORE_NAME, always_commit=True, timeout=50000)
        self.CORE_NAME = CORE_NAME

    def do_initial_setup(self):
        delete_core()
        create_core()

    def create_documents(self, docs):
        print("OK")
        print(self.connection.add(docs))

    def connection_object(self):
        return self.connection

    def add_fields(self):
        '''
        Define all the fields that are to be indexed in the core. Refer to the project doc for more details
        :return:
        '''
        print("IN add_fields")
        data = {
            "add-field": [
                #{"name": "id","type": "string","multiValued": False},
                {"name": "country","type": "string","multiValued": False},
                {"name": "tweet_lang","type": "string","multiValued": False},
                {"name": "tweet_text","type": "text_general","multiValued": False},
                {"name": "text_en","type": "text_en","multiValued": False},
                {"name": "text_hi", "type": "text_hi", "multiValued": False},
                {"name": "text_es", "type": "text_es", "multiValued": False},
                {"name": "tweet_date", "type": "pdate", "multiValued": False},
                {"name": "verified", "type": "boolean", "multiValued": False},
                {"name": "poi_id", "type": "plong", "multiValued": False},
                {"name": "poi_name", "type": "string", "multiValued": False},
                {"name": "replied_to_tweet_id", "type": "plong", "multiValued": False},
                {"name": "replied_to_user_id", "type": "plong", "multiValued": False},
                {"name": "reply_text", "type": "text_general", "multiValued": False},
                {"name": "hashtags", "type": "strings", "multiValued": True},
                {"name": "mentions", "type": "strings", "multiValued": True},
                {"name": "tweet_urls", "type": "strings", "multiValued": True},
                {"name": "tweet_emoticons", "type": "strings", "multiValued": True},
                {"name": "geolocation", "type": "strings", "multiValued": True}
            ]
        }

        print(requests.post(self.solr_url + CORE_NAME + "/schema", json=data).json())

        #raise NotImplementedError

    def delete_fields(self):
        data = {
            "delete-field": [
                {
                    "name": "id"
                }
            ]
        }

        print(requests.post(self.solr_url + CORE_NAME + "/schema", json=data).json())

def add_data(indexer):
    #with open("train.json") as json_file:
    #    data = json.load(json_file)

    root_dir = '/home/ubuntu/IRF_Project_21/project4/project1_data/'
    dir_names = glob.glob(root_dir + "/*")

    for dir_name in dir_names:
        file_names = glob.glob(dir_name + "/*")
        for file_name in file_names:

            if '.csv' in file_name:
                continue
                
            with open(file_name, 'rb') as f:
                data = pickle.load(f)

            json_list = json.loads(json.dumps(list(data.T.to_dict().values())))

            print(len(json_list))
            indexer.create_documents(json_list)


def add_new_data(indexer):
    path = os.path.dirname(Path(__file__))
    root_dir = '/home/ubuntu/lens/lens_backend/new_keywords/'
    #root_dir = path + '/new_POIS/'
    file_names = glob.glob(root_dir + "/*")

    cnt =0
    for file_name in file_names:

        if 'poi' in file_name:
            continue
        print(file_name)
        cnt +=1
        if cnt <45:
            continue
        #continue
        with open(file_name, 'rb') as f:
            data = pickle.load(f)

        json_list = json.loads(json.dumps(list(data.T.to_dict().values())))

        ret_list = []

        for doc in json_list:
            if doc['tweet_lang'] == 'es' or doc['tweet_lang'] == 'hi' or doc['tweet_lang'] == 'en':
                ret_list.append(doc)

        #print(len(json_list))
        #print(json_list[0])
        #break
        indexer.create_documents(ret_list)

if __name__ == "__main__":
    i = Indexer()
    #i.do_initial_setup()
    #i.add_fields()
    #add_data(i)
    add_new_data(i)
    #i.delete_fields()
   # i.create_documents(collection[0])
