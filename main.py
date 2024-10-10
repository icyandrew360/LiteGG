from models.models import Profile
from api.api_client import get_puuid, get_match_details, get_match_history
from utils.helpers import get_champion_by_key, create_champion_id_cache

create_champion_id_cache()  # Called once to create cache from riot's latest patch. does not need to be called again.

print(get_champion_by_key(1))

puuid = get_puuid("ninjahunterftw", "ftw")

user = Profile(puuid)

match_history = get_match_history(user.puuid)
print(get_match_details(match_history[0]))
print(user.riotId)
print(user.summonerId)
print(user.accountId)
print(user.puuid)
print(user.level)

print(user.rankInfo.tier)
print(user.rankInfo.rank)
print(user.rankInfo.winrate)
print(user.rankInfo.lp)
print(user.rankInfo.wins)
print(user.rankInfo.losses)
print(user.rankInfo.totalGames)
