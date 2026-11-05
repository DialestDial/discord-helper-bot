//MES
const requestsChannelId = "1394114179488551133";
import { Message, TextChannel } from "discord.js";
export = async (message: Message) => {
  const thread = message.channel;
  if (
    thread.isThread() &&
    thread.parentId === requestsChannelId &&
    message.content === "!c"
  ) {
    const groups = thread.name.match(
      /^(?:Client (?<clientNumber>\d+): )?(?<originalName>.+)$/i,
    )?.groups;
    const originalName = groups?.originalName
      ?.replace(/[\[\(]completed[\)\]]/i, "")
      ?.replace(/[\[\(]delivery[\)\]]/i, "")
      ?.replace(/[\[\(]ready for pickup[\)\]]/i, "")
      ?.replace(/[\[\(]ready on the warehouse[\)\]]/i, "")
      ?.trim();
    thread.setName(originalName + " [Completed]");
    thread.setArchived(true);
    (thread.parent as TextChannel).send(
      `Thread <#${thread.id}> ${groups?.clientNumber ? `for client #${groups.clientNumber} ` : ""}has been closed!`,
    );
  }
};
