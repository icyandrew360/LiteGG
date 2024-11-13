from api.api_client import get_puuid, get_riot_id, get_match_history, get_match_details

# ALL TESTING PURPOSES
puuid = get_puuid("andrew", "howe")
riot_id = get_riot_id(puuid)
riotIdName, riotIdTagline = riot_id.split("#")
print(get_match_history(puuid))
for matchId in get_match_history(puuid):
    print("\n")
    print("current riot id name: ", riotIdName)
    print("current riot id tagline: ", riotIdTagline)
    match = get_match_details(matchId, riot_id)
    print(match)
    print("\n")

# get_match_details()
