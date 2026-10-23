//AOMC Storage Server
import customColor from "../../../modules/customColor";
import { Message } from "discord.js";
export = async (message: Message) => {
  customColor({
    message,
    _channel: "1563058988411785247",
    prefixC: "#",
    position: 2,
  });
}
