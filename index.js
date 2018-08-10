const Discord = require('discord.js');
const commands = require('./commands');
const immutable = require('immutable');

const client = new Discord.Client();

const history = [new immutable.Map()];

client.on('ready', () => {
  client.user.setActivity('stuff and things');
  client.user.setStatus('online');
});

function isCommand(message) {
  return message.content.slice(0, 2) === '$ ' || message.isMentioned(client.user);
}

function clean(str) {
  return str.replace('$ ', '').replace(/<@\d+>.? /, '').split(' ')[0];
}

client.on('message', message => {
  if (message.author.id === client.user.id) return;
  if (!isCommand(message)) return;
  const commandStr = clean(message.content);
  const command = commands[commandStr];
  if (command === undefined) {
    message.reply(`ERORR: ${commandStr} is not a valid command.`);
    return;
  }
  console.log(history[history.length - 1]);
  command.effect(history[history.length - 1], client, message)
    .then(([data, str]) => {
      if (str) return message.reply(str).then(() => data);
      return data;
    })
    .then(data => history.push(data))
    .catch(e => message.reply(`ERROR: ${e.stack || e.message}`));
});

client.login(require('./config').token);

process.on('exit', () => {
  commands.leave.effect(history[history.length - 1]);
  client.user.setGame('with upgrades');
  client.user.setStatus('idle');
  process.stdout.write('Done!\n');
});

process.on('SIGINT', process.exit.bind(process, 1));
