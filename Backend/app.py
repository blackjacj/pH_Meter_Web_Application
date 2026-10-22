import uuid
from flask import Flask, request
from flask_cors import CORS
from db import db
import models
from Backend.db import tests, readings
from flask_smorest import abort


app = Flask(__name__)
CORS(app)

#GETS ALL TESTS
@app.get('/test')
def get_tests():
    return {"Tests": list(tests.values())}

#CREATES A NEW TEST
@app.post('/test')
def create_test():
    test_data = request.get_json()
    if "test_name" not in test_data:
        abort(
            400,
            message="Bad request. Ensure 'test_name' is included in the JSON payload.",
        )

    for test in tests.values():
        if test_data["test_name"] == test["test_name"]:
            abort(400, message=f"Test already exists.")
    test_id = uuid.uuid4().hex
    test = {**test_data, "id": test_id}
    tests[test_id] = test
    return test, 201

#DELETES A TEST
@app.delete("/test/<string:test_id>")
def delete_test(test_id):
    try:
        del tests[test_id]
        return {"message": "Test deleted."}
    except KeyError:
        abort(404, message="Test not found.")

#GETS A SPECIFIC TEST
@app.get("/test/<string:test_id>")
def get_test(test_id):
    try:
        return tests[test_id]
    except KeyError:
        return abort(404, message="Test not found")

#EDITS A TEST
@app.put("/test/<string:test_id>")
def update_test(test_id):
    test_data = request.get_json()
    if "test_name" not in test_data or "note" not in test_data:
        abort(400, message="Bad request. Ensure 'test_name', and 'note' are included in the JSON payload.")

    try:
        test = tests[test_id]
        test |= test_data

        return test
    except KeyError:
        abort(404, message="Test not found.")

#CREATES A NEW READING
@app.post("/reading")
def create_reading():
    reading_data = request.get_json()
    
    if reading_data["test_id"] not in tests:
        return abort(404, message="Test not found")

    reading_id = uuid.uuid4().hex
    reading = {**reading_data, "id": reading_id}
    readings[reading_id] = reading

    return reading, 201

#GETS ALL READINGS
@app.get("/reading")
def get_all_readings():
    return {"Readings": list(readings.values())}

#GETS SPECIFIC READING BASED ON ID
@app.get("/reading/<string:reading_id>")
def get_reading(reading_id):
    try:
        return readings[reading_id]
    except KeyError:
        return abort(404, message="Reading not found")