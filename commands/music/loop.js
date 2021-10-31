const Discord = require('discord.js');


module.exports = {
    name: "loop",
    aliases: ['l'],
    description: "loop",

    async run (client, message, args) {
        if(!message.member.voice.channel) return message.reply({content:'geh in nen voic channel du schmock'})

        await client.distube.setRepeatMode(message, parseInt(args[0]));
        await message.channel.send({content:"looping aktiviert"})
    }
}
