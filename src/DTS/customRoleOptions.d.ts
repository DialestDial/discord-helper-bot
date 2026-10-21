import { Message } from "discord.js";
export type customRoleOptions = {
  message: Message;
  _channel: string | string[];
  prefix: string;
  hoist?: boolean;
  position?: number;
  role?: string;
};
