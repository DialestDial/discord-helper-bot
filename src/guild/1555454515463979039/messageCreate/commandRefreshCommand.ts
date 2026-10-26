import { Message } from "discord.js";
import commandRefresh from "../../../util/commandRefresh";
import commandGet from "../../../util/commandGet";
import { inspect } from "util";
export = async (message: Message) => {
  if (
    message.content === "d?updcmd" &&
    message.author.id === process.env.ownerid
  )
    commandRefresh(message.client)
      .then(async () =>
        console.log(
          "Commands updated!\n" + inspect(await commandGet(), { depth: null }),
        ),
      )
      .then(() => message.reply("Commands updated!"))
      .catch(console.error);
};
