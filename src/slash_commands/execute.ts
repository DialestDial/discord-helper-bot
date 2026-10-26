import { ChatInputCommandInteraction } from "discord.js";
import { slash_command } from "../DTS/files";
export = {
  info: {
    name: "execute",
    description: "Executes an order",
    default_member_permissions: null,
    contexts: [0, 1, 2],
    options: [
      {
        name: "order",
        type: 3,
        description: "The order to execute",
        choices: [{ name: "Order 66", value: "66" }],
        required: true,
      },
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.options.getString("order") === "66") {
      interaction.reply(
        "https://klipy.com/gifs/good-soldiers-follow-orders-crosshair-1",
      );
    }
  },
} satisfies slash_command;
