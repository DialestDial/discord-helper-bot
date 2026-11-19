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
    interaction.reply("IP #1: `" + process.env.aomcDioriteIp +
"`\nIP #2: `" + process.env.aomcOliverIp +
"`\n\nSeed: `" + process.env.aomcSeed + "`" + 
"\n\nBest Prices at Book Bank: https://discord.com/channels/1394109516165152828/1569912302394802256/1570099351450288229\
\n\nD3v1s0m's Tools: https://discord.com/channels/1394109516165152828/1394109516882251819/1572902605821313024");
  },
} satisfies slash_command;
