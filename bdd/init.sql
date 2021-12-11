PRAGMA foreign_keys=off;
drop table if exists reservation;
create table reservation (
    id integer primary key AUTOINCREMENT, 
    day varchar(20) unique not null, 
    booked boolean
);

drop table if exists orders;
create table orders (
    id integer primary key AUTOINCREMENT, 
    reservation_id integer not null,
    customer_name varchar(50) not null,
    customer_order varchar(50) not null,
    CONSTRAINT fk_reservation FOREIGN KEY (reservation_id) REFERENCES reservation (id) ON DELETE CASCADE
);

PRAGMA foreign_keys=on;
