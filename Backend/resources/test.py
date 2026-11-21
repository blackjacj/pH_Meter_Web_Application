import uuid
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from db import db
from models import TestModel
from schemas import TestSchema, PlainTestSchema, TestUpdateSchema

blp = Blueprint("tests", __name__, description="Operations on tests")


@blp.route("/test/<string:test_id>")
class Test(MethodView):
    @blp.response(200, TestSchema)
    def get(self, test_id):
        return TestModel.query.get_or_404(test_id)

    @blp.arguments(TestUpdateSchema)
    @blp.response(200, PlainTestSchema)
    def put(self, test_data, test_id):
        test = TestModel.query.get_or_404(test_id)
        for key, value in test_data.items():
            setattr(test, key, value)
        db.session.commit()
        return test

    def delete(self, test_id):
        test = TestModel.query.get_or_404(test_id)
        db.session.delete(test)
        db.session.commit()
        return {"message": "Test deleted."}

@blp.route("/test")
class TestList(MethodView):
    @blp.response(200, TestSchema(many=True))
    def get(self):
        return TestModel.query.all()

    @blp.arguments(TestSchema)
    @blp.response(200, TestSchema)
    def post(self, test_data):
        test = TestModel(**test_data)
        try:
            db.session.add(test)
            db.session.commit()
        except IntegrityError:
            abort(
                400,
                message="A test with that name already exists."
            )
        except SQLAlchemyError:
            abort(500, message="An error occurred creating the test.")

        return test