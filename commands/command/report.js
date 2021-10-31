const Discord = require('discord.js')

module.exports = {
    name: "report",
  

    run: async (client, message, args) => {
      const owner = client.users.cache.get('589465372948693041')
 

     
     const member = message.mentions.members.first();
     if(!member) return message.reply({content:"Please Specify a Member"}).then(msg=>msg.delete({timeout:5000}));
     const reason = message.content.split(" ").slice(2).join(" ")
     if(!reason) return message.reply({content:"Please Specify a Reason"}).then(msg=>msg.delete({timeout:5000}));
 

     var embed = new Discord.MessageEmbed()
     .setColor("#002fff")
     .setTitle("New Report")
     .addField("Author", message.author.toString(), true)
     .addField("Guild", message.guild.name, true)
     .addField('Member', member , true)
     .addField('Reason', reason , true)
     .setThumbnail(message.author.displayAvatarURL({ dynamic: true}))
     .setTimestamp()


      owner.send({embeds:[embed]})

      message.channel.send({content:"Thanks for the report"}).then(msg=>msg.delete({timeout:15000}));


    }
}