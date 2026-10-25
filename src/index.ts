import util from "util";
import { Client, Collection } from "discord.js";
import { event } from "./DTS/files";
import intents from "./util/constants/intents";
import partials from "./util/constants/partials";
import { readdirSync } from "fs";
import { config } from "dotenv";
config();

process.on("uncaughtException", (p) => {
  console.error(`Uncaught Exception Error:\n${util.inspect(p, { depth: 2 })}`);
});
process.on("unhandledRejection", (p) => {
  console.error(`Uncaught Promise Error:\n${util.inspect(p, { depth: 2 })}`);
});

const client = new Client({
  intents,
  partials,
});
readdirSync("./built/events/")
  .filter((f) => f.endsWith(".js"))
  .forEach((name) => {
    const event: event = require(`./events/${name}`);
    if (event.once === true)
      client.once(event.name, (...listener: any[]) =>
        event.execute(client, ...listener),
      );
    else
      client.on(event.name, (...listener: any[]) =>
        event.execute(client, ...listener),
      );
  });

client.login(process.env.helper_bot_token);
