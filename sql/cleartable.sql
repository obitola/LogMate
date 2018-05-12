DROP TABLE users;

CREATE TABLE users (
    user_id int AUTO_INCREMENT, 
    email VARCHAR(255) UNIQUE, 
    first_name VARCHAR(255),
    last_name VARCHAR(255), 
    password VARCHAR(255), 
    PRIMARY KEY (user_id)
);

INSERT INTO users (email, first_name, last_name, password) VALUES ('a', 'b', 'c', 'd');
