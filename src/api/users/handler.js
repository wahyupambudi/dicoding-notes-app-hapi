const ClientError = require("../../exceptions/ClientError");

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // fungsi postUserHandler agar nilainya tetap instance dari UsersHandler.
    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  //   fungsi add user
  async postUserHandler(request, h) {
    try {
      // validasi request.payload
      this._validator.validateUserPayload(request.payload);
      //   mendapatkan properti user
      const { username, password, fullname } = request.payload;
      //   fungsi adduser dari this._service
      //   mendapatkan id dari tambah data
      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });
      //   mengembalikan request dengan response code 201
      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // jika error dari instance clientError
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //   server error!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //   fungsi get user by id
  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);
      //   kembalikan data user
      return {
        status: "success",
        data: {
          user,
        },
      };
    } catch (error) {
      // jika error dari instance clientError
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      //   server error!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // membuat fungsi getUsersByUsernameHandler
  async getUsersByUsernameHandler(request, h) {
    try {
      const { username = "" } = request.query;
      const users = await this._service.getUsersByUsername(username);
      return {
        status: "success",
        data: {
          users,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UsersHandler;
