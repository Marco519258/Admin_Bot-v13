const Discord = require('discord.js')

module.exports = {
    name:"mute",

       async run (client, message, args) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MUTE_MEMBERS)) return message.reply({content:"You have no rights for it!"}).then(msg=>msg.delete({timeout:5000}));
            
            let member = message.mentions.members.first();
            let reason = message.content.split(" ").slice(2).join(" ")
            let muter = message.member.user
            let role = message.guild.roles.cache.find(role => role.name === 'Muted')
            let memberrole = message.guild.roles.cache.find(role => role.name === 'Member')
            if(!memberrole) return message.reply({content:"Please create a roll Member with big M"})
            if(!role) return message.reply({content:"Please create a roll Muted with big M"})
            if(!reason) reason = "no reason"
            if(!member) return message.reply({content:"Please specify a user "})
           
            if(member.roles.cache.has(role.id)) return message.reply({content:"This user is already muted"})
            member.roles.remove(memberrole.id)
            member.roles.add(role.id).then(()=>{
                message.channel.send({content:`Successfully ${member} muted. Reason: ${reason}. Muted by: ${muter} `})
})
}
}
      
    

 



    
