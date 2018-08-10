// const Discord = require('discord.js');
const R = require('ramda');
const ytdl = require('ytdl-core');
// const fs = require('fs');
// const https = require('https');

// const debug = R.curry((head, data) => {
//   console.log(`${head}:`, data);
//   return data;
// });

/*
command: {
    name: String,
    description: String,
    effect: function(Discord.Client, Discord.Message, Data) : Promise(String)
}
*/

const commands = module.exports = {
  help: {
    name: 'Help',
    description: 'Output help text',
    effect(data) {
      return Promise.resolve([data, ['Possible Commands:']
        .concat(R.values(R.map(
          c => `\t${c.name} - ${c.description}`,
          commands
        )))
        .join('\n')]);
    }
  },
  join: {
    name: 'Join',
    description: 'Voice connect to your voice channel',
    effect(data, client, message) {
      if (message.member.voiceChannel) {
        if (data.get('voice')) {
          data.get('voice').channel.leave();
        }
        return message.member.voiceChannel.join()
          .then(connection => // Connection is an instance of VoiceConnection
            [
              data.set('voice', connection),
              `Successfully connected to ${connection.channel.name}!`
            ]);
      }
      return Promise.resolve('ERROR: You are not in a voice channel');
    }
  },
  leave: {
    name: 'Leave',
    description: 'Leave current voice channel',
    effect(data) {
      if (data.get('voice')) {
        if (data.get('broadcast')) {
          data.get('broadcast').end();
        }
        const { name } = data.get('voice').channel;
        data.get('voice').channel.leave();
        return Promise.resolve([data.set('voice', null), `Left ${name}.`]);
      }
      return Promise.reject(new Error('Not in voice channel!'));
    }
  },
  play: {
    name: 'Play',
    description: 'Play the specified music (More platforms to come, currently only YouTube)',
    effect(data, client, message) {
      if (!data.get('voice')) {
        return Promise.reject(new Error('Not in voice channel'));
      }
      if (data.get('broadcast')) {
        data.get('broadcast').end();
      }
      const url = message.content.split(' ').pop();
      const broadcast = data.get('voice').playStream(ytdl(url, { filter: 'audioonly' }), { volume: 0.25 });
      return Promise.resolve([data.set('broadcast', broadcast), 'Playing']);
    }
  },
  id: {
    name: 'Id',
    description: 'Give your id',
    effect(data, client, message) {
      return Promise.resolve([data, message.author.id]);
    }
  },
  eval: {
    name: 'Eval',
    description: 'Eval code (only owner can do this)',
    effect(data, client, message) {
      // console.log(message.author.tag, message.author.tag === 'legodude17#7141');
      if (message.author.tag.trim() !== 'legodude17#7141') {
        return Promise.reject(new Error('You are not owner'));
      }
      // return Promise.resolve(message.author.tag);
      try {
        const res = Promise.resolve([data, eval(message.content.split(' ').slice(2).join(' '))]); // eslint-disable-line
        return res;
      } catch (e) {
        return Promise.reject(e);
      }
    }
  },
  setnick: {
    name: 'SetNick',
    description: 'Set the nickname of the bot',
    effect(data, client, message) {
      const nick = message.content.split(' ').pop();
      return client.user.setUsername(nick)
        .then(user => [data, `My new username is ${user.username}`]);
    }
  }
};
