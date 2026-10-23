import { Message } from "discord.js";
export type customColorOptions = {
  message: Message;
  _channel: string | string[];
  prefixC: string;
  prefixR?: string;
  position?: number;
  embed?: string;
};
