const Discord = require('discord.js')

module.exports = {
    name: "help.cmd",
    description: "hjkhjkhh",

    async run (client, message, args) {
        var embed = new Discord.MessageEmbed()
        .setColor('#002fff')
        .setTitle('Help | cmd')
        .setDescription('')
        .addField("?user" , "shows infos about an user",true)
        .addField("?serverinfo" , "shows infos about the server",true)
        .addField("?meme", "shows you a meme",true)
        .addField("?ping" , "shows the bot ping",true)
        .addField("?avatar","shows the avatar of you or someone else",true)
        .addField("?bugreport","report a bug you find",true)
        .addField("?invite","sends an invite link for me",true)
        .addField("?dc","sends an invie link for my server",true)
        .addField("?level","shows your level",true)
        .addField("?how many server", "shows how many servers the bot is", true)
        .setTimestamp()
        .setFooter("Admin_Bot",client.user.avatarURL())

        message.channel.send({embeds:[embed]})
    }
}
