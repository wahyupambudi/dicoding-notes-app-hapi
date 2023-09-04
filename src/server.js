// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();

const Hapi = require("@hapi/hapi");

// notes
const notes = require("./api/notes");
const NotesValidator = require("./validator/notes");
// jika menggunakan memory
// const NotesService = require("./services/inMemory/NotesService");
// jika menggunakan postgre
const NotesService = require("./services/postgres/NotesService");

// users
const users = require("./api/users");
const UserService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UserService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    debug: {
      request: ["error"],
    },
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
