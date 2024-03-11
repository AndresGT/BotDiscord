const { Client } = require("discord.js");
const client = new Client({ intents: 3276799 });
require("dotenv").config();

const { loadSlash } = require("./handlers/commandHandler");
const { loadPrefixCommands } = require("./handlers/commandPrefix");

//Manejo de comandos en slash
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const cmd = client.slashCommands.get(interaction.commandName);
  if (!cmd) return;

  const args = [];
  for (let options of interaction.options.data) {
    if (options.type === 1) {
      if (options.name) args.push(options.name);
      options.options?.forEach((x) => {
        if (x.value) args.push(x.value);
      });
    } else if (options.value) args.push(options.value);
  }
  cmd.execute(client, interaction, args);
});

//MANEJADOR DE COMANDOS EN PREFIX
const prefix = process.env.PREFIX;

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    // Asegurarse de que el prefijo está definido
    if (!prefix || typeof prefix !== "string") {
      console.error("Error: El prefijo no está definido o no es una cadena.");
      return;
    }

    // Evitar que el bot responda a sus propios mensajes
    if (message.author.id === client.user.id) return;

    // Obtener argumentos y nombre del comando
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Verificar si el mapa de comandos con prefijo está definido
    if (!client.prefixCommands) {
      console.error("Error: El mapa de comandos con prefijo no está definido.");
      return;
    }

    // Obtener el comando del mapa de comandos con prefijo
    const command = client.prefixCommands.get(commandName);

    // Verificar si el comando existe
    if (!command) {
      console.error(`Comando '${commandName}' no encontrado.`);
      message.reply(`El comando '${commandName}' no existe.`);
      return;
    }

    // Ejecutar el comando
    await command.execute(client, message, args);
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
    message.reply("Hubo un error al procesar el mensaje.");
  }
});

(async () => {
  try {
    await client
      .login(process.env.TOKEN)
      .then(() => loadPrefixCommands(client, prefix), loadSlash(client));
    console.log("» | Bot iniciado con éxito");
  } catch (err) {
    console.error(`» | Error al iniciar el bot => ${err}`);
  }
})();
