const Discord = require('discord.js');



module.exports = {
    name: "removerole",

    async run (client, message, args) {
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.MANAGE_ROLES)) return message.reply({content:"You have no rights for it!"}).then(msg=>msg.delete({timeout:5000}));
        const targetUser = message.mentions.users.first()
        if(!targetUser) {
            message.reply({content:"Please specify a user"}) 
            return
        }

        const roleName =  message.content.split(" ").slice(2).join(" ")
      
        const { guild } = message
        const role = guild.roles.cache.find((role) => {
            return role.name === roleName
        })
        if (!role) {
            message.reply({content:`There is no role with the name ${roleName}`})
            return
        }
        const member = guild.members.cache.get(targetUser.id)
        if(member.roles.cache.get(role.id)) {
            member.roles.remove(role)
            message.channel.send({content:`${member} has no longer  **${roleName}**`})
        } else {
            message.channel.send({content:`That user does not have the role **${roleName}**`})
        }
    },
}