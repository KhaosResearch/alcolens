import requests
import json

url = "http://localhost:3000/api/doctor/results"

try:
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        print(f"Successfully dumped {len(data.get('data', []))} records.")
        print(json.dumps(data, indent=2))
    else:
        print(f"Failed to dump data. Status: {res.status_code}")
except Exception as e:
    print(f"Error: {e}")
