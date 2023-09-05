const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

// Parameter payload merupakan objek yang disimpan ke dalam salah satu artifacts JWT. Biasanya objek payload berisi properti yang mengindikasikan identitas pengguna, contohnya user id.
const TokenManager = {
  // Fungsi generate menerima dua parameter, yang pertama adalah payload dan kedua adalah secretKey
  // membuat fungsi generate access token
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  // membuat fungsi refresh access token
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  // membuat fungsi verify access token
  verifyRefreshToken: (refreshToken) => {
    try {
      // decode token dan return artifacts
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      // kembalikan fungsi nilai  payload dari artifacts.decoded
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

module.exports = TokenManager;
