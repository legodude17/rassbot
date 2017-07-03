const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require("./commands");

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setGame("music");
    client.user.setStatus("online");
});

function isCommand(message) {
    return message.content.slice(0, 2) === "$ " || message.isMentioned(client.user);
}

function clean(str) {
    console.log(str);
    return str.replace("$ ", "").replace(/<@\d+>.? /, "").split(" ")[0];
}

client.on('message', message => {
    if (message.author.id === client.user.id) return;
    if (!isCommand(message)) return;
    let commandStr = clean(message.content);
    let command = commands[commandStr];
    if (command == undefined) {
        return message.reply(`${commandStr} is not a valid command.`);
    }
    return command.effect(client, message)
        .then(str => str ? message.reply(str) : str);
});

client.login(require("./config").token);

process.on("exit", function () {
    commands.leave.effect();
    client.user.setGame("with upgrades");
    client.user.setStatus("idle");
    console.log("Done!");
});
process.on("SIGINT", process.exit.bind(process, 1));
