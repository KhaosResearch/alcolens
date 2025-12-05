import requests
import random
import time

url = "http://localhost:3000/api/responses"

def generate_fake_response():
    return {
        "patientId": f"FAKE-{random.randint(1000, 9999)}",
        "sex": random.choice(["man", "woman"]),
        "studyLevel": "primary",
        "answers": {"q1": 1, "q2": 2},
        "totalScore": random.randint(0, 40),
        "levelResult": random.choice(["green", "yellow", "ambar", "red"]),
        "consent": True
    }

print("Starting spam attack on /api/responses...")
for i in range(10):
    payload = generate_fake_response()
    try:
        res = requests.post(url, json=payload)
        print(f"Request {i+1}: Status {res.status_code}")
    except Exception as e:
        print(f"Request {i+1}: Failed {e}")
    time.sleep(0.1)
