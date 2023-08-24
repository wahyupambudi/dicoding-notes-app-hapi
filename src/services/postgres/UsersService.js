const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const NotFoundError = require("../../exceptions/NotFoundError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  //   membuat fungsi adduser dan verify Username
  async addUser({ username, password, fullname }) {
    // verifikasi username yang belum terdaftar
    await this.verifyNewUsername(username);

    // jika lolos maka masuk ke database
    // definisikan id dari nanoid
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    // query insert to database
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);

    // jika terjadi error / data tidak masuk ke table
    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return result.rows[0].id;
  }

  //   membuat fungsi verifikasi
  async verifyNewUsername(username) {
    // query untuk ke database
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);

    // jika user sudah ada
    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async getUserById(userId) {
    // query untuk ke database
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };
    const result = await this._pool.query(query);

    // jika user tidak ditemukan
    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    // kembalikan fungsi dengan nilai user
    return result.rows[0].id;
  }
}

module.exports = UsersService;
