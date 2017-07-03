const Discord = require("discord.js");
const R = require("ramda");
const ytdl = require("ytdl-core");
const fs = require("fs");
const https = require("https");

const debug = R.curry(function debug(head, data) {
    console.log(head + ":", data);
    return data;
});

/*
command: {
    name: String,
    description: String,
    effect: function(Discord.Client, Discord.Message) : Promise(String)
}
*/
let data = {
    voice: null
};

const commands = module.exports = {
    help: {
        name: "Help",
        description: "Output help text",
        effect(client, message) {
            return Promise.resolve(
                ["Possible Commands:"]
                    .concat(
                        R.values(
                            R.map(
                                c => `\t${c.name} - ${c.description}`,
                                commands
                            )
                        )
                    )
                    .join("\n")
            );
        }
    },
    join: {
        name: "Join",
        description: "Voice connect to your voice channel",
        effect(client, message) {
            if (message.member.voiceChannel) {
                if (data.voice) {
                    data.voice.channel.leave();
                }
                return message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        data.voice = connection;
                        return `Successfully connected to ${data.voice.channel.name}!`;
                    })
                    .catch(console.log);
            } else {
                return Promise.resolve('ERROR: You are not in a voice channel');
            }
        }
    },
    leave: {
        name: "Leave",
        description: "Leave current voice channel",
        effect(client, message) {
            if (data.voice) {
                if (data.broadcast) {
                    data.broadcast.end();
                }
                let name = data.voice.channel.name;
                data.voice.channel.leave();
                data.voice = null;
                return Promise.resolve(`Left ${name}.`);
            } else {
                return Promise.resolve("ERROR: Not in voice channel!");
            }
        }
    },
    play: {
        name: "Play",
        description: "Play the specified music (More platforms to come, currently only YouTube)",
        effect(client, message) {
            if (!data.voice) {
                return Promise.resolve("ERROR: Not in voice channel");
            }
            if (data.broadcast) {
                data.broadcast.end();
            }
            let url = message.content.split(' ').pop();
            data.broadcast = data.voice.playStream(ytdl(url, {filter: "audioonly"}), {volume: 0.25});
            return Promise.resolve("Playing");
        }
    },
    id: {
        name: "Id",
        description: "Give your id",
        effect(client, message) {
            return Promise.resolve(message.author.id);
        }
    }/*,
    eval: {
        name: "Eval",
        description: "Eval code (only owner can do this)",
        effect(client, message) {
            console.log(message.author.id);
            if (message.author.id != 164188384942751744) {
                return Promise.resolve("ERROR: You are not owner");
            }
            let js = message.content.split(' ');
            js.unshift();
            js = js.join(' ');
            eval(js);
        }
    }*/,
    setnick: {

    }
};
