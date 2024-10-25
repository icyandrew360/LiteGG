import os
from dotenv import load_dotenv

load_dotenv()

RIOT_KEY = os.getenv("RIOT_API_KEY")
