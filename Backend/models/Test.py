from db import db
from datetime import datetime, timezone

class TestModel(db.Model):
    __tablename__ = "tests"
    __table_args__ = (db.UniqueConstraint("user_id", "name"),)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    note = db.Column(db.String(500), nullable=False)
    date = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("UserModel", back_populates="tests")
    readings = db.relationship("ReadingModel", back_populates="test", lazy="dynamic", cascade="all, delete")
    