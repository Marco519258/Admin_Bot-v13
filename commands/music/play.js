const Discord = require('discord.js');


module.exports = {
    name: "play",
    aliases: ['p'],
    description: "play a song",

    async run (client, message, args) {
        const voiceChannel = message.member.voice.channel;
        if(!voiceChannel) return message.reply({content:'geh in nen voic channel du schmock'})

        const music = args.join(" ");
        if(!music) return message.reply({content:"you musst be in a voice channel first"})

        await client.distube.play(message, music)
        
    }
}
