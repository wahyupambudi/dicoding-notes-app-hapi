const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  //   membuat fungsi refresh token
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };
    await this._pool.query(query);
  }

  //   membuat fungsi verify refresh token
  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };
    const result = await this._pool.query(query);

    // jika tidak valid
    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  //   membuat fungsi delete token
  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE token FROM authentications WHERE token = $1",
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
