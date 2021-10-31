const Discord = require('discord.js')

module.exports = {
    name: "stop",
    desciption: "stop command",

    async run (client, message, args) {
        if(!message.member.voice.channel) return message.reply({content:'geh in nen voic channel du schmock'})
        
        await client.distube.stop(message)
        await message.channel.send("**stopt die musik**")
    }
}