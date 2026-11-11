//MES
const requestsChannelId = "1394114179488551133";
import { Message, TextChannel } from "discord.js";
export = async (message: Message) => {
  const thread = message.channel;
  if (thread.isThread() && thread.parentId === requestsChannelId) {
    const groups = thread.name.match(
      /^(?:Client (?<clientNumber>\d+): )?(?<originalName>.+)$/i,
    )?.groups;
    if (message.content === "!c") {
      const originalName = groups?.originalName
        ?.replace(/ [\[\(]completed[\)\]]/i, "")
        ?.replace(/ [\[\(]delivery[\)\]]/i, "")
        ?.replace(/ [\[\(]ready for pickup[\)\]]/i, "")
        ?.replace(/ [\[\(]ready on the warehouse[\)\]]/i, "")
        ?.trim();
      await thread.edit({ name: originalName + " [Completed]", archived: true });
      (thread.parent as TextChannel).send(
        `Thread <#${thread.id}> ${groups?.clientNumber ? `for client #${groups.clientNumber} ` : ""}has been closed!`,
      );
    }
    if (message.content === "!r") {
      const originalName = thread.name
        ?.replace(/ [\[\(]ready for pickup[\)\]]/i, "")
        .trim();
      thread.setName(originalName + " [Ready For Pickup]");
    }
  }
};
