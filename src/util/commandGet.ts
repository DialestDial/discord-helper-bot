import { REST, Routes } from "discord.js";
import { inspect } from "util";

export = async () =>
  new REST({
    api:
      process.env.useProxy === "1"
        ? process.env.proxyURL
        : "https://discord.com/api",
    headers: {
      proxy_token: process.env.proxy_token,
    })
    .setToken(process.env.helper_bot_token)
    .get(Routes.applicationCommands("1562579605741764618"));
