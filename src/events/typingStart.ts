import { Client, Typing } from "discord.js";
export = {
  name: "typingStart",
  once: false,
  execute: async (client: Client, typing: Typing) => {
    if (typing.channel.isSendable()) {
      typing.channel.send(":eyes:");
    }
  },
};
