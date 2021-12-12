from datetime import datetime
# from flask import make_response, abort, jsonify
# import json
from marshmallow import Schema, fields, post_load
from sqlalchemy import create_engine, event, Table, Column, Integer, String, MetaData, text, select
from sqlalchemy.sql.expression import false
from sqlalchemy.sql.sqltypes import Boolean
from sqlalchemy.engine import Engine
import datetime

# Necessaire pour gérer les FK avec sqlite
# Voir https://docs.sqlalchemy.org/en/14/dialects/sqlite.html#foreign-key-support
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
    
def get_db_connection():
    engine = create_engine('sqlite:///../bdd/beerzone.db', echo=True)

    return engine.connect()

def validate_date(date_text):
    try:
        datetime.datetime.strptime(date_text, '%d-%m-%Y')
    except ValueError:
        raise ValueError("Incorrect data format, should be DD-MM-YYYY")

class ReservationSchema(Schema):
    id = fields.Int()
    day = fields.Str()
    booked = fields.Bool()


def reservation_table() :
    
    meta = MetaData()
    
    return Table(
        'reservation', meta,
        Column('id', Integer, primary_key=True),
        Column('day', String),
        Column('booked', Boolean),
    )

def orders_table() :
    
    meta = MetaData()
    
    return Table(
        'orders', meta,
        Column('id', Integer, primary_key=True),
        Column('reservation_id', Integer),
        Column('customer_name', String),
        Column('customer_order', String),
    )
    
def get_reservations():

    conn = get_db_connection()
    
    reservations = reservation_table()

    # class ReservationSchema(Schema):
    #     id = fields.Int()
    #     day = fields.Str()
    #     booked = fields.Bool()

    request = reservations.select()
    result = conn.execute(request)
    conn.close
    
    schema = ReservationSchema(many=True)
    jsonResult = schema.dump(result)

    return jsonResult


def create_reservation(day):

    validate_date(day)
    conn = get_db_connection()

    reservations = reservation_table()

    insert = reservations.insert().values(day=day, booked=bool(False))
    conn.execute(insert)
    conn.close

    return "created", 201

def delete_reservation(id):

    conn = get_db_connection()

    reservations = reservation_table()

    delete = reservations.delete().where(reservations.c.id == id)
    conn.execute(delete)
    conn.close

    return "deleted", 204

def get_orders(id):

    conn = get_db_connection()

    class OrderSchema(Schema):
        id = fields.Int()
        reservation_id = fields.Int()
        customer_name = fields.Str()
        customer_order = fields.Str()

    request = select([text("* from orders where reservation_id = :id")])
    result = conn.execute(request, id=id).fetchall()
    conn.close

    schema = OrderSchema(many=True)
    jsonResult = schema.dump(result)

    return jsonResult

def create_order(id, customer_name, customer_order):

    print(id, customer_name, customer_order)
    conn = get_db_connection()

    orders = orders_table()

    insert = orders.insert().values(reservation_id=id, customer_name=customer_name, customer_order=customer_order)
    conn.execute(insert)
    conn.close
    
    return "created", 201

def delete_order(id):

    conn = get_db_connection()

    orders = orders_table()

    delete = orders.delete().where(orders.c.id == id)
    
    conn.execute(delete)
    conn.close

    return "deleted", 204