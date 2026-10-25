import { Message } from "discord.js";
import { text_command } from "../DTS/files";
export = {
  name: "test",
  description: {
    en: "",
  },
  dm: true,
  guild: true,
  args: false,
  usage: "d?test",
  aliases: [],
  hiddenAliases: [],
  allow: true,
  execute: async (message: Message, args: string[]) => {
    if (!message.channel.isSendable()) return;
    message.channel.send("Hi :3");
  },
} as text_command;
