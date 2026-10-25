import { Client, Message } from "discord.js";
import messageManager from "../util/messageManager";
import { event } from "../DTS/files";
export = {
  name: "messageCreate",
  once: false,
  execute: async (client: Client, message: Message) =>
    messageManager(message, true),
} satisfies event;