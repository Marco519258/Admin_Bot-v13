const Discord = require('discord.js')

module.exports = {
    name: "help.games",
    description: "hjkhjkhh",

    async run (client, message, args) {
        var embed = new Discord.MessageEmbed()
        .setColor('#002fff')
        .setTitle('Help | music')
        .setDescription('')
        .addField("?coins" , "shows your coins",true)
        .addField("?flip" , "flip a coin",true)
        .setTimestamp()
        .setFooter("Admin_Bot",client.user.avatarURL())

        message.channel.send({embeds:[embed]})
    }
}