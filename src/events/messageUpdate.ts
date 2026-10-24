import { Client, Message } from "discord.js";
import messageManager from "../util/messageManager";
export = {
  name: "messageUpdate",
  once: false,
  execute: async (client: Client, oldMessage: Message, newMessage: Message) =>
    messageManager(newMessage, false),
};
