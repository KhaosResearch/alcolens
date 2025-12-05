#!/bin/bash
# Attempt to send an email without authentication
curl -X POST http://localhost:3000/api/doctor/invite \
  -H "Content-Type: application/json" \
  -d '{
    "doctorName": "Hacker",
    "email": "test@example.com",
    "id": "123"
  }' \
  -v
