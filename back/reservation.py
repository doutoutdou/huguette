from datetime import datetime
from flask import make_response, abort, jsonify
import json
from marshmallow import Schema, fields, post_load
from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, text
from sqlalchemy.sql.sqltypes import Boolean

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

def get_db_connection():
    engine = create_engine('sqlite:///../bdd/beerzone.db', echo = True)
    return engine.connect()

class Reservation:
    def __init__(self, id, day, booked):
        self.id = id
        self.day = day
        self.booked = booked

    def __repr__(self):
        return "<Reservation(id={self.id!r})>".format(self=self)

class ReservationSchema(Schema):
    id = fields.Integer()
    day = fields.Str()
    booked = fields.Boolean()

# Create a handler for our read (GET) people
def read_all():
    """
    This function responds to a request for /api/people
    with the complete lists of people

    :return:        sorted list of people
    """
    # Create the list of people from our data
    conn = get_db_connection()
    meta = MetaData()

    reservations = Table(
        'reservation', meta, 
        Column('id', Integer, primary_key = True), 
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

    print("toto")
    return jsonResult

def read(id):
    if id in RESERVATION:
        reservation = RESERVATION.get(id)
    
    else:
        abort(
            404, "Reservation with id {id} not found".format(id=id)
        )

    return reservation

#def update(id, booked):
 #   if id in RESERVATION:
