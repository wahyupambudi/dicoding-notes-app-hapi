const Jwt = require("@hapi/jwt");

//     Parameter payload merupakan objek yang disimpan ke dalam salah satu artifacts JWT. Biasanya objek payload berisi properti yang mengindikasikan identitas pengguna, contohnya user id.
const TokenManager = {
  generateAccessToken(payload) {
    return Jwt.token.generate();
  },
};

module.exports = TokenManager;
