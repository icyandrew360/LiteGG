from models import Profile
from api_client import get_puuid
from helpers import get_champion_by_key, create_champion_id_cache

create_champion_id_cache()  # Called once to create cache. does not need to be called again.

print(get_champion_by_key(1))

puuid = get_puuid()  # TODO: Implement user input to get anyone's puuid

user = Profile(puuid)

# match_history = get_match_history(user.puuid)
# print(get_match_details(match_history[0]))
# print(user.riotId)
# print(user.summonerId)
# print(user.accountId)
# print(user.puuid)
# print(user.level)

# print(user.rankInfo.tier)
# print(user.rankInfo.rank)
# print(user.rankInfo.winrate)
