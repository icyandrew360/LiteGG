from api.api_client import (
    get_champion_masteries,
    get_summoner_info,
    get_riot_id,
    get_ranked_info,
)


class Profile:
    puuid = None
    riotId = None
    accountId = None
    summonerId = None  # soon to be deprecated
    topTenChampions = None
    summonerLevel = 0
    rankInfo = None

    def __init__(self, puuid):
        self.puuid = puuid
        self.riotId = get_riot_id(puuid)
        self.topTenChampions = get_champion_masteries(puuid)
        summoner_info = get_summoner_info(puuid)
        self.level = summoner_info["summonerLevel"]
        self.summonerId = summoner_info["summonerId"]
        self.accountId = summoner_info["accountId"]
        self.rankInfo = RankedInfo(self.summonerId)


class RankedInfo:
    tier = None
    rank = None
    wins = None
    losses = None
    lp = None
    winrate = None
    summonerId = None

    def __init__(
        self, summonerId
    ):  # Initialize with the most played queue type. can call this method to get ranked info for a different queue type explicitly
        self.summonerId = summonerId
        ranked_info = get_ranked_info(summonerId)
        self.tier = ranked_info[0]["tier"]
        self.rank = ranked_info[0]["rank"]
        self.wins = ranked_info[0]["wins"]
        self.losses = ranked_info[0]["losses"]
        self.lp = ranked_info[0]["leaguePoints"]
        self.winrate = self.calculate_winrate()

    def calculate_winrate(self):
        return round((self.wins / (self.wins + self.losses)) * 100, 2)
