import { Client } from "discord.js";
import { event } from "../DTS/files";
export = {
  name: "clientReady",
  once: true,
  execute: async (client: Client) => {
    console.log("Ready!!!");
  },
} satisfies event;
