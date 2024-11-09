const pool = require("./pool");

class Games {
  async getGame(gameId) {
    const query = "SELECT * FROM games WHERE id = $1";
    const { rows } = await pool.query(query, [Number(gameId)]);
    return rows[0];
  }

  async getAll() {
    const { rows } = await pool.query("SELECT * FROM games ORDER BY id DESC");
    return rows;
  }

  async isValid(gameId) {
    const query = "SELECT 1 FROM games WHERE id = $1";
    const { rows } = await pool.query(query, [Number(gameId)]);
    return rows.length > 0;
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
    developerIds = [],
    categoryIds = [],
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
      await pool.query(query, [gameId, Number(devId)]);
    });

    categoryIds.forEach(async (categoryId) => {
      const query = `INSERT INTO games_categories (game_id, category_id) VALUES ($1, $2)`;
      await pool.query(query, [gameId, Number(categoryId)]);
    });
  }

  async edit(
    id,
    name,
    logoUrl,
    coverImgUrl,
    details,
    price,
    developerIds = [],
    categoryIds = [],
  ) {
    const gameId = Number(id);

    // update the game table
    const editGameQuery = `
      UPDATE games 
      SET name = $2,
        logo_url = $3,
        coverimg_url = $4,
        details = $5,
        price= $6
      WHERE id = $1
    `;

    await pool.query(editGameQuery, [
      gameId,
      name,
      logoUrl,
      coverImgUrl,
      details,
      price,
    ]);

    // update games_developers table
    await pool.query("DELETE FROM games_developers WHERE game_id = $1", [
      gameId,
    ]);

    developerIds.forEach(async (devId) => {
      await pool.query(
        "INSERT INTO games_developers (game_id, developer_id) VALUES ($1, $2)",
        [gameId, Number(devId)],
      );
    });

    // update games_categories table
    await pool.query("DELETE FROM games_categories WHERE game_id = $1", [
      gameId,
    ]);

    categoryIds.forEach(async (categoryId) => {
      await pool.query(
        "INSERT INTO games_categories (game_id, category_id) VALUES ($1, $2)",
        [gameId, Number(categoryId)],
      );
    });
  }

  async delete(id) {
    const gameId = Number(id);

    const deleteFromGamesDevelopers =
      "DELETE FROM games_developers WHERE game_id = $1";
    await pool.query(deleteFromGamesDevelopers, [gameId]);

    const deleteFromGamesCategories =
      "DELETE FROM games_categories WHERE game_id = $1";
    await pool.query(deleteFromGamesCategories, [gameId]);

    const deleteFromGames = "DELETE FROM games WHERE id = $1";
    await pool.query(deleteFromGames, [gameId]);
  }
}

class Developers {
  async getDeveloper(developerId) {
    const query = "SELECT * FROM developers WHERE id = $1";
    const { rows } = await pool.query(query, [Number(developerId)]);
    return rows[0];
  }

  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM developers ORDER BY name ASC",
    );

    return rows;
  }

  async getByGame(gameId) {
    const query = `
     SELECT developers.* FROM developers 
     INNER JOIN games_developers ON developers.id = games_developers.developer_id
     WHERE games_developers.game_id = $1;
   `;

    const { rows } = await pool.query(query, [gameId]);
    return rows;
  }

  async isValid(id) {
    const query = "SELECT 1 FROM developers WHERE id = $1";
    const { rows } = await pool.query(query, [Number(id)]);
    return rows.length > 0;
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

  async edit(id, name, logoUrl, coverImgUrl, details) {
    const query = `
      UPDATE developers
      SET name = $2,
        logo_url = $3,
        coverimg_url = $4, 
        details = $5
      WHERE id = $1;
    `;

    await pool.query(query, [Number(id), name, logoUrl, coverImgUrl, details]);
  }
}

class Categories {
  async getCategory(categoryId) {
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

  async getByGame(gameId) {
    const query = `
     SELECT categories.* FROM categories 
     INNER JOIN games_categories ON categories.id = games_categories.category_id
     WHERE games_categories.game_id = $1;
   `;

    const { rows } = await pool.query(query, [gameId]);
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

    await pool.query(query, [Number(categoryId), name, iconUrl]);
  }
}

exports.games = new Games();
exports.developers = new Developers();
exports.categories = new Categories();
