const ascii = require("ascii-table");
const { readdir } = require("fs").promises;
const path = require("path");
require("colors");

async function loadPrefixCommands(client, prefix) {
  const table = new ascii().setHeading("COMMANDPREFIX", "ESTADO");

  try {
    client.prefixCommands = new Map();

    const commandsPath = path.join(__dirname, "../commands/prefixCommands");
    const categories = await readdir(commandsPath);

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);

      const files = await readdir(categoryPath);
      const jsFiles = files.filter((file) => file.endsWith(".js"));

      for (const fileName of jsFiles) {
        const filePath = path.join(categoryPath, fileName);
        const command = require(filePath);

        // Asegúrate de que el objeto command tenga las propiedades necesarias
        if (
          typeof command.name === "string" &&
          typeof command.execute === "function"
        ) {
          client.prefixCommands.set(command.name, command);
          table.addRow(command.name, "cargado");
        } else {
          console.error(
            `Error: Comando mal formateado en ${filePath}. Asegúrate de tener las propiedades 'name' (cadena) y 'execute' (función).`
          );
          throw new Error(
            `Comando mal formateado en ${filePath}. Asegúrate de tener las propiedades 'name' y 'execute'.`
          );
        }
      }
    }

    console.log(
      table.toString(),
      "\n» | CommandPrefix cargado con éxito".green
    );
  } catch (error) {
    console.error("Error al cargar comandos en Prefijo:", error.message.red);
  }
}

module.exports = { loadPrefixCommands };