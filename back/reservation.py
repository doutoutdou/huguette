from datetime import datetime
from flask import make_response, abort, jsonify
import sqlite3
import json
from marshmallow import Schema, fields

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

def get_db_connection():
    conn = sqlite3.connect('../bdd/beerzone.db')
    conn.row_factory = sqlite3.Row
    return conn

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

# Data to serve with our API
RESERVATION = {
    "day1": {
        "id" : "1",
        "day": "01/01/2021",
        "booked": "false"
    },
    "day2": {
        "id" : "2",
        "day": "01/02/2021",
        "booked": "false"
    },
    "day3": {
        "id" : "3",
        "day": "01/03/2021",
        "booked": "true"
    }
}

# Create a handler for our read (GET) people
def read_all():
    """
    This function responds to a request for /api/people
    with the complete lists of people

    :return:        sorted list of people
    """
    # Create the list of people from our data
    #return [RESERVATION[key] for key in sorted(RESERVATION.keys())]
    conn = get_db_connection()
    cursor = conn.cursor()
    reservation = cursor.execute('SELECT * from reservation').fetchone()[1]
    #rows = cursor.fetchall()

#    for row in reservation:
#        print(row)

    # schema = ReservationSchema()
    #result = schema.dump(reservation)
    #print(reservation)
    #conn.close

    return reservation

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
