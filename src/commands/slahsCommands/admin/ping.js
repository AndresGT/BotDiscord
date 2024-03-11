const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Comando de ping!!",

  async execute(client, interaction) {
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.reply("No tienes los permisos necesarios para ejecutar este comando.");
    }

    let ping = Date.now() - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Zork",
        iconURL: "https://cdn.discordapp.com/avatars/1203517180751118468/37df56e41c70d30da0405ef639404924.png?size=1024",
      })
      .setColor("#6600CC")
      .setTitle("Pong! 🏓")
      .setDescription(`⌛ Time: ${ping} ms`);

    const reply = await interaction.reply({ embeds: [embed], ephemeral: true });

    setTimeout(async () => {
      await reply.delete().catch(console.error);
    }, 7000);
  },
};