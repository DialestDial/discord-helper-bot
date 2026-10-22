"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const discord_js_1 = require("discord.js");
const intents_1 = __importDefault(require("./modules/intents"));
const partials_1 = __importDefault(require("./modules/partials"));
const fs_1 = require("fs");
process.on("uncaughtException", (p) => {
    console.error(`Uncaught Exception Error:\n${util_1.default.inspect(p, { depth: 2 })}`);
});
process.on("unhandledRejection", (p) => {
    console.error(`Uncaught Promise Error:\n${util_1.default.inspect(p, { depth: 2 })}`);
});
const client = new discord_js_1.Client({
    intents: intents_1.default,
    partials: partials_1.default,
});
(0, fs_1.readdirSync)("./built/events/")
    .filter((f) => f.endsWith(".js"))
    .forEach((name) => {
    const event = require(`./events/${name}`);
    if (event.once === true)
        client.once(event.name, (...listener) => event.execute(client, ...listener));
    else
        client.on(event.name, (...listener) => event.execute(client, ...listener));
});
client.on("messageCreate", (m) => {
    if (!m.author.bot && m.channel.isSendable()) {
        m.channel.send("Heya!!!! :3");
    }
});
client.login(process.env.helper_bot_token);
