const pool = require("./pool");

const categories = {
  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM categories ORDER BY name;",
    );
    return rows;
  },
};

module.exports = {
  categories,
};
