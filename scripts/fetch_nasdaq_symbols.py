import requests
import json
from azure.cosmosdb.table.tableservice import TableService
from azure.cosmosdb.table.models import Entity
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)

NASDAQ_API = "https://www.nasdaq.com/api/v1/screener"
PARAMS = {'page': 1, 'pageSize': 10} 
AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
TABLE = os.getenv('SYMBOL_TABLE')
EXCANGE="NASDAQ"

#load data
response = requests.get(url = NASDAQ_API, params = PARAMS)
symbols = json.loads(response.text)

#connect to azure storage
table_service = TableService(connection_string=AZURE_STORAGE_CONNECTION_STRING)


data = symbols['data']
for item in data:
    ticker = item['ticker']
    company = item['company']
    rowKey = EXCANGE + ":" + ticker;
    task = {'PartitionKey': "SymbolID", 'RowKey': rowKey, 'exchange': EXCANGE,  'code': ticker, 'name': company}
    try:
        table_service.insert_entity(TABLE, task)
    except ValueError as ve:
        print(ve)

    