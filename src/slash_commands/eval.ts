import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  MessageCreateOptions,
  SendableChannels,
} from "discord.js";
import { slash_command } from "../DTS/files";
import { inspect } from "util";
export = {
  info: {
    name: "eval",
    description: "Executes JavaScript code (Dial only)",
    default_member_permissions: "0",
    contexts: [0, 1, 2],
    options: [
      {
        name: "code",
        type: 3,
        description: "The code to execute",
        required: true,
      },
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    if (interaction.user.id !== process.env.ownerid) {
      interaction.reply("Sorry, only Dial can use that command");
    } else {
      const code = interaction.options.getString("code") || "";
      const clean = (_code: string) =>
        _code.replace(/`/g, "`‎").replace(/@/g, "@‎");
      const cleanOut = (_code: any) =>
        clean(inspect(_code, { depth: null }))
          .split("at eval (eval at execute")[0]
          .split("at Object.execute")[0]
          .trim();
      const big = () => {
        interaction
          .reply({
            embeds: [
              {
                title: "Eval",
                color: 0xff0000,
                description: "There was an error sending the error :/",
              },
            ],
          })
          .catch(() => {});
      };
      try {
        const random = Math.random() * 3;
        let evaled: any = await eval("(async () => {\n" + code + "\n})()");
        const embed: InteractionReplyOptions = {
          embeds: [
            {
              title: "Mission accomplished :saluting_face:",
              color: random > 2 ? 0x0000ff : random > 1 ? 0x00ff00 : 0x00ffff,
              fields: [
                {
                  name: "Input:",
                  value: "```js\n" + clean(code) + "```",
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
        interaction.reply(embed).catch((e) => {
          interaction
            .reply({
              embeds: [
                {
                  title: "Mission failed :broken_heart:",
                  color: 0xff0000,
                  fields: [
                    {
                      name: "Input:",
                      value: "```js\n" + clean(code) + "\n```",
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
        interaction
          .reply({
            embeds: [
              {
                title: "Mission failed :broken_heart:",
                color: 0xff0000,
                fields: [
                  {
                    name: "Input:",
                    value: "```js\n" + clean(code) + "\n```",
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
    }
  },
} satisfies slash_command;
