import { Client, Message, PermissionsString } from "discord.js";
export type text_command = {
  name: string;
  description: string;
  dm: boolean;
  guild: boolean;
  args: boolean;
  usage: string;
  aliases: string[];
  hiddenAliases: string[];
  allow: PermissionsString[] | boolean;
  channels: string[] | null;
  execute(message: Message, args?: string[]): Promise<any>;
};
export type event = {
  name: string;
  once: boolean;
  execute(client: Client, ...listener: any): Promise<any>;
};
