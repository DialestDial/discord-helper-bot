import { Client } from "discord.js";
export = {
  name: "clientReady",
  once: false,
  execute: async (client: Client) => {
    console.log("Ready!!!");
  },
};
