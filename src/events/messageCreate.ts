import { Client, Message } from "discord.js";
import messageManager from "../modules/messageManager";
export = {
  name: "messageCreate",
  once: false,
  execute: async (client: Client, message: Message) =>
    messageManager(message, true),
};
