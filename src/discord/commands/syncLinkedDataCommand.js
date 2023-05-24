const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  name: "sync-linked-data",
  description: "Syncs Linked files with each other.",

  execute: async (interaction) => {
    try {
      if (interaction.user.id !== "486155512568741900") {
        throw new Error("You don't have permission to use this command.");
      }

      const users = await interaction.guild.members.fetch();
      if (users === undefined) {
        throw new Error("No guild members found!");
      }

      const linkedData = fs.readFileSync("data/minecraftLinked.json", "utf8");
      if (linkedData === undefined) {
        throw new Error("No linked users found!");
      }

      const linked = JSON.parse(linkedData);
      if (linked === undefined) {
        throw new Error("Failed to parse Linked data!");
      }

      const output = {};
      for (const [uuid, id] of Object.entries(linked)) {
        output[id] = uuid;
      }

      fs.writeFileSync("data/discordLinked.json", JSON.stringify(output));

      const successEmbed = new EmbedBuilder()
        .setColor(3066993)
        .setAuthor({ name: "Success!" })
        .setDescription(`Linked data has been synced!`)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.log(error);

      const errorEmbed = new EmbedBuilder()
        .setColor(15548997)
        .setAuthor({ name: "An Error has occurred" })
        .setDescription(`\`\`\`${error}\`\`\``)
        .setFooter({
          text: `by DuckySoLucky#5181 | /help [command] for more information`,
          iconURL: "https://imgur.com/tgwQJTX.png",
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
