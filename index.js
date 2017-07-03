const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require("./commands");

client.on('ready', () => {
    console.log('I am ready!');
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
