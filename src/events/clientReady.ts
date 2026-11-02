import { Client } from "discord.js";
import { event } from "../DTS/files";
import commandGet from "../util/commandGet";
import { inspect } from "util";
export = {
  name: "clientReady",
  once: true,
  execute: async (client: Client) => {
    console.log("Ready!!!");
  },
} satisfies event;
