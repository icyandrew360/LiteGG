from api.api_client import (
    get_champion_masteries,
    get_summoner_info,
    get_riot_id,
    get_ranked_info,
    get_match_history,
    get_match_details,
)


class Profile:
    def __init__(self, puuid, riotId, summonerLevel, summonerId, accountId):
        self.puuid = puuid
        self.riotId = riotId
        self.summonerLevel = summonerLevel
        self.summonerId = summonerId
        self.accountId = accountId

    @classmethod
    async def create(cls, puuid):
        riotId = get_riot_id(puuid)
        summoner_info = get_summoner_info(puuid)
        summonerLevel = summoner_info["summonerLevel"]
        summonerId = summoner_info["summonerId"]
        accountId = summoner_info["accountId"]
        return cls(puuid, riotId, summonerLevel, summonerId, accountId)


class ChampionMasteries:
    def __init__(self, championMasteryList):
        self.championMasteryList = championMasteryList

    @classmethod
    async def create(cls, puuid, max_masteries=10):
        championMasteryList = []
        all_masteries = get_champion_masteries(puuid, max_masteries)
        for mastery in all_masteries:
            championMasteryList.append(
                {
                    "champion": mastery["champion"],
                    "championLevel": mastery["championLevel"],
                    "championPoints": mastery["championPoints"],
                    "lastPlayTime": mastery["lastPlayTime"],
                }
            )
        return cls(championMasteryList)


class RankedInfo:
    def __init__(self, rankedQueueInfo):
        self.rankedQueueInfo = rankedQueueInfo

    @classmethod
    async def create(cls, summonerId):
        all_ranked_info = get_ranked_info(summonerId)
        rankedQueueInfo = []
        for queue in all_ranked_info:
            rankedQueueInfo.append(
                {
                    "queueType": queue["queueType"],
                    "tier": queue["tier"],
                    "rank": queue["rank"],
                    "wins": queue["wins"],
                    "losses": queue["losses"],
                    "lp": queue["leaguePoints"],
                    "winrate": cls.calculate_winrate(queue["wins"], queue["losses"]),
                }
            )
        return cls(rankedQueueInfo)

    @staticmethod
    def calculate_winrate(wins, losses):
        return round((wins / (wins + losses)) * 100, 2)


class MatchHistory:
    def __init__(self, matchIds):
        self.matchIds = matchIds

    @classmethod
    async def create(cls, puuid, start, count):
        matchIds = get_match_history(puuid, start, count)
        return cls(matchIds)

    @staticmethod
    def get_simple_match_details(matchId, riotId):
        allMatchDetails = get_match_details(matchId)

        print(allMatchDetails)
        # find if user is winner or loser
        # return win/lose and champion played
        # if puuid in allMatchDetails["winning_team"]["participants"][0]["puuid"]:
        #     simpleMatchDetails = {
        #         "win": True,
        #         "champion": allMatchDetails["winning_team"]["participants"][0]["champion"],
        #     }
        # simpleMatchDetails = {

        # }
        return get_match_details(matchId)
