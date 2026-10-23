import { Message, MessageCreateOptions } from "discord.js";
import { inspect } from "util";
import { prefixes } from "../config.json";
import { SendableChannels } from "discord.js";
export = {
  name: "eval",
  description: "Executes JavaScript code",
  dm: true,
  args: false,
  guild: true,
  usage: "d?eval <valid JavaScript code>",
  aliases: [],
  hiddenAliases: ["e"],
  allow: false,
  execute: async (message: Message) => {
    if (!message.channel.isSendable()) return;
    const clean = (_code: string) =>
      _code.replace(/`/g, "`‎").replace(/@/g, "@‎");
    const big = () => {
      (message.channel as SendableChannels).send({
        embeds: [
          {
            title: "Eval",
            color: 0xff0000,
            description: "There was an error sending the error :/",
          },
        ],
      });
    };
    const noPrefix = message.content
      .slice(
        prefixes.find((p: string) =>
          message.content.toLowerCase().startsWith(p),
        )?.length,
      )
      .trim();
    const code = noPrefix.slice(noPrefix.split(" ")[0].length).trim();
    try {
      const random = Math.random() * 3;
      let evaled: unknown = eval(code);
      const embed: MessageCreateOptions = {
        embeds: [
          {
            title: "Evaluate",
            color: random > 2 ? 0x0000ff : random > 1 ? 0x00ff00 : 0x00ffff,
            fields: [
              {
                name: "Input:",
                value: "```js\n" + clean(code) + "```",
                inline: false,
              },
              {
                name: "Output:",
                value: "```js\n" + clean(inspect(evaled)) + "```",
                inline: false,
              },
            ],
          },
        ],
      };
      message.channel.send(embed).catch((e) => {
        (message.channel as SendableChannels)
          .send({
            embeds: [
              {
                title: "Evaluate",
                color: 0xff0000,
                fields: [
                  {
                    name: "Input:",
                    value: "```js\n" + clean(code) + "\n```",
                    inline: false,
                  },
                  {
                    name: "Error:",
                    value: "```js\n" + clean(inspect(e)) + "\n```",
                    inline: false,
                  },
                ],
              },
            ],
          })
          .catch(big);
      });
    } catch (e) {
      message.channel
        .send({
          embeds: [
            {
              title: "Evaluate",
              color: 0xff0000,
              fields: [
                {
                  name: "Input:",
                  value: "```js\n" + clean(code) + "\n```",
                  inline: false,
                },
                {
                  name: "Error:",
                  value: "```js\n" + clean(inspect(e)) + "\n```",
                  inline: false,
                },
              ],
            },
          ],
        })
        .catch(big);
    }
  },
};
