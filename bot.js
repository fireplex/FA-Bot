require('dotenv').config();
const Enmap = require("enmap");
const express = require('express');
const app = express();
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const client = new Discord.Client({ 
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'],
	fetchAllMembers: true
});

client.Discord = Discord;
client.fs = fs;
client.config = config;

app.get("/", (request, response) => {
	console.log(Date.now() + " Ping received");
	response.sendStatus(200);
});
app.listen(process.env.PORT);

const server = app.listen(3000, () => console.log("Server ready"));

fs.readdir("./events/", (err, files) => {
	if(err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.login(config.token);