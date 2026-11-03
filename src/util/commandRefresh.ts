import { Client, ClientUser, REST, Routes } from "discord.js";
import { slash_command } from "../DTS/files";
import { readdirSync } from "fs";
export = async (client: Client) =>
  new REST({
    api:
      process.env.useProxy === "1"
        ? process.env.proxyURL
        : "https://discord.com/api",
    headers: {
      proxy_token: process.env.proxy_token,
    })
    .setToken(process.env.helper_bot_token)
    .put(Routes.applicationCommands((client.user as ClientUser).id), {
      body: readdirSync("./built/slash_commands")
        .filter((s) => s.endsWith(".js"))
        .map((s) => (require("../slash_commands/" + s) as slash_command).info),
    });
