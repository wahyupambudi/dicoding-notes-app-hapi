const ClientError = require("./ClientError");

class InvariantError extends ClientError {
	constructor(message) {
		super(message);
		this.name = "InvariantError";
		// tidak memerlukan untuk code 400 karena keturunan dari clienterror
	}
}

module.exports = InvariantError;
