import time

def convert_sec_to_time(sec):
    return time.strftime('%H:%M:%S', time.gmtime(sec))

def convert_unix_to_date(unix):
    return time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(unix/1000))

def get_gamemode(string):
    gamemode_dict = {
        'CLASSIC': 'Summoner\'s Rift',
        'ARAM': 'ARAM',
        'URF': 'URF',
        'NEXUSBLITZ': 'Nexus Blitz',
        'ULTBOOK': 'Ultimate Spellbook',
    }
    return gamemode_dict[string] if string in gamemode_dict else string

def get_match_participant_details(response):
    return [{
        'summonerName': participant['summonerName'],
        'riotIdTagline': participant['riotIdTagline'],
        'champion': participant['championName'],
        'win': participant['win'],
        'kills': participant['kills'],
        'deaths': participant['deaths'],
        'assists': participant['assists'],
        'cs_score': participant['totalMinionsKilled'],
    } for participant in response['info']['participants']]