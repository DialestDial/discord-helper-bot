import { Guild, GuildMember, Role, SendableChannels } from "discord.js";
import { customColorOptions } from "../DTS/customColorOptions";
import rateLimitAsText from "./rateLimitAsText";

export = async (options: customColorOptions) => {
  const { _channel, prefixC, prefixR, message, position, embed } = options;
  const isColorRole = (r: Role) =>
    r.name.startsWith(prefixC) && /^#[\dA-F]{6}$/.test(r.name);

  async function cleanRoles(oldRole: Role | undefined) {
    if (!oldRole) return;
    await (message.member as GuildMember).roles
      .remove(oldRole)
      .catch(() =>
        console.error(
          `I don't have permissions to remove the role with the ID ${oldRole} from a user in ${oldRole.guild}`,
        ),
      );
    // Role.members only reads the member cache
    const fetched = await oldRole.guild.members.fetch().catch(() => null);
    if (fetched && !oldRole.members.size)
      await oldRole
        .delete()
        .catch(() =>
          console.error(
            `I don't have permissions to delete the role with the ID ${oldRole} from ${oldRole.guild}`,
          ),
        );
  }

  if (
    //If it's the correct channel and the author is a human
    (Array.isArray(_channel)
      ? _channel.includes(message.channelId)
      : message.channelId === _channel) &&
    !message.author.bot
  ) {
    const { content } = message,
      color = parseInt(content.slice(1), 16);
    if (message.content === "reset" || message.content === "r") {
      const cuRole: Role | undefined =
        //current role that will later be removed
        (message.member as GuildMember).roles.cache.find(
          (r) =>
            isColorRole(r) || (!!prefixR && r.name.startsWith(prefixR)),
        );
      await cleanRoles(cuRole);
      message.delete().catch(() => {});
    } else if (/^#[\da-f]{6}$/i.test(content)) {
      // Discord treats color 0 as "no color"
      const roleColor = color || 1;
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
        const member = message.member as GuildMember;
        const guild = message.guild as Guild;
        const cuRole: Role | undefined =
          //current role that will later be removed
          member.roles.cache.find((r) =>
            type === "c" ? isColorRole(r) : r.name.startsWith(prefix),
          );

        if (type === "c") {
          const name = content.toUpperCase();
          const newRole =
            guild.roles.cache.find((r) => r.name === name) ??
            (await guild.roles
              .create({
                name,
                position: guild.roles.cache.size - (position ?? 0),
                permissions: 0n,
                colors: { primaryColor: roleColor },
              })
              .catch(() => undefined));
          if (!newRole) return error("create the role");
          if (!(await member.roles.add(newRole).then(() => true, () => false)))
            return error("give you the role");
          if (cuRole && cuRole.id !== newRole.id) await cleanRoles(cuRole);
          message.delete().catch(() => {});
          editEmbed(newRole.colors.primaryColor);
        } else {
          (cuRole as Role).setColors({ primaryColor: roleColor }).then(
            () => {
              message.delete().catch(() => {});
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
