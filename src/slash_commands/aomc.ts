import { ChatInputCommandInteraction } from "discord.js";
import { slash_command } from "../DTS/files";
export = {
  info: {
    name: "aomc",
    description: "Gives you information about the AOMC server",
    default_member_permissions: null,
    contexts: [0, 1, 2],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(
      {
        embeds: [{
          color: 0xc0c0c0,
          title: "Here you go!",
          description: "IP #1: `" + process.env.aomcOliverIp +
"`\nIP #2: `" + process.env.aomcDioriteIp +
"`\nIP #3: `" + process.env.aomcRawIp + "`"

Seed: ${process.env.aomcSeed}`
        }]
      },
    );
  },
} satisfies slash_command;
