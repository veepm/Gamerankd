DROP TABLE IF EXISTS users,ratings,reviews,game_lists;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE CONSTRAINT proper_email CHECK (email ~* '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
  password_hash CHAR(60) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reviews(
  review_id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <=5),
  review_text TEXT,
  user_id INTEGER REFERENCES users,
  game_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id,game_id)
);

CREATE TABLE game_lists(
  list_name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users,
  game_id INTEGER,
  PRIMARY KEY (list_name, user_id, game_id),
  created_at TIMESTAMP DEFAULT NOW()
);
