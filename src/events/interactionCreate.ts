import { Client, Interaction } from "discord.js";
import { event } from "../DTS/files";
import slashCommandManager from "../util/interactions/slashCommandManager";
export = {
  name: "interactionCreate",
  once: false,
  execute: async (client: Client, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) slashCommandManager(interaction);
  },
} satisfies event;
