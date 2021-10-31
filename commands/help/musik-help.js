const Discord = require('discord.js')

module.exports = {
    name: "help.music",
    description: "hjkhjkhh",

    async run (client, message, args) {
        var embed = new Discord.MessageEmbed()
        .setColor('#002fff')
        .setTitle('Help | music')
        .setDescription('')
        .addField("?play" , "skip the current song",true)
        .addField("?stop" , "stop the music",true)
        .addField("?skip", "skip the music",true)
        .addField("?queue" , "show the queue",true)
        .addField("?loop","activate the loop",true)
        .setTimestamp()
        .setFooter("Admin_Bot",client.user.avatarURL())

        message.channel.send({embeds:[embed]})
    }
}
