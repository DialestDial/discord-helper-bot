import { Client } from "discord.js";
import { event } from "../DTS/files";
import commandRefresh from "../util/commandRefresh";
import commandGet from "../util/commandGet";
import { inspect } from "util";
export = {
  name: "clientReady",
  once: true,
  execute: async (client: Client) => {
    console.log("Ready!!!");
    commandRefresh(client)
      .then(async () =>
        console.log(
          "Commands updated!\n" + inspect(await commandGet(), { depth: null }),
        ),
      )
      .catch(console.error);
  },
} satisfies event;
