import { ChatInputCommandInteraction } from "discord.js";
import { inspect } from "util";
import { readdirSync } from "fs";
import { slash_command } from "../../DTS/files";
export = async (interaction: ChatInputCommandInteraction) => {
  const slash_command: slash_command = require(
    ("../../slash_commands/" +
      readdirSync("./built/slash_commands/").find(
        (f) =>
          interaction.commandName ===
          (require("../../slash_commands/" + f) as slash_command).info.name,
      )) as string,
  );
  function error(description: string, title?: string, noDel?: boolean) {
    interaction
      .reply({
        embeds: [
          {
            title: "Error",
            color: 0xff0000,
            description:
              "There was an error while trying to run this command, please let Dial know :(",
          },
        ],
      })
      .then((m) => {
        if (!noDel)
          setTimeout(() => {
            m.delete();
          }, 10000);
      });
    console.error("Error in Slash command!:\n" + inspect(description));
    interaction.client.users.cache
      .get(process.env.ownerid as string)
      ?.send(
        `There was an error with the slash command \`${slash_command.info.name}\``,
      );
  }

  slash_command.execute(interaction).catch(error);
  /*
  else {
        const id = readdirSync("./built/guild").find(
      (_id) => message.guildId === _id,
    );
    if (id)
      readdirSync("./built/guild/" + id)
        .filter((f: string) => f.endsWith(".js"))
        .forEach((file) => require(`../guild/${id}/messageUpdate/${file}`)(message));
    }
  */
};
