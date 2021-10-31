const Discord = require('discord.js')

module.exports = {
    name: "kick",
    description: "hjkhjkhh",

    async run (client, message, args) {

            if(!message.member.permissions.has(Discord.Permissions.FLAGS.GUILD_BANS)) return message.reply({content:"You have no rights for it!"}).then(msg=>msg.delete({timeout:5000}));
            let user = message.mentions.members.first();
            let reason = message.content.split(" ").slice(2).join(" ")
            if(!reason) reason = "no reason"
            if(!user) return message.reply({content:"Please specify a user!"}).then(msg=>msg.delete({timeout:5000})); 
        
            message.guild.member(user).kick().catch(err=>{
              if(err){
                message.channel.send({content:"I cant kick the user because he is the owner of the server!"}).then(msg=>msg.delete({timeout:10000})); 
              }
            })
            message.channel.send({content:`Successfully Kicked ${user}. Reason: ${reason}`})
               
          }
    
}

