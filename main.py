from models.models import Profile
from api.api_client import get_puuid, get_match_details, get_match_history
from utils.helpers import get_champion_by_key, create_patch_data_cache, get_queue_by_id

create_patch_data_cache()  # Called once to create cache from riot's latest patch. does not need to be called again.
print(get_champion_by_key(1))
print(get_queue_by_id(440))

puuid = get_puuid("famercate123", "bow")

user = Profile(puuid)

match_history = get_match_history(user.puuid)
print(get_match_details(match_history[0]))
print(user.riotId)
print(user.summonerId)
print(user.accountId)
print(user.puuid)
print(user.level)

print(
    user.rankInfo.rankedQueueInfo[0]
)  # a list of ranked queue info in order of most played queue type.
