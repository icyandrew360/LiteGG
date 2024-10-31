import requests
from config.consts import RIOT_KEY
from utils.helpers import (
    convert_sec_to_time,
    convert_unix_to_date,
    get_gamemode,
    get_match_participant_details,
    get_champion_by_key,
    get_queue_by_id,
)
from utils.response_handler import handle_response

# TODO: Implement user input to get anyone's puuid

BASE_URL = "https://americas.api.riotgames.com/"
REGION_BASE_URL = "https://na1.api.riotgames.com/"


def get_api_key():
    return RIOT_KEY


def get_puuid(id, tagline):
    url = f"{BASE_URL}riot/account/v1/accounts/by-riot-id/{id}/{tagline}"
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    response = requests.get(url, headers=header)
    response = handle_response(response)
    return response["puuid"]


# use match_v5 stats to get match history, this only returns match ids! no details
def get_match_history(puuid):
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{BASE_URL}lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count=10"  # TODO: Add query parameters for start and count
    response = requests.get(url, headers=header)
    response = handle_response(response)
    return response


def get_match_details(
    match_id,
):  # use this for listing 1 match's details after clicking the match
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{BASE_URL}lol/match/v5/matches/{match_id}"
    response = requests.get(url, headers=header)
    response = handle_response(response)
    # winner_participant_details = get_match_participant_details(response, winner=True)
    # loser_participant_details = get_match_participant_details(response, winner=False)
    simplified_details = {
        "game_metadata": {
            "gameMode": get_gamemode(response["info"]["gameMode"]),
            "queueId": response["info"]["queueId"],
            "queueType": get_queue_by_id(response["info"]["queueId"]),
            "gameDuration": convert_sec_to_time(response["info"]["gameDuration"]),
            "gameCreation": convert_unix_to_date(response["info"]["gameCreation"]),
            "gameId": response["metadata"]["matchId"],
        },
        "participants": get_match_participant_details(response),
        # "winning_team": winner_participant_details,
        # "losing_team": loser_participant_details,
    }
    return simplified_details


def get_riot_id(puuid):
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{BASE_URL}riot/account/v1/accounts/by-puuid/{puuid}"
    response = requests.get(url, headers=header)
    response = handle_response(response)
    return response["gameName"] + "#" + response["tagLine"]


def get_champion_masteries(
    puuid, max_masteries=10
):  # Added max_masteries parameter with default value 10
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{REGION_BASE_URL}lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}?count={max_masteries}"  # Added query parameter for max number of masteries to return
    response = requests.get(url, headers=header)
    response = handle_response(response)
    simplified_mastery_list = [
        {
            "champion": get_champion_by_key(champion["championId"]),
            "championLevel": champion["championLevel"],
            "championPoints": champion["championPoints"],
            "lastPlayTime": convert_unix_to_date(champion["lastPlayTime"]),
        }
        for champion in response
        # converting champ ids to name https://developer.riotgames.com/docs/lol#data-dragon
        # annoying.. need to download for every patch
    ]
    return simplified_mastery_list


def get_summoner_info(puuid):
    header = {"X-Riot-Token": f"{RIOT_KEY}"}
    url = f"{REGION_BASE_URL}lol/summoner/v4/summoners/by-puuid/{puuid}"
    response = requests.get(url, headers=header)
    response = handle_response(response)
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
    response = handle_response(response)
    return response
