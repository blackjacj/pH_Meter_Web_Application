import threading, time, serial, random
from flask import request, current_app
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from db import db
from serial.tools import list_ports
from models import ReadingModel, TestModel
from schemas import ReadingSchema, PlainReadingSchema

blp = Blueprint("readings", __name__, description="Operations on readings")
USE_FAKE_DATA = True
running = {}

def read_loop(app, test_id, port, seconds, stop_event):
    with app.app_context():
        ser = None if USE_FAKE_DATA else serial.Serial(port, 9600, timeout=2)
        start = time.time()
        meters = range(1, 13)

        while not stop_event.is_set():
            if USE_FAKE_DATA:
                time.sleep(1)
                lines = [
                    f"{m},{round(7 + random.uniform(-1, 1), 2)},{round(2.5 + random.uniform(-0.5, 0.5), 2)}"
                    for m in meters
                ]
            else:
                lines = [ser.readline().decode(errors="ignore").strip()]

            elapsed = int(time.time() - start)
            if elapsed >= seconds:
                break

            for line in lines:
                try:
                    m, ph, voltage = line.split(",")
                    reading = ReadingModel(test_id=test_id, meter=int(m), time=elapsed,
                                           ph_value=float(ph), voltage=float(voltage))
                    db.session.add(reading)
                except ValueError:
                    continue

            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
        if ser:
            ser.close()
        running.pop(test_id, None)

@blp.route("/ports")
class Ports(MethodView):
    @jwt_required()
    def get(self):
        return [
            {"device": p.device, "description": p.description}
            for p in list_ports.comports()
        ]

@blp.route("/test/<int:test_id>/readings")
class TestReadings(MethodView):
    @jwt_required()
    @blp.response(200, PlainReadingSchema(many=True))
    def get(self, test_id):
        if db.session.get(TestModel, test_id) is None:
            abort(404, message="Test not found.")

        after = request.args.get("after", -1, type=int)
        meter = request.args.get("meter", type=int)

        query = ReadingModel.query.filter(
            ReadingModel.test_id == test_id,
            ReadingModel.time > after
        )
        if meter is not None:
            query = query.filter(ReadingModel.meter == meter)

        return query.order_by(ReadingModel.time).all()

@blp.route("/reading")
class ReadingList(MethodView):
    @jwt_required()
    @blp.response(200, ReadingSchema(many=True))
    def get(self):
        return ReadingModel.query.all()

    @jwt_required()
    @blp.arguments(ReadingSchema)
    @blp.response(201, ReadingSchema)
    def post(self, reading_data):
        if db.session.get(TestModel, reading_data["test_id"]) is None:
            abort(404, message="Test not found.")

        reading = ReadingModel(**reading_data)
        try:
            db.session.add(reading)
            db.session.commit()
        except IntegrityError:
            abort(
                400,
                message="Reading already exists."
            )
        except SQLAlchemyError:
            abort(500, message="An error occurred creating the reading.")
        return reading

@blp.route("/test/<int:test_id>/start")
class TestStart(MethodView):
    @jwt_required()
    def post(self, test_id):
        test = db.session.get(TestModel, test_id)
        if test is None or test.user_id != int(get_jwt_identity()):
            abort(404, message="Test not found.")
        if test_id in running:
            abort(404, message="Already running.")

        data = request.get_json(silent=True) or {}
        stop_event = threading.Event()
        running[test_id] = stop_event
        threading.Thread(
            target=read_loop,
            args=(current_app._get_current_object(), test_id,
                  data.get("port", "COM3"), data.get("seconds", 60), stop_event),
            daemon=True
        ).start()
        return {"status": "started"}

@blp.route("/test/<int:test_id>/stop")
class TestStop(MethodView):
    @jwt_required()
    def post(self, test_id):
        if test_id in running:
            running[test_id].set()
        return {"status": "stopped"}