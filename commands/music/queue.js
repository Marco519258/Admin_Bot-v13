const Discord = require('discord.js');


module.exports = {
    name: "queue",
    aliases: ['q'],
    description: "check queue",

    async run (client, message, args) {
        if(!message.member.voice.channel) return message.reply({content:'geh in nen voic channel du schmock'})

        const queue = client.distube.getQueue(message);

        await message.channel.send({content:`Current queue:\n${queue.songs.map((song, id) =>`**${id ? id : 'Playing'}**. ${song.name} - \`${song.formattedDuration}\``,).slice(0, 10).join('\n')}`,})
    }
}