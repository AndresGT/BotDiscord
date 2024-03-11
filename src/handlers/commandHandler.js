const ascii = require("ascii-table");
const { readdir } = require("fs").promises;
const { resolve } = require("path");
require("colors");

async function loadSlash(client) {
  const table = new ascii().setHeading("SLASHCOMMANDS", "ESTADO");

  client.slashCommands = new Map();

  const slashCommandsDir = resolve(__dirname, "../commands/slahsCommands");

  try {
    const categories = await readdir(slashCommandsDir);

    for (const category of categories) {
      const categoryDir = resolve(slashCommandsDir, category);
      const commandFiles = await readdir(categoryDir);

      for (const fileName of commandFiles.filter((file) =>
        file.endsWith(".js")
      )) {
        const filePath = resolve(categoryDir, fileName);
        const command = require(filePath);
        const commandName = fileName.replace(".js", "");
        client.slashCommands.set(commandName, command);
        table.addRow(commandName, "cargado");
      }
    }

    await client.application?.commands.set([...client.slashCommands.values()]);

    console.log(table.toString(), "\n» | CommandSlash cargado con éxito".green);
  } catch (error) {
    console.error("Error al cargar comandos en slash:", error.message.red);
  }
}

module.exports = {
  loadSlash,
};