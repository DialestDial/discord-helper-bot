import { Client, Message } from "discord.js";
import messageManager from "../util/messageManager";
import { event } from "../DTS/files";
export = {
  name: "messageUpdate",
  once: false,
  execute: async (client: Client, oldMessage: Message, newMessage: Message) =>
    messageManager(newMessage, false),
} satisfies event;
