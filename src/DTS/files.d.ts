import { Client, Message, PermissionsString } from "discord.js";

export type dictionary = {
  en: string;
  es?: string;
};
export type text_command = {
  name: string;
  description?: dictionary;
  dm?: boolean;
  guild?: boolean;
  args?: boolean | null;
  usage?: string;
  aliases?: string[];
  hiddenAliases?: string[];
  allow?: PermissionsString[] | boolean;
  channels?: string[] | null;
  execute(message: Message, args?: string[] | string): Promise<any>;
};
export type event = {
  name: string;
  once: boolean;
  execute(client: Client, ...listener: any): Promise<any>;
};
