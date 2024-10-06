import requests
from dotenv import load_dotenv
from consts import RIOT_KEY
from helpers import (
    convert_sec_to_time,
    convert_unix_to_date,
    get_gamemode,
    get_match_participant_details,
)

load_dotenv()
# TODO: Implement user input to get anyone's puuid

BASE_URL = "https://americas.api.riotgames.com/"
REGION_BASE_URL = "https://na1.api.riotgames.com/"


def get_puuid():
    url = f"{BASE_URL}riot/account/v1/accounts/by-riot-id/andrew/howe"
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    response = requests.get(url, headers=header)

    # parse the json response into a python dictionary
    response = response.json()
    return response["puuid"]


# use match_v5 stats to get match history, this only returns match ids! no details
def get_match_history(puuid):
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{BASE_URL}lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10"  # TODO: Add query parameters for start and count
    response = requests.get(url, headers=header)
    match_ids = response.json()
    return match_ids


def get_match_details(
    match_id,
):  # use this for listing 1 match's details after clicking the match
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{BASE_URL}lol/match/v5/matches/{match_id}"
    response = requests.get(url, headers=header)
    response = response.json()
    participant_details = get_match_participant_details(response)
    simplified_details = {
        "game_metadata": {
            "gameMode": get_gamemode(response["info"]["gameMode"]),
            "queueId": response["info"]["queueId"],
            "gameDuration": convert_sec_to_time(response["info"]["gameDuration"]),
            "gameCreation": convert_unix_to_date(response["info"]["gameCreation"]),
            "gameId": response["metadata"]["matchId"],
        },
        "game_stats": {  # TODO: Add more stats
            "participant_details": participant_details
        },
    }
    return simplified_details


# TODO: get_simplified_match_details(match_id) #use this for listing all matches in a table, put it in account class


def get_riot_id(puuid):
    url = f"{BASE_URL}riot/account/v1/accounts/by-puuid/{puuid}?api_key={RIOT_KEY}"
    response = requests.get(url)
    response = response.json()
    return response["gameName"] + "#" + response["tagLine"]


def get_champion_masteries(
    puuid, max_masteries=10
):  # Added max_masteries parameter with default value 10
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{REGION_BASE_URL}lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}?count={max_masteries}"  # Added query parameter for max number of masteries to return
    response = requests.get(url, headers=header)
    mastery_list = response.json()
    simplified_mastery_list = [
        {
            "champion": champion["championId"],
            "championLevel": champion["championLevel"],
            "championPoints": champion["championPoints"],
            "lastPlayTime": convert_unix_to_date(champion["lastPlayTime"]),
        }
        for champion in mastery_list
    ]
    return simplified_mastery_list


def get_summoner_info(puuid):
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{REGION_BASE_URL}lol/summoner/v4/summoners/by-puuid/{puuid}"
    response = requests.get(url, headers=header)
    response = response.json()
    return {
        "accountId": response["accountId"],
        "summonerId": response["id"],
        "summonerLevel": response["summonerLevel"],
    }


def get_ranked_info(
    summonerId,
):  # I believe this returns a list of ranked info for all queuetypes
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{REGION_BASE_URL}lol/league/v4/entries/by-summoner/{summonerId}"
    response = requests.get(url, headers=header)
    response = response.json()
    return response
