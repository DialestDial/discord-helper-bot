const requestsChannelId = "1394114179488551133";
import {
  ChannelType,
  GuildTextBasedChannel,
  Message,
  TextChannel,
} from "discord.js";
import lastContinuousNum from "../../../util/lastContinuousNum";
export = async (message: Message) => {
  if (
    message.channelId === requestsChannelId &&
    message.content.startsWith("!")
  ) {
    const { threads } = await (message.channel as TextChannel).threads.fetch();
    const reg = /^(?:Client (?<clientNumber>\d+): )/i;
    let orderedClients = threads
      .filter((t) => !t.archived)
      .toJSON()
      .sort(
        (t1, t2) =>
          parseInt(
            t1.name.match(reg)?.groups?.clientNumber ||
              Number.MAX_SAFE_INTEGER.toString(),
          ) -
          parseInt(
            t2.name.match(reg)?.groups?.clientNumber ||
              Number.MAX_SAFE_INTEGER.toString(),
          ),
      );

    //Si es 0, debe salir 1
    //Si es 1, debe salir minClientNum
    //Si es algo mayor, debe salir 1

    (message.channel as TextChannel).threads
      .create({
        name: `Client ${
          lastContinuousNum(
            orderedClients.map((t) =>
              Number(t.name.match(reg)?.groups?.clientNumber),
            ),
          ) + 1
        }: ${message.content.slice(1)}`,
        autoArchiveDuration: 10080,
        invitable: true,
        reason: "Created through a command",
        type: ChannelType.PublicThread,
      })
      .then(
        (thread) =>
          thread
            .send(
              `[Click here to enter the checklist template](<${process.env.checklistSpreadsheet}>)`,
            )
            .catch(() => {}),
        () =>
          (message.channel as TextChannel)
            .send(
              "Sorry, I was not able to create a thread with that name. Maybe it's too long?",
            )
            .catch(() => {}),
      );
  }
};
