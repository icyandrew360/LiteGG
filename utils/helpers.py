import time
import requests
from exceptions.exceptions import ChampionLoadingError


def convert_sec_to_time(sec):
    return time.strftime("%H:%M:%S", time.gmtime(sec))


def convert_unix_to_date(unix):
    return time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(unix / 1000))


def get_gamemode(string):
    gamemode_dict = {
        "CLASSIC": "Summoner's Rift",
        "ARAM": "ARAM",
        "URF": "URF",
        "NEXUSBLITZ": "Nexus Blitz",
        "ULTBOOK": "Ultimate Spellbook",
    }
    return gamemode_dict[string] if string in gamemode_dict else string


def get_match_participant_details(response):
    return [
        {
            "summonerName": participant["summonerName"],
            "riotIdTagline": participant["riotIdTagline"],
            "champion": participant["championName"],
            "win": participant["win"],
            "kills": participant["kills"],
            "deaths": participant["deaths"],
            "assists": participant["assists"],
            "cs_score": participant["totalMinionsKilled"],
        }
        for participant in response["info"]["participants"]
    ]


CHAMPION_DATA_PATH = "lol_patch_data/champion.json"  # This needs to be updated every patch. Is there a better way?

championJson = {}


def load_latest_champion_data():
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

    raise ChampionLoadingError(
        "Failed to load champion data from all available versions."
    )


championIdCache = {}


def create_champion_id_cache():
    championData = load_latest_champion_data()
    for champion_info in championData["data"].values():
        championIdCache[int(champion_info["key"])] = champion_info["name"]


def get_champion_by_key(key):
    if championIdCache.get(key):
        return championIdCache[key]

    return championIdCache[key]
