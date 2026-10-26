import { REST, Routes } from "discord.js";
import { inspect } from "util";

export = async () =>
  new REST()
    .setToken(process.env.helper_bot_token)
    .get(Routes.applicationCommands("1562579605741764618"));
