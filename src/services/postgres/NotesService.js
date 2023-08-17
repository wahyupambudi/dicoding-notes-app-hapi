const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class NotesService {
	constructor() {
		this._pool = new Pool();
	}

	// query berjalan async jadi menggunakan async dan await
	// membuat addNote
	async addNote({ title, body, tags }) {
		// untuk id dan waktu buat / update
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		// query untuk ke database
		const query = {
			text: "INSERT INTO notes VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
			values: [id, title, body, tags, createdAt, updatedAt],
		};

		// eksekusi query yang dibuat
		const result = await this._pool.query(query);

		// periksa query apakah berhasil atau gagal
		if (!result.rows[0].id) {
			throw new InvariantError("Catatan gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	// membuat getNote
	async getNotes() {
		const result = await this._pool.query("SELECT * FROM notes");
		return result.rows.map(mapDBToModel);
	}

	// membuat getNoteById
	async getNoteById(id) {
		const query = {
			text: "SELECT * FROM notes WHERE id = $1",
			values: [id],
		};

		// eksekusi query
		const result = await this._pool.query(query);

		// periksa query apakah berhasil atau gagal
		if (!result.rows.length) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}

		return result.rows.map(mapDBToModel)[0];
	}

	// membuat fungsi editNoteById
	async editNoteById(id, { title, body, tags }) {
		// membuat updateAt
		const updatedAt = new Date().toISOString();

		// query untuk ke database
		const query = {
			text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
			values: [title, body, tags, updatedAt, id],
		};

		// eksekusi query
		const result = await this._pool.query(query);

		// periksa query apakah berhasil atau gagal
		if (!result.rows.length) {
			throw new NotFoundError(
				"Gagal memperbarui catatan. Id tidak ditemukan"
			);
		}
	}

	// membuat fungsi deleteNoteById
	async deleteNoteById(id) {
		// query untuk ke database
		const query = {
			text: "DELETE FROM notes WHERE id = $1 RETURNING id",
			values: [id],
		};

		// eksekusi query
		const result = await this._pool.query(query);

		// periksa query apakah berhasil atau gagal
		if (!result.rows.length) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}

		return result.rows[0].id;
	}
}

module.exports = NotesService;