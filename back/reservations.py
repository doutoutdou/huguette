from datetime import datetime
from flask import make_response, abort, jsonify
import json
from marshmallow import Schema, fields, post_load
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, text, select
from sqlalchemy.sql.sqltypes import Boolean


def get_db_connection():
    engine = create_engine('sqlite:///../bdd/beerzone.db', echo=True)
    return engine.connect()


class ReservationSchema(Schema):
    id = fields.Integer()
    day = fields.Str()
    booked = fields.Boolean()

# Create a handler for our read_all (GET) reservation


def get():

    conn = get_db_connection()
    meta = MetaData()

    reservations     = Table(
        'reservation', meta,
        Column('id', Integer, primary_key=True),
        Column('day', String),
        Column('booked', Boolean),
    )

    class ReservationSchema(Schema):
        id = fields.Int()
        day = fields.Str()
        booked = fields.Bool()

    request = reservations.select()
    result = conn.execute(request)

    schema = ReservationSchema(many=True)
    jsonResult = schema.dump(result)

    return jsonResult


def getOrders(id):

    conn = get_db_connection()
    meta = MetaData()

    order = Table(
        'orders', meta,
        Column('id', Integer, primary_key=True),
        Column('reservation_id', Integer),
        Column('customer_name', String),
        Column('customer_order', String),
    )

    class OrderSchema(Schema):
        id = fields.Int()
        reservation_id = fields.Int()
        customer_name = fields.Str()
        customer_order = fields.Str()


    request = select([text("* from orders where reservation_id = :id")])
    result = conn.execute(request, id = id).fetchall()

    schema = OrderSchema(many=True)
    jsonResult = schema.dump(result)

    print(jsonResult)
    return jsonResult

