const requestsChannelId = "1567967169298432144";
import {
  ChannelType,
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
    const regChannels = /^(?:Client (?<clientNumber>\d+): )/i;
    const regMsg = /\s+\d+/g;
    let orderedClients = threads
      .filter((t) => !t.archived)
      .toJSON()
      .sort(
        (t1, t2) =>
          parseInt(
            t1.name.match(regChannels)?.groups?.clientNumber ||
              Number.MAX_SAFE_INTEGER.toString(),
          ) -
          parseInt(
            t2.name.match(regChannels)?.groups?.clientNumber ||
              Number.MAX_SAFE_INTEGER.toString(),
          ),
      );
    //
    const noPrefix = message.content.slice(1);
    let splitted = noPrefix.split(regMsg);

    if (!splitted[0])
      return (message.channel as TextChannel).send(
        'Don\'t forget to specify the name of the client if you want to create a thread. For example, using `!Dial d` would create a new thread for the client "Dial" with the next available client number, and it would get flagged as a (Delivery) request. You can also specify a specific client number override if you want, using: `!Dial 3d` or `!Dial 3 d`.',
      );
    if (
      (splitted[1]?.trim() && splitted[1]?.trim() !== "d") ||
      splitted[2] !== undefined
    )
      return (message.channel as TextChannel).send(
        "You added an invalid input after the client's name. The only valid option is a `d`, which means that the order is a delivery.",
      );

    const clientNum = (noPrefix.match(regMsg) || [""])[0].trim();
    const delivery =
      (splitted[1] === "d" || message.content.endsWith(" d")) &&
      !message.content.match(/^!\s+d$/);
    //
    (message.channel as TextChannel).threads
      .create({
        name: `Client ${
          clientNum ||
          lastContinuousNum(
            orderedClients.map((t) =>
              Number(t.name.match(regChannels)?.groups?.clientNumber),
            ),
          ) + 1
        }: ${splitted[0].trim().endsWith(" d") && splitted[1] === undefined ? splitted[0].trim().slice(0, -2).trim() : splitted[0].trim()}${delivery ? " (Delivery)" : ""}`,
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
