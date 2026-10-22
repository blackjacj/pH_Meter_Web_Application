from marshmallow import Schema, fields, validate

class PlainReadingSchema(Schema):
    id = fields.Int(dump_only=True)
    meter = fields.Int(required=True, validate=validate.OneOf([1, 2]))
    time = fields.Int(required=True)
    ph_value = fields.Float(required=True, validate=validate.Range(min=0, max=14))

class PlainTestSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(max=80))
    note = fields.Str(validate=validate.Length(max=500))
    date = fields.DateTime(dump_only=True)

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
    password = fields.Str(required=True, load_only=True)