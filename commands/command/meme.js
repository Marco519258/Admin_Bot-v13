const randomPuppy = require('random-puppy');
const Discord = require('discord.js');



module.exports = {
    name: "meme",
    description: "click hir fot the site",
    
    async run (client, message, args) {
        const subReddits = ["meme", "dankmeme", "memes"]
        const random = subReddits[Math.floor(Math.random() * subReddits.length)]

        const img = await randomPuppy(random)
        
        const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setImage(img)
        .setTitle(`click hier for the site`)
        .setURL(`https://reddit.com/r/${random}`)

        message.channel.send({embeds:[embed]})
    }
}