from models import Profile
from api_client import get_puuid, get_match_history

puuid = get_puuid()  # TODO: Implement user input to get anyone's puuid

user = Profile(puuid)

match_history = get_match_history(user.puuid)
# print(get_match_details(match_history[0]))
print(user.riotId)
print(user.summonerId)
print(user.accountId)
print(user.puuid)
print(user.level)

print(user.rankInfo.tier)
print(user.rankInfo.rank)
