const pool = require("./pool");

class Games {
  async getAll() {
    const { rows } = await pool.query("SELECT * FROM games ORDER BY name ASC");
    return rows;
  }

  async isNameTaken(name) {
    const query = "SELECT 1 FROM games WHERE name ILIKE $1";
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
    const query = "SELECT 1 FROM developers WHERE name ILIKE $1";
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
  async get(categoryId) {
    const query = "SELECT * FROM categories WHERE id = $1";
    const { rows } = await pool.query(query, [Number(categoryId)]);
    return rows[0];
  }

  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC",
    );
    return rows;
  }

  async isValid(categoryId) {
    const query = "SELECT 1 FROM categories WHERE id = $1";
    const { rows } = await pool.query(query, [Number(categoryId)]);
    return rows.length > 0;
  }

  async isNameTaken(name) {
    const query = "SELECT 1 FROM categories WHERE name ILIKE $1";
    const { rows } = await pool.query(query, [name]);

    return rows.length > 0;
  }

  async add(name, iconUrl) {
    const query = "INSERT INTO categories (name, icon_url) VALUES ($1, $2)";
    await pool.query(query, [name, iconUrl]);
  }

  async delete(categoryId) {
    await pool.query("DELETE FROM games_categories WHERE category_id = $1", [
      Number(categoryId),
    ]);

    await pool.query("DELETE FROM categories WHERE id = $1", [
      Number(categoryId),
    ]);
  }

  async edit(categoryId, name, iconUrl = "") {
    const query = `
      UPDATE categories 
      SET name = $2,
      icon_url = $3
      WHERE id = $1
    `;

    await pool.query(query, [categoryId, name, iconUrl]);
  }
}

exports.games = new Games();
exports.developers = new Developers();
exports.categories = new Categories();
