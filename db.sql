DROP TABLE IF EXISTS users,reviews,lists,list_games;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE CONSTRAINT proper_email CHECK (email ~* '^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'),
  password_hash CHAR(60) NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE reviews(
  review_id SERIAL PRIMARY KEY,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <=5),
  review_text TEXT,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  game_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id,game_id)
);

CREATE TABLE lists(
  list_id SERIAL PRIMARY KEY,
  list_name VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id,list_name)
);

CREATE TABLE list_games(
  game_id INTEGER NOT NULL,
  list_id INTEGER REFERENCES lists ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (list_id, game_id)
);

CREATE OR REPLACE FUNCTION update_lists_updated_at_fun()
RETURNS TRIGGER AS $$
BEGIN 
UPDATE lists SET updated_at = NOW() WHERE list_id = NEW.list_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_lists_updated_at_trg AFTER INSERT ON list_games
FOR EACH ROW EXECUTE FUNCTION update_lists_updated_at_fun();

CREATE OR REPLACE FUNCTION update_reviews_updated_at_fun()
RETURNS TRIGGER AS $$
BEGIN 
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_reviews_updated_at_trg BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at_fun();
