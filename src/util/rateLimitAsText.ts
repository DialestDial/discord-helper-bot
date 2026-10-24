import { Message, TextChannel } from "discord.js";
export = async (message: Message) => {
  const rl = (message.channel as TextChannel).rateLimitPerUser;
  const rl3600 = [Math.floor(rl / 3600), rl % 3600];
  const rl60 = [Math.floor(rl3600[1] / 60), rl3600[1] % 60];
  const a = [
    rl3600[0] ? `${rl3600[0]} hour${rl3600[0] === 1 ? "" : "s"}` : "",
    rl60[0] ? `${rl60[0]} minute${rl60[0] === 1 ? "" : "s"}` : "",
    rl60[1] ? `${rl60[1]} second${rl60[1] === 1 ? "" : "s"}` : "",
  ].filter((x) => x !== "");
  if (a.length > 1) a.splice(-1, 0, "and");
  return a.join(", ").replace(", and,", " and");
};
