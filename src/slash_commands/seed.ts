import { ChatInputCommandInteraction } from "discord.js";
import { slash_command } from "../DTS/files";
export = {
  info: {
    name: "seed",
    description: "Gives you the AOMC server seed!",
    default_member_permissions: null,
    contexts: [0, 1, 2],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    interaction.reply(
      "<@78531960690970624>",
    );
  },
} satisfies slash_command;
