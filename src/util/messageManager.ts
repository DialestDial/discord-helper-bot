import {
  ChannelType,
  GuildMember,
  Message,
  PermissionResolvable,
} from "discord.js";
import { readdirSync } from "fs";
import { prefixes } from "../config.json";
import { text_command } from "../DTS/files";
export = async (message: Message, normal: boolean) => {
  const commands: text_command[] = readdirSync("./built/text_commands/")
    .filter((f) => f.endsWith(".js"))
    .map((name) => {
      return require(`../text_commands/${name}`);
    });
  function error(description: string, title?: string, noDel?: boolean) {
    if (message.channel.isSendable()) {
      message.channel
        .send({
          embeds: [
            {
              title: title ? title : "Error",
              color: 16711680,
              description,
            },
          ],
        })
        .then((m) => {
          if (!noDel)
            setTimeout(() => {
              m.delete();
            }, 10000);
        });
    }
  }
  const prefix = prefixes.find((p) =>
    message?.content?.toLowerCase()?.startsWith(p),
  );
  const noPrefix = message.content.slice(prefix?.length).trim();
  const args = noPrefix.split(/\s+/g);
  const commandName = (args.shift() || "").toLowerCase();
  const arg = noPrefix.slice(commandName.length).trim();

  const text_command: text_command | undefined = commands.find(
    (cmd) =>
      cmd.name === commandName ||
      (cmd.aliases || []).concat(cmd.hiddenAliases || []).includes(commandName),
  );

  if (text_command && prefix && !message.author.bot) {
    async function executeCommand() {
      function c(reason: any) {
        {
          if (!message.channel.isSendable()) return;
          message.channel.send(
            "There was an error while trying to run this command, please let Dial know :(",
          );
          console.error(
            `Error in  ${normal ? "normal" : "edited"} message: ${reason}`,
          );
        }
      }
      if ((text_command as text_command).args === true)
        (text_command as text_command).execute(message, args).catch(c);
      else if ((text_command as text_command).args === null)
        (text_command as text_command).execute(message, arg).catch(c);
      else (text_command as text_command).execute(message).catch(c);
    }

    function checkPermissions() {
      if (
        (text_command as text_command).allow === true ||
        (text_command as text_command).allow === undefined
      )
        executeCommand();
      else {
        if ((text_command as text_command).allow === false) {
          if (message.author.id === process.env.ownerid) executeCommand();
          else error("Sorry, only Dial can use this command");
        } else {
          if (message.guild) {
            if (
              (message.member as GuildMember).permissions.has(
                (text_command as text_command).allow as PermissionResolvable,
              ) ||
              message.author.id === process.env.ownerid
            )
              executeCommand();
            else {
              error(
                `Sorry, you're missing permissions to run \`d?${(text_command as text_command).name}\``,
              );
            }
          } else error("Sorry, you can only use this in servers");
        }
      }
    }

    if (
      (text_command.dm === true || text_command.dm === undefined) &&
      (text_command.guild === true || text_command.guild === undefined)
    )
      checkPermissions();
    else {
      if (
        text_command.dm === false &&
        text_command.guild === true &&
        message.guild
      ) {
        //Guild only and was sent in a guild
        checkPermissions();
      } else if (
        text_command.dm === false &&
        text_command.guild === true &&
        !message.guild
      ) {
        //Guild only and was sent in a DM
        error(
          "Uhm...",
          "This command can only be used in servers, so... this is awkward :no_mouth:",
          true,
        );
      } else if (
        text_command.dm === true &&
        text_command.guild === false &&
        !message.guild
      ) {
        //DM only and was sent in a DM
        checkPermissions();
      } else if (
        text_command.dm === true &&
        text_command.guild === false &&
        message.guild
      ) {
        //DM only and was sent in a Guild
        error(
          "Uhm...",
          "This command can only be used in DMs, so that no one shall know about our secrets, mwahaha!!! >:)",
          true,
        );
      } else {
        console.error(
          Error(
            `The command ${text_command.name} isn't allowed in servers nor DMs`,
          ),
        );
        message.client.users.cache
          .get(process.env.ownerid as string)
          ?.send(
            `The text command \`${text_command.name}\` isn't allowed in servers nor DMs`,
          );
      }
    }
  }
  if (normal) {
    //normal means a message at the time of sending that wasn't edited
    const id = readdirSync("./built/guild").find(
      (_id) => message.guildId === _id,
    );

    if (id)
      readdirSync(`./built/guild/${id}/messageCreate`)
        .filter((f: string) => f.endsWith(".js"))
        .forEach((file) =>
          require(`../guild/${id}/messageCreate/${file}`)(message),
        );
  }
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
