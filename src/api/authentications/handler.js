const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHandler {
  // constructor class-nya menerima authenticationsService, usersService, tokenManager, dan validator.
  constructor(authenticationsService, usersService, tokenManager, validator) {
    // nilai parameter sebagai private property class.
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  //   fungsi async post authentications
  async postAuthenticationHandler(request, h) {
    try {
      // validasi payload request
      this._validator.validatePostAuthenticationPayload(request.payload);

      //   dapatkan nilai dari payload
      const { username, password } = request.payload;
      //   Gunakan this._usersService.verifyUserCredential untuk memeriksa kredensial yang ada pada request.payload.
      const id = await this._usersService.verifyUserCredential(
        username,
        password
      );

      //   membuat akses token dan refresh token membawa object payload properti id user
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      //   fungsi this._authenticationsService.addRefreshToken untuk menyimpan refreshToken.
      await this._authenticationsService.addRefreshToken(refreshToken);

      //   Terakhir, kita tinggal kembalikan request dengan respons yang membawa accessToken dan refreshToken di data body.

      const response = h.response({
        status: "success",
        message: "Authentication berhasil ditambahkan",
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // jika error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async PutAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      // dapatkan nilai refreshToken pada request.payload
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      // untuk generate token
      const accessToken = this._tokenManager.generateAccessToken({ id });

      return {
        status: "success",
        message: "Access Token berhasil diperbarui",
        data: {
          accessToken,
        },
      };
    } catch (error) {
      // jika error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      // memastikan refreshToken tersebut ada di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      // delete
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: "success",
        message: "Refresh token berhasil dihapus",
      };
    } catch (error) {
      // jika error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.log(error);
      return response;
    }
  }
}

module.exports = AuthenticationsHandler;
