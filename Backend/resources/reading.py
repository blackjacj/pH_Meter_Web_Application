from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from db import db
from models import ReadingModel, TestModel
from schemas import ReadingSchema, PlainReadingSchema

blp = Blueprint("readings", __name__, description="Operations on readings")

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