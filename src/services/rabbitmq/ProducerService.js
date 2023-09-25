const amqp = require("amqplib");

// membuat object ProcedurService
const ProcedurService = {
	// fungsi asyncrhonous sendMessage
	sendMessage: async (queue, message) => {
		// fungsi send message ke queue
		const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
		// membuat channel
		const channel = await connection.createChannel();
		// membuat queue
		await channel.assertQueue(queue, {
			durable: true,
		});

		// kirim pesan dalam bentuk buffer ke queue
		await channel.sendToQueue(queue, Buffer.from(message));

		// tutup koneksi setelah satu detik
		setTimeout(() => {
			connection.close();
		}, 1000);
	},
};

module.exports = ProcedurService;
