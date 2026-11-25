from flask.views import MethodView
from flask import Response
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from db import db
from models import TestModel, ReadingModel
from schemas import TestSchema, PlainTestSchema, TestUpdateSchema
import csv, io

blp = Blueprint("tests", __name__, description="Operations on tests")

def get_own_test(test_id):
    test = db.session.get(TestModel, test_id)
    if test is None or test.user_id != int(get_jwt_identity()):
        abort(404, message="Test not found.")
    return test


@blp.route("/test/<int:test_id>")
class Test(MethodView):
    @blp.response(200, TestSchema)
    @jwt_required()
    def get(self, test_id):
        return get_own_test(test_id)

    @jwt_required()
    @blp.arguments(TestUpdateSchema)
    @blp.response(200, PlainTestSchema)
    def put(self, test_data, test_id):
        test = get_own_test(test_id)
        for key, value in test_data.items():
            setattr(test, key, value)
        try:    
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message="You already have a test with that name.")
        return test

    @jwt_required()
    def delete(self, test_id):
        test = TestModel.query.get_or_404(test_id)
        db.session.delete(test)
        db.session.commit()
        return {"message": "Test deleted."}

@blp.route("/test")
class TestList(MethodView):
    @jwt_required()
    @blp.response(200, PlainTestSchema(many=True))
    def get(self):
        user_id = int(get_jwt_identity())
        return (TestModel.query
                .filter_by(user_id=user_id)
                .order_by(TestModel.date.desc())
                .all())

    @jwt_required()
    @blp.arguments(PlainTestSchema)
    @blp.response(201, PlainTestSchema)
    def post(self, test_data):
        test = TestModel(**test_data, user_id=int(get_jwt_identity()))
        try:
            db.session.add(test)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, message="A test with that name already exists.")
        except SQLAlchemyError:
            db.session.rollback()
            abort(500, message="An error occurred creating the test.")

        return test

@blp.route("/test/<int:test_id>/export")
class TestExport(MethodView):
    @jwt_required()
    def get(self, test_id):
        test = db.session.get(TestModel, test_id)
        if test is None or test.user_id != int(get_jwt_identity()):
            abort(404, message="Test not found.")

        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(["time", "meter", "ph_value", "voltage"])

        readings = (ReadingModel.query
                    .filter_by(test_id=test_id)
                    .order_by(ReadingModel.time, ReadingModel.meter)
                    .all())
        for r in readings:
            writer.writerow([r.time, r.meter, r.ph_value, r.voltage])

        return Response(out.getvalue(), mimetype="text/csv")