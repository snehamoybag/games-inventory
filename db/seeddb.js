#! /user/bin/env node

const { Client } = require("pg");

const SQL = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    logo_url VARCHAR(255),
    coverimg_url VARCHAR(255),
    details VARCHAR(2000),
    price DECIMAL
  );
  
  CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    logo_url VARCHAR(255),
    coverimg_url VARCHAR(255),
    details VARCHAR(2000) 
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    icon_url VARCHAR(255) 
  );

  CREATE TABLE IF NOT EXISTS games_developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    developer_id INTEGER,
    FOREIGN KEY (game_id) REFERENCES games (id),
    FOREIGN KEY (developer_id) REFERENCES developers (id)
  );

  CREATE TABLE IF NOT EXISTS games_categories (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER,
    category_id INTEGER,
    FOREIGN KEY (game_id) REFERENCES games (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
  );

  INSERT INTO categories (name) VALUES 
    ('Action'),
    ('Adventure'),
    ('Arcade'),
    ('Fighting'),
    ('Fantasy'),
    ('Racing'),
    ('Strategy'),
    ('Simulation'),
    ('Role Playing'),
    ('Single Player'),
    ('Multi-Player'),
`;

const main = async () => {
  const connectionString = process.argv[2];

  const client = new Client({
    connectionString: connectionString,
  });

  console.log("Connecting ...");
  await client.connect();

  console.log("seeding ...");
  await client.query(SQL);

  await client.end();
  console.log("done");
};

main();
