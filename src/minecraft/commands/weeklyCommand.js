const minecraftCommand = require("../../contracts/minecraftCommand.js");
const { getUUID } = require("../../contracts/API/PlayerDBAPI.js");
const { getStats } = require("../../contracts/helperFunctions.js");
const config = require("../../../config.json");
const axios = require("axios");

class WeeklyStatsCommand extends minecraftCommand {
  constructor(minecraft) {
    super(minecraft);

    this.name = "weekly";
    this.aliases = [""];
    this.description = "Get weekly stats of specified user.";
    this.options = [
      {
        name: "username",
        description: "Minecraft username",
        required: false,
      },
      {
        name: "mode",
        description: "Gamemode",
        required: false,
      },
    ];
  }

  async onCommand(username, message) {
    const modes = [
      "bw",
      "bedwars",
      "bedwar",
      "bws",
      "sw",
      "skywars",
      "skywar",
      "sws",
      "duels",
      "duel",
      "d",
      "sb",
      "skyblock",
    ];
    const args = this.getArgs(message).map((arg) => arg.replaceAll("/", ""));

    const mode = modes.includes(args[0])
      ? args[0]
      : modes.includes(args[1])
      ? args[1]
      : null;
    username =
      (args[0] == mode
        ? args[1] === ""
          ? username
          : args[1]
        : args[0] === ""
        ? username
        : args[0]) || username;

    try {
      const uuid = await getUUID(username);

      this.send(await getStats(username, uuid, mode, "weekly"));
    } catch (error) {
      if (error === "Player not in database") {
        this.send(
          `/gc ${username} is not registered in the database! Adding them now..`
        );

        const uuid = await getUUID(username);
        let res;
        if (["sb", "skyblock"].includes(mode)) {
          res = await axios.post(
            `https://api.pixelic.de/player/skyblock/register/${uuid}?key=${config.minecraft.API.pixelicAPIkey}`
          );
        } else {
          res = await axios.post(
            `https://api.pixelic.de/player/register/${uuid}?key=${config.minecraft.API.pixelicAPIkey}`
          );
        }

        if (res.status == 201) {
          this.send(`/gc Successfully registered ${username} in the database!`);
        } else if (res.status == 404) {
          this.send(
            `/gc Uh oh, somehow this player is already registered in the database! Please try again in few seconds..`
          );
        } else {
          this.send(
            `/gc Error: ${res.status} ${
              res?.statusText || "Something went wrong.."
            }`
          );
        }
      } else {
        this.send(`/gc Error: ${error}`);
      }
    }
  }
}

module.exports = WeeklyStatsCommand;
