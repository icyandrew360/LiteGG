import requests
import json
from dotenv import load_dotenv
import os
from consts import RIOT_KEY
from helpers import (
    convert_sec_to_time, 
    convert_unix_to_date,
    get_gamemode,
    get_match_participant_details
    )

load_dotenv()
#TODO: Implement user input to get anyone's puuid

BASE_URL="https://americas.api.riotgames.com/"

def get_puuid():
    url = f'{BASE_URL}riot/account/v1/accounts/by-riot-id/andrew/howe'
    header = {
        "X-Riot-Token" : f"{RIOT_KEY}"
    }
    response = requests.get(url, headers=header)

    # parse the json response into a python dictionary
    response = response.json()
    return response['puuid']

def get_player_info(puuid):
    url = f'{BASE_URL}riot/account/v1/accounts/by-puuid/{puuid}?api_key={RIOT_KEY}'
    header = {
        "X-Riot-Token" : f"{RIOT_KEY}"
    }
    response = requests.get(url)
    response = json.loads(response)

    return response

# use match_v5 stats to get match history, this only returns match ids! no details
def get_match_history(puuid):
    header = {
        "X-Riot-Token" : f"{RIOT_KEY}"
    }
    url = f'{BASE_URL}lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10'
    response = requests.get(url, headers=header)
    match_ids = response.json()
    return match_ids

def get_simplified_match_details(match_id): #use this for listing matches on a page, less details
    header = {
        "X-Riot-Token" : f"{RIOT_KEY}"
    }
    url = f'{BASE_URL}lol/match/v5/matches/{match_id}'
    response = requests.get(url, headers=header)
    response = response.json()
    participant_details = get_match_participant_details(response)
    simplified_details = {
        'game_metadata': {
            'gameMode': get_gamemode(response['info']['gameMode']),
            'queueId': response['info']['queueId'],
            'gameDuration': convert_sec_to_time(response['info']['gameDuration']),
            'gameCreation': convert_unix_to_date(response['info']['gameCreation']),
            'gameId': response['metadata']['matchId']
        },
        'game_stats': { #TODO: Add more stats
            'participant_details': participant_details
        } 
    }
    print(simplified_details)
    return simplified_details 

def get_champion_masteries(puuid): #TODO: Add the query parameters for max number of masteries to return
    url = f'{BASE_URL}lol/champion-mastery/v4/champion-masteries/by-summoner/{puuid}?api_key={RIOT_KEY}'
    response = requests.get(url)
    mastery_list = response.json()
    return mastery_list

def get_ranked_info(puuid):
    url = f'{BASE_URL}lor/ranked/v1/leaderboards?api_key={RIOT_KEY}'
    response = requests.get(url)
    response = response.json()
    return response 


puuid = get_puuid()
match_history = get_match_history(puuid)
get_simplified_match_details(match_history[0])