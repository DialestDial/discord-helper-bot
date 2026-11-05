//Storage
import customColor from "../../../util/customColor";
import { Message } from "discord.js";
export = async (message: Message) => {
  customColor({
    message,
    _channel: "1563028212211257394",
    prefixC: "#",
    position: 2,
  });
}
