const Discord = require('discord.js')

module.exports = {
    name: "help.admin",
    description: "hjkhjkhh",

    async run (client, message, args) {
        var embed = new Discord.MessageEmbed()
        .setColor('#002fff')
        .setTitle('Help | admin')
        .setDescription('')
        .addField("?warn" , "warn a user",true)
        .addField("?ban" , "ban a user",true)
        .addField("?kick", "kick a user",true)
        .addField("?clear" , "clear a channel",true)
        .addField("?say","repeat your message",true)
        .addField("?mute", "mute a member", true)
        .addField("?unmute", "unmute a user",  true)
        .setTimestamp()
        .setFooter("Admin_Bot",client.user.avatarURL())

        message.channel.send({embeds:[embed]})
    }
}
