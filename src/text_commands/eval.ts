import { Message, MessageCreateOptions } from "discord.js";
import { inspect } from "util";
import { prefixes } from "../config.json";
import { SendableChannels } from "discord.js";
import { text_command } from "../DTS/files";
export = {
  name: "eval",
  description: {
    en: "Executes JavaScript code",
  },
  dm: true,
  args: null,
  guild: true,
  usage: "d?eval <valid JavaScript code>",
  aliases: [],
  hiddenAliases: ["e"],
  allow: false,
  execute: async (message: Message, arg: string) => {
    if (!message.channel.isSendable()) return;
    const clean = (_code: string) =>
      _code.replace(/`/g, "`‎").replace(/@/g, "@‎");
    const cleanOut = (_code: any) =>
      clean(inspect(_code, { depth: null }))
        .split("at eval (eval at execute")[0]
        .split("at Object.execute")[0]
        .trim();
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
    try {
      const random = Math.random() * 3;
      let evaled: any = eval("(async () => {\n" + arg + "\n})()");
      if (
        evaled &&
        (typeof evaled === "object" || typeof evaled === "function") &&
        typeof evaled.then === "function"
      )
        evaled = await evaled;
      const embed: MessageCreateOptions = {
        embeds: [
          {
            title: "Mission accomplished :saluting_face:",
            color: random > 2 ? 0x0000ff : random > 1 ? 0x00ff00 : 0x00ffff,
            fields: [
              {
                name: "Input:",
                value: "```js\n" + clean(arg) + "```",
                inline: false,
              },
              {
                name: "Output:",
                value: "```js\n" + cleanOut(evaled) + "```",
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
                title: "Mission failed :broken_heart:",
                color: 0xff0000,
                fields: [
                  {
                    name: "Input:",
                    value: "```js\n" + clean(arg) + "\n```",
                    inline: false,
                  },
                  {
                    name: "Error:",
                    value: "```js\n" + cleanOut(e) + "\n```",
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
              title: "Mission failed :broken_heart:",
              color: 0xff0000,
              fields: [
                {
                  name: "Input:",
                  value: "```js\n" + clean(arg) + "\n```",
                  inline: false,
                },
                {
                  name: "Error:",
                  value: "```js\n" + cleanOut(e) + "\n```",
                  inline: false,
                },
              ],
            },
          ],
        })
        .catch(big);
    }
  },
} as text_command;
