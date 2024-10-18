from models.models import Profile, ChampionMasteries, RankedInfo
from api.api_client import get_puuid
from utils.helpers import create_patch_data_cache
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

create_patch_data_cache()

# for testing userinfo purposes: curl "http://0.0.0.0:8000/user-info?riotID=andrew%23howe"
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",  # React development server
    "http://localhost:5173",  # Vite dev server
    "http://litegg.com",  # Production domain when it comes time to deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
