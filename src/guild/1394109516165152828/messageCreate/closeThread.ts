//MES
const requestsChannelId = "1394114179488551133";
import { Message } from "discord.js";
export = async (message: Message) => {
  const thread = message.channel;
  if (
    thread.isThread() &&
    thread.parentId === requestsChannelId &&
    message.content === "!c"
  ) {
    const originalName = thread.name
      .match(/^(?:Client \d+: )?(?<originalName>.+)$/i)
      ?.groups?.originalName?.replace(/[\[\(]completed[\)\]]/i, "")
      ?.replace(/[\[\(]delivery[\)\]]/i, "")
      ?.replace(/[\[\(]ready for pickup[\)\]]/i, "")
      ?.replace(/[\[\(]ready on the warehouse[\)\]]/i, "")
      ?.trim();
    thread.setName(originalName + " [Completed]");
    thread.setArchived(true);
  }
};
