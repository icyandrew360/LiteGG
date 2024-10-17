from models.models import Profile, ChampionMasteries, RankedInfo
from api.api_client import get_puuid
from utils.helpers import create_patch_data_cache
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel

create_patch_data_cache()  # Called once to create cache from riot's latest patch. does not need to be called again.
# print(get_champion_by_key(1))
# print(get_queue_by_id(440))

# puuid = get_puuid("famercate123", "bow")

# user = Profile(puuid)

# match_history = get_match_history(user.puuid)
# print(get_match_details(match_history[0]))
# print(user.riotId)
# print(user.summonerId)
# print(user.accountId)
# print(user.puuid)
# print(user.level)

# print(
#     user.rankInfo.rankedQueueInfo[0]
# )  # a list of ranked queue info in order of most played queue type.

app = FastAPI()


class UserInfoRequest(BaseModel):
    riotID: str  # "riotID": "username#tagline". Is validated by frontend.


@app.get("/user-info")
async def user_info(
    riotID: str = Query(..., description="Riot ID in the format of username#tagline"),
):  # NOTE the hash symbol is not allowed in the query parameter.
    # make sure the # in the riot ID is replaced with %23 when sending requests from the frontend.
    if not riotID:
        raise HTTPException(status_code=400, detail="Please provide a valid Riot ID")
    print(riotID)
    id, tagline = riotID.split("#")
    puuid = get_puuid(id, tagline)

    summonerInfo = await Profile.create(puuid)
    userMasteries = await ChampionMasteries.create(puuid)
    userRankedInfo = await RankedInfo.create(summonerInfo.summonerId)

    return {
        "summonerInfo": summonerInfo,
        "userMasteries": userMasteries,
        "userRankedInfo": userRankedInfo,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
