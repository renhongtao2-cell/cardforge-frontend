import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import get_app

app = get_app()

async def handler(event, context):
    return await app(event, context)

handler = app