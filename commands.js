const Discord = require("discord.js");
const R = require("ramda");
const ytdl = require("ytdl-core");
const fs = require("fs");
const https = require("https");

const debug = R.curry(function debug(head, data) {
    console.log(head + ":", data);
    return data;
});

const URL = "https://r20---sn-o097znls.googlevideo.com/videoplayback?source=youtube&clen=3641461&expire=1496018758&itag=171&initcwndbps=1667500&keepalive=yes&key=yt6&ei=5RorWdGTOI6L-wP2ybnwDw&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&mn=sn-o097znls&ip=73.231.103.152&mm=31&dur=206.064&id=o-AMEfEdJrU6jdYFFr4_u6HjeybdDoiyXcQzRHNS7-XY65&mime=audio%2Fwebm&requiressl=yes&ms=au&mv=m&pl=16&mt=1495997069&gir=yes&ipbits=0&lmt=1449565066607914&ratebypass=yes&signature=4C92AF30E7B932EEF2271ECADCD8D8A4F8404485.DC177C2D510849A24C2901374AEFB87DCAC33CEA";

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
            data.broadcast = data.voice.playStream(ytdl(url, {filter: "audioonly"}));
            return Promise.resolve("Playing");
        }
    },
    id: {
        name: "Id",
        description: "Give your id",
        effect(client, message) {
            return Promise.resolve(message.author.id);
        }
    }
};
