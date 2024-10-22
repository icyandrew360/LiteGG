import json
import time
from datetime import datetime
import requests
from exceptions.exceptions import PatchLoadingError


def convert_sec_to_time(sec):
    return time.strftime("%H:%M:%S", time.gmtime(sec))


def convert_unix_to_date(unix):
    local_time = datetime.fromtimestamp(unix / 1000)

    # mountain_TZ = pytz.timezone('US/Mountain')
    # mountain_time = utc_time.replace(tzinfo=pytz.utc).astimezone(mountain_TZ)
    return local_time.strftime("%Y-%m-%d %H:%M:%S")


def get_gamemode(string):
    gamemode_dict = {
        "CLASSIC": "Summoner's Rift",
        "ARAM": "ARAM",
        "URF": "URF",
        "NEXUSBLITZ": "Nexus Blitz",
        "ULTBOOK": "Ultimate Spellbook",
    }
    return gamemode_dict[string] if string in gamemode_dict else string


def get_match_participant_details(response, winner):
    if winner:
        return [
            {
                "riotIdName": participant["riotIdGameName"],
                "riotIdTagline": participant["riotIdTagline"],
                "champion": participant["championName"],
                "win": participant["win"],
                "kills": participant["kills"],
                "deaths": participant["deaths"],
                "assists": participant["assists"],
                "cs_score": participant["totalMinionsKilled"],
            }
            for participant in response["info"]["participants"]
            if participant["win"]
        ]
    else:
        return [
            {
                "riotIdName": participant["riotIdGameName"],
                "riotIdTagline": participant["riotIdTagline"],
                "champion": participant["championName"],
                "win": participant["win"],
                "kills": participant["kills"],
                "deaths": participant["deaths"],
                "assists": participant["assists"],
                "cs_score": participant["totalMinionsKilled"],
            }
            for participant in response["info"]["participants"]
            if not participant["win"]
        ]


championJson = {}
gameTypeJson = {}


# RETURNS: champion data from the latest patch
def load_latest_patch_data():
    language = "en_US"  # We can change this to the users language.
    if championJson.get(language):
        return championJson[language]
    versionIndex = 0
    versionUrl = "https://ddragon.leagueoflegends.com/api/versions.json"
    versionResponse = requests.get(versionUrl).json()

    while versionIndex < len(versionResponse):
        version = versionResponse[versionIndex]
        championUrl = f"https://ddragon.leagueoflegends.com/cdn/{version}/data/{language}/champion.json"
        championResponse = requests.get(championUrl).json()

        if championResponse:
            championJson[language] = championResponse
            return championResponse

        versionIndex += 1

    raise PatchLoadingError("Failed to load patch data from all available versions.")


championIdCache = {}
QueueIdCache = {}
QUEUE_ID_DATAPATH = "lol_patch_data/queues.json"  # This needs to be updated every patch. Is there a better way?


def create_patch_data_cache():
    championData = load_latest_patch_data()
    for champion_info in championData["data"].values():
        championIdCache[int(champion_info["key"])] = champion_info["name"]
    with open(QUEUE_ID_DATAPATH, "r") as f:
        queueData = json.load(f)
        for queue in queueData:
            QueueIdCache[queue["queueId"]] = queue["description"]


def get_champion_by_key(key):
    if championIdCache.get(key):
        return championIdCache[key]


def get_queue_by_id(queueId):
    if QueueIdCache.get(queueId):
        return QueueIdCache[queueId]
