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
    rankInfo = []

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
    rankedQueueInfo = []

    def __init__(self, summonerId):
        all_ranked_info = get_ranked_info(summonerId)
        for queue in all_ranked_info:
            self.rankedQueueInfo.append(
                {
                    "queueType": queue["queueType"],
                    "tier": queue["tier"],
                    "rank": queue["rank"],
                    "wins": queue["wins"],
                    "losses": queue["losses"],
                    "lp": queue["leaguePoints"],
                    "winrate": self.calculate_winrate(queue["wins"], queue["losses"]),
                }
            )

    def calculate_winrate(self, wins, losses):
        return round((wins / (wins + losses)) * 100, 2)
