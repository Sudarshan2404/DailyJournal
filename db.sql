CREATE TABLE entries(
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id),
entry TEXT,
date DATE
)