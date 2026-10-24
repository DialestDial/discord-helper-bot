import {
  ColorResolvable,
  Guild,
  GuildMember,
  Role,
  SendableChannels,
} from "discord.js";
import { customColorOptions } from "../DTS/customColorOptions";
import rateLimitAsText from "./rateLimitAsText";

export = async (options: customColorOptions) => {
  const { _channel, prefixC, prefixR, message, position, embed } = options;

  async function cleanRoles(oldRole: Role | undefined) {
    if (oldRole) {
      await (message.member as GuildMember).roles
        .remove(oldRole)
        .catch(() =>
          console.error(
            `I don't have permissions to remove the role with the ID ${oldRole} from a user in ${oldRole.guild}`,
          ),
        );
    }
    (message.guild as Guild).roles.cache.forEach((r) => {
      if (
        (r.name.startsWith(prefixC) ||
          (prefixR && r.name.startsWith(prefixR))) &&
        !r.members.size
      ) {
        r.delete().catch(() =>
          console.error(
            `I don't have permissions to delete the role with the ID ${r} from ${r.guild}`,
          ),
        );
      }
    });
  }

  if (
    //If it's the correct channel and the author is a human
    (Array.isArray(_channel)
      ? _channel.includes(message.channelId)
      : message.channelId === _channel) &&
    !message.author.bot
  ) {
    const { content } = message,
      color = parseInt(content.toLowerCase().slice(1).trim(), 16);
    if (message.content === "reset" || message.content === "r" ) {
      const cuRole: Role | undefined =
        //current role that will later be removed
        (message.member as GuildMember).roles.cache.find(
          (r) =>
            r.name.startsWith(prefixC) ||
            (prefixR && r.name.startsWith(prefixR)),
        );
      cleanRoles(cuRole);
    } else if (
      content.search(/^#[a-f|\d]{6}$/i) !== -1 &&
      color > 0 &&
      color < 0x1000000 &&
      content.length === 7
    ) {
      function editEmbed(c: number) {
        if (embed)
          message.channel.messages.fetch(embed).then((m) => {
            const e = m.embeds[0];
            m.edit({
              embeds: [
                {
                  title: e.title === null ? undefined : e.title,
                  description:
                    e.description === null ? undefined : e.description,
                  color: c,
                },
              ],
            });
          });
      }
      async function error(p: string, timeout?: number) {
        const rl = await rateLimitAsText(message);
        const nMessage = await (message.channel as SendableChannels).send(
          `It wasn't possible to ${p}, please try again${rl ? " in " + rl : ""}`,
        );
        setTimeout(async () => {
          message.delete().finally(() => nMessage.delete());
        }, timeout || 5000);
      }

      async function setColor(type: string, prefix: string) {
        const cuRole: Role | undefined =
          //current role that will later be removed
          (message.member as GuildMember).roles.cache.find((r) =>
            r.name.startsWith(prefix),
          );

        if (type === "c") {
          let newRole = await (message.guild as Guild).roles.cache.find(
            (r) => r.name === message.content.toUpperCase(),
          );
          if (newRole) {
            await (message.member as GuildMember).roles.add(newRole);
          } else
            await (message.guild as Guild).roles
              .create({
                name: message.content.toUpperCase(),
                position:
                  (message.guild as Guild).roles.cache.size - (position ?? 0),
                permissions: 0n,
                colors: { primaryColor: message.content as ColorResolvable },
              })
              .then(
                async (r) => {
                  await (message.member as GuildMember).roles.add(r);

                  cleanRoles(cuRole);
                  message.delete();
                  editEmbed(r.colors.primaryColor);
                },
                () => error("create the role"),
              );
        } else {
          (cuRole as Role).setColors({ primaryColor: color }).then(
            () => {
              cleanRoles(cuRole);
              message.delete();
              editEmbed((cuRole as Role).colors.primaryColor);
            },
            () => error("change the role's color"),
          );
        }
      }
      if (
        prefixR &&
        (message.member as GuildMember).roles.cache.some((r) =>
          r.name.startsWith(prefixR),
        )
      ) {
        setColor("r", prefixR);
      } else {
        setColor("c", prefixC);
      }
    } else {
      const rl = await rateLimitAsText(message);
      const nMessage = (message.channel as SendableChannels).send({
        content:
          "You didn't send a valid color (or maybe you didn't put the prefix \"#\"), please try again" +
          (rl ? " in " + rl : ""),
        embeds: [
          {
            title: "Your message should look like this:",
            description: "`#4000ff`",
          },
        ],
      });
      setTimeout(async () => {
        message.delete().catch(() => {});
        nMessage.then((m) => {
          m.delete().catch(() => {});
        });
      }, 10000);
    }
  }
};
