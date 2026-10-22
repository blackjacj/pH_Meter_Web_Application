from db import db

class ReadingModel(db.Model):
    __tablename__ = "readings"
    __table_args__ = (db.UniqueConstraint("test_id", "meter", "time"),)

    id = db.Column(db.Integer, primary_key=True)
    meter = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Integer, nullable=False)
    ph_value = db.Column(db.Float, nullable=False)
    test_id = db.Column(db.Integer, db.ForeignKey("tests.id"), nullable=False)
    test = db.relationship("TestModel", back_populates="readings")