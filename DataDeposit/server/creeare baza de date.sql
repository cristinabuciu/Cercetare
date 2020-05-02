CREATE TABLE loginTable (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(55) NOT NULL,
    password varchar(55) NOT NULL,
    PRIMARY KEY (id)
);

insert into loginTable(username, password) values("John", "abcd");
insert into loginTable(username, password) values("admin", "admin");