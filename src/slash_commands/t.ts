import { ChatInputCommandInteraction } from "discord.js";
import { slash_command } from "../DTS/files";
export = {
  info: {
    name: "t",
    description: "Returns a Discord timestamp depending on your request",
    default_member_permissions: null,
    contexts: [0, 1, 2],
    options: [
      {
        name: "options",
        type: 3,
        description:
          'This should follow the syntax found in the "/t help" command',
        required: true,
      },
    ],
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const reg =
          /^(?<sign>[+-])?(?<years>[0-9]+?y)?(?<months>[0-9]+?n)?(?<days>[0-9]+?d)?(?<hours>[0-9]+?h)?(?<minutes>[0-9]+?m)?(?<seconds>[0-9]+?s)?(?<round>[Y|N|D|H|M])?(?<flag>:[tTdDfFR])?(?<ephemeral>e)?$/;
      const parameters = interaction.options
      .getString("options")
      ?.match(reg)?.groups;
    if (parameters) {
      let sign = parameters.sign === "-" ? -1 : 1;
      let years = Number(parameters.years?.slice(0, -1)) * sign || 0;
      let months = Number(parameters.months?.slice(0, -1)) * sign || 0;
      let days = Number(parameters.days?.slice(0, -1)) * sign || 0;
      let hours = Number(parameters.hours?.slice(0, -1)) * sign || 0;
      let minutes = Number(parameters.minutes?.slice(0, -1)) * sign || 0;
      let seconds = Number(parameters.seconds?.slice(0, -1)) * sign || 0;
      let { round, ephemeral } = parameters;
      let flag = parameters.flag || "";

      try {
      let time = new Date(
        Temporal.Now.instant().toZonedDateTimeISO("UTC").add({
          years,
          months,
          days,
          hours,
          minutes,
          seconds,
        }).epochMilliseconds,
      );

      switch (round) {
        case "Y":
          time.setUTCMonth(1);
        case "N":
          time.setUTCDate(1);
        case "D":
          time.setUTCHours(0);
        case "H":
          time.setUTCMinutes(0);
        case "M":
          time.setUTCSeconds(0);
          break;
      }

      interaction.reply({
        content: `<t:${Math.floor(time.getTime() / 1000)}${flag}>`,
        flags: ephemeral ? ["Ephemeral"] : undefined,
      });
      } catch (e) {
        interaction.reply({content: "Don't you think that's a little overkill?",
                           flags: ["Ephemeral"]});
      }
    } else { //Change the.? by . and an explicit type
      const help = interaction.options.getString("options")?.match(/^help(-show)?$/);
      //Send the correct syntax for the parameters, adding an error warning if the parameter isn't exactly "help" or "help-show"
      interaction.reply(
        {content: (help
          ? ""
          : "Invalid parameters!\n\n") +
          "The correct order for the parameters is:\n`+` or `-` to go forward or back in time respectively, defaults to `+`.\n\
Any combination of years, months, days, hours, minutes and seconds, followed by their respective suffix (`n` represents months).\n\
The unit you want the date rounded at, in UTC time. `Y`, `N`, `D`, `H` or `M` but in uppercase.\n\
[Discord's flags for timestamps](<https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa>), with `:` preceding them\n\
`e` if you want to make the message only visible for you. Here are some examples:\n\
`3n6hM`, `-2d70s:R`, `50yY:te`" + (help?.groups ? "" : "\n\n-# Tip: you can use the parameter `help-show` if you want everyone to be able to see this message"),
         flags: help?.groups ? undefined : ["Ephemeral"]
        }
    );
  }}
} satisfies slash_command;
