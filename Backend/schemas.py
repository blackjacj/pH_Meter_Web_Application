from marshmallow import Schema, fields, validate

class PlainReadingSchema(Schema):
    meter = fields.Int(required=True, validate=validate.Range(min=1, max=12))
    time = fields.Int(required=True, validate=validate.Range(min=0))
    ph_value = fields.Float(required=True, validate=validate.Range(min=0, max=14))
    voltage = fields.Float(required=True, validate=validate.Range(min=0))

class PlainTestSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(min=1, max=80))
    note = fields.Str(allow_none=True, validate=validate.Length(max=500))
    date = fields.DateTime(dump_only=True, format="%Y-%m-%dT%H:%M:%SZ")

class TestUpdateSchema(Schema):
    name = fields.Str(validate=validate.Length(min=1, max=80))
    note = fields.Str(validate=validate.Length(max=500))

class ReadingSchema(PlainReadingSchema):
    test_id = fields.Int(required=True, load_only=True)
    test = fields.Nested(PlainTestSchema, dump_only=True)

class TestSchema(PlainTestSchema):
    readings = fields.List(fields.Nested(PlainReadingSchema()), dump_only=True)

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=30))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=8))