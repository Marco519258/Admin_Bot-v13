const Discord = require('discord.js')

module.exports = {
    name: "bugreport",
  

    run: async (client, message, args) => {
      const owner = client.users.cache.get('589465372948693041')

     
     const reason = message.content.split(" ").slice(1).join(" ")
     if(!reason) return message.reply({content:"Please tell me the Bug"}).then(msg=>msg.delete({timeout:5000}));

     var embed = new Discord.MessageEmbed()
     .setColor("#002fff")
     .setTitle("New Report")
     .addField("Author", message.author.toString(), true)
     .addField("Guild", message.guild.name, true)
     .addField('Reason', reason, true)
     .setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
     .setTimestamp()


      owner.send({embeds:[embed]})
      message.channel.send({content:"Thanks for the report"}).then(msg=>msg.delete({timeout:5000}));


    }
}