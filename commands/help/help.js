const Discord = require('discord.js')

module.exports = {
    name: "help",
    description: "hjkhjkhh",

    async run (client, message, args) {
        var helpembed = new Discord.MessageEmbed()
        .setColor('#002fff')
        .setTitle('Help | general')
        .setDescription('')
        .addField(":mens:?help.cmd" , "player commands")
        .addField(":crown:?help.admin" , "admin commands")
        .addField(":video_game:?help.games", "game commands")
        .addField(":arrow_forward:?help.music" , "music command")
        .setTimestamp()
        .setFooter("Admin_Bot",client.user.avatarURL())

        message.channel.send({embeds:[helpembed]})
    }
}