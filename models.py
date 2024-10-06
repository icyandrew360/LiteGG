from api_client import (
    get_champion_masteries,
    get_summoner_info,
    get_riot_id,
)


class Profile:
    puuid = None
    riotId = None
    accountId = None
    summonerId = None  # soon to be deprecated
    topTenChampions = None
    summonerLevel = 0
    rank = None

    def __init__(self, puuid):
        self.puuid = puuid
        self.riotId = get_riot_id(puuid)
        self.topTenChampions = get_champion_masteries(puuid)
        self.level = get_summoner_info(puuid)["summonerLevel"]
        self.summonerId = get_summoner_info(puuid)["summonerId"]
        self.accountId = get_summoner_info(puuid)["accountId"]
