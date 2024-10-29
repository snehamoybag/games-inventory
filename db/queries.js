const pool = require("./pool");

class Games {
  async getAll() {
    const { rows } = await pool.query("SELECT * FROM games ORDER BY name ASC");
    return rows;
  }

  async isNameTaken(name) {
    const query = "SELECT name FROM games WHERE name ILIKE $1";
    const { rows } = await pool.query(query, [name]);

    return rows.length > 0;
  }

  async add(
    name,
    logoUrl,
    coverImgUrl,
    details,
    price,
    developerIds,
    categoryIds,
  ) {
    const addTOGamesQuery = `INSERT INTO games (name, logo_url, coverimg_url, details, price) 
      VALUES($1, $2, $3, $4, $5) RETURNING id`; // returns modified rows id

    const gameId = await pool
      .query(addTOGamesQuery, [
        name,
        logoUrl,
        coverImgUrl,
        details,
        Number(price),
      ])
      .then(({ rows }) => rows[0].id);

    developerIds.forEach(async (devId) => {
      const query = `INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2)`;
      await pool.query(query, [Number(gameId), Number(devId)]);
    });

    categoryIds.forEach(async (categoryId) => {
      const query = `INSERT INTO games_categories (game_id, category_id) VALUES ($1, $2)`;
      await pool.query(query, [Number(gameId), Number(categoryId)]);
    });
  }
}

class Developers {
  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM developers ORDER BY name ASC",
    );

    return rows;
  }

  async isNameTaken(name) {
    const query = "SELECT name FROM developers WHERE name ILIKE $1";
    const { rows } = await pool.query(query, [name]);

    return rows.length > 0;
  }

  async add(name, details, logoUrl, coverImgUrl) {
    const query = `INSERT INTO developers (name, details, logo_url, coverimg_url) 
      VALUES ($1, $2, $3, $4)`;

    await pool.query(query, [name, details, logoUrl, coverImgUrl]);
  }
}

class Categories {
  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC",
    );
    return rows;
  }

  async isNameTaken(name) {
    const query = "SELECT name FROM categories WHERE name ILIKE $1";
    const { rows } = await pool.query(query, [name]);

    return rows.length > 0;
  }

  async add(name, iconUrl) {
    const query = "INSERT INTO categories (name, icon_url) VALUES ($1, $2)";
    await pool.query(query, [name, iconUrl]);
  }
}

exports.games = new Games();
exports.developers = new Developers();
exports.categories = new Categories();
