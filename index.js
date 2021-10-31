console.log('Loading...')

const Discord = require('discord.js')
const fs = require('fs')
const { Server } = require('http')
const client = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_BANS,Discord.Intents.FLAGS.GUILD_VOICE_STATES,Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,Discord.Intents.FLAGS.GUILD_INTEGRATIONS,Discord.Intents.FLAGS.GUILD_INVITES,Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS], "partials":["MESSAGE","CHANNEL","REACTION"]});
const xpfile = require("./data/xp.json");
const warnFile =require("./data/warns.json");
const coinfile = require("./data/coins.json");
const reactionRolesConfig = JSON.parse(fs.readFileSync('./data/reactionroles.json','utf8'));
const serverstats = require("./data/servers.json");
const { readdirSync } = require('fs');
const { join } = require('path');
const ms = require('ms');
client.commands = new Discord.Collection();
const commandsFolders = readdirSync('./commands');
const Timeout = new Discord.Collection();
const tickets = require("./data/tickets.json")
const distube = require('distube');
client.distube = new distube(client, { searchSongs: false, emitNewSongOnly: true})
client.distube
.on('playSong', (message, queue, song) => message.channel.send(
  `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
))
.on('addSong', (message, queue, song) => message.channel.send(
  `Added \`${song.name}\` - \`${song.formattedDuration}\` to the queue by ${song.user}`
))


for (const folder of commandsFolders) {
  const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.on("error", console.error);

const ranks = ["Streamer",500,"VIP",50000, "Moderator",500000000, "list"];





client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log('The Bot is on ' + client.guilds.cache.size + ' servers!')
  console.log('The Bot is on ')

  const messages = [`On ${client.guilds.cache.size} servern`,'?help' , 'Beta 0.0.1' , 'Discord.js 13', 'Prefix is ?'];
  let current = 1;

  client.user.setActivity(messages[0] , {type: "PLAYING"})

  setInterval(() => {
    if(messages[current]){
      client.user.setActivity(messages[current] , {type: "PLAYING"})
      current++;
    }else{
      current = 0;
      client.user.setActivity(messages[current] , {type: "PLAYING"})
    }

  }, 25*1000)


})


//wilkommens nachricht
client.on("guildMemberAdd", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '811155700755202049')  
  if(!channel) return;
  channel.send(`${member} ist schlau,denn er/sie ist auf diesem server `)
 

  let role = member.guild.roles.cache.find(role => role.id === '781141916250406913')

  member.roles.add(role)

});

// abschieds nachricht
client.on("guildMemberRemove", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '811269228857786398')
  if(!channel) return;
  channel.send(`${member} ist nicht schlau, denn er/sie hat den Sever verlassen `)

});

//wilkommens max dc
client.on("guildMemberAdd", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '879713568881250314')  
  if(!channel) return;
  channel.send(`${member}, welcomme on this server  `)
 

});

// abschieds max dc
client.on("guildMemberRemove", member => {
  let channel = member.guild.channels.cache.find(c => c.id === '879713626762653708')
  if(!channel) return;
  channel.send(`bye bye ${member}`)

});

client.on("messageCreate", async (message) =>{
 // private crash verhindern
  if(message.author.bot) return;
  if(!message.guild)  return message.channel.send("WARNING: You cant send my private messages!!!")

   //prefix
   if(!serverstats[message.guild.id]){
    serverstats[message.guild.id] = {
      prefix:"?"
    }
  }

  fs.writeFile("./data/servers.json", JSON.stringify(serverstats), err =>{
    if(err){
      console.log(err);
    }
  })

  let prefix =serverstats[message.guild.id].prefix


  if(!warnFile[message.author.id+message.guild.id]){
    warnFile[message.author.id+message.guild.id] = {
      warns:0,
      maxwarn:3
    }
  }

  fs.writeFile("./data/warns.json", JSON.stringify(warnFile), function(err){
    if(err) console.log(err)
  })

  //prefix ändern
  if(message.content === "prefixinfo"){
    message.channel.send({content:"The Prefix **"+serverstats[message.guild.id].prefix+"**"});
  }

  if(message.content.startsWith(prefix+"setprefix")){
    let newprefix = message.content.split(" ").slice(1).join("");

    if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("You have no rights for it!!!");
    
    serverstats[message.guild.id].prefix = newprefix;
    
    message.channel.send({content:"The new Prefix is **"+newprefix+"**."});

    fs.writeFile("./data/servers.json", JSON.stringify(serverstats),function(err){
      if(err) console.log(err);
    })
  }


  if(message.author.bot) return;



// xp system
  if(message.author.bot) return;
  var addXP = Math.floor(Math.random() * 8) + 3;

  if(!xpfile[message.author.id+message.guild.id]){
      xpfile[message.author.id+message.guild.id] = {
        xp: 0,
        level: 1,
        reqxp: 100,

      }

      fs.writeFile("./data/xp.json", JSON.stringify(xpfile),function(err){
        if(err) console.log(err)
       })
  }

  xpfile[message.author.id+message.guild.id].xp += addXP

  if(xpfile[message.author.id+message.guild.id].xp > xpfile[message.author.id+message.guild.id].reqxp){
      xpfile[message.author.id+message.guild.id].xp -= xpfile[message.author.id+message.guild.id].reqxp // xp abziehen
      xpfile[message.author.id+message.guild.id].reqxp *= 1.25 // xp die man braucht erhöhen
      xpfile[message.author.id+message.guild.id].reqxp = Math.floor(xpfile[message.author.id+message.guild.id].reqxp) // xp runden
      xpfile[message.author.id+message.guild.id].level += 1 // 1 level hinzufügen
      
      message.reply({content:"is now level **"+xpfile[message.author.id+message.guild.id].level+"**!"})
  }

  fs.writeFile("./data/xp.json",JSON.stringify(xpfile),function(err){
    if(err) console.log[err]
  })

  if(message.content.startsWith( prefix + "level")){
    let user = message.mentions.users.first() || message.author

    let embed = new Discord.MessageEmbed()
    .setTitle("Level Karte")
    .setColor('#002fff')
    .addField("Level: " , xpfile[message.author.id+message.guild.id].level)
    .addField("XP: ", xpfile[message.author.id+message.guild.id].xp+"/"+xpfile[message.author.id+message.guild.id].reqxp)
    .addField("Xp for the next level: ", xpfile[message.author.id+message.guild.id].reqxp)
    .setFooter("Admin_Bot",client.user.avatarURL())
    message.channel.send({embeds:[embed]})
    console.log({content:message.member.user.tag + ' executed Command !level!'})
  }


  //how many server
  if(message.content.startsWith(prefix+"how many server")){
    message.channel.send({content:`Bot is on ${client.guilds.cache.size} servern`})
  }





  //ping command

  if(message.content === prefix + "ping"){
    message.channel.send({content:"The Ping is "+client.ws.ping+ " ms"})
    console.log(message.member.user.tag + ' executed Command !ping!')
  }

  //test und avatar command

  if(!message.member.user.bot && message.guild){
    if(message.content == '!test'){
        message.channel.send({content:'Test!'})
        console.log(message.member.user.tag + ' executed Command !test!')
    }else if(message.content.startsWith('!avatar')){
      if(message.mentions.users.first()){
        var user = message.mentions.users.first()
        var attachment = new Discord.MessageAttachment(user.avatarURL())
        message.reply({attachment})
      }else{ 
        var attachment = new Discord.MessageAttachment(user.avatarURL())
        message.reply({attachment})
        }
        console.log(!message.member.user.tag + ' executed command !avatar')
      
      }
    
 }

 //dc command
 if(!message.member.user.bot && message.guild){
  if(message.content ==  prefix + 'dc'){
    message.channel.send({content:'This is my own Discord Server!!! https://discord.gg/HXabF7NBYx'})
    console.log(message.member.user.tag + ' executed Command !dc!')
  }
 }



 //invite
 if(!message.member.user.bot && message.guild){
  if(message.content ==  prefix + 'invite'){
    message.channel.send({content:'Thats my invite Link! https://discord.com/api/oauth2/authorize?client_id=900737114264727612&permissions=8&scope=bot'})
    console.log(message.member.user.tag + ' executed Command !invite!')
  }
 }
   



    //warn system


    if(message.content.startsWith(prefix + "warn")){
      let user = message.mentions.users.first();
      let grund = message.content.split(" ").slice(2).join(" ");

      if(!user) return message.channel.send({content:"please specify a user"}).then(msg=>msg.delete({timeout:5000}))

      if(!grund) grund = "no reason"

      let embed = new Discord.MessageEmbed()
      .setTitle("Warning!")
      .setDescription(`Warning <@!${user.id}>, you are warnt!\nReason: ${grund}`)
      .setColor("#002fff")
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send({embeds:[embed]});
      

      if(!warnFile[user.id+message.guild.id]){
        warnFile[user.id+message.guild.id] = {
          warns:0,
          maxwarn:3
        }
      }

      warnFile[user.id+message.guild.id].warns += 1

      const warnEmbed = new Discord.MessageEmbed()
      .setColor('#002fff')
      .setTitle('Warning')
      .setDescription(`The user <@!${user.id}> was kicked because of too many warnings`)
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())


      if(warnFile[user.id+message.guild.id].warns > warnFile[user.id+message.guild.id].maxwarn){
        if(message.guild.member(user).kickable == true ){
          message.channel.send({embeds:[warnEmbed]})
          message.guild.member(user).kick("Zu vile verwarnungen.")
        }
        delete warnFile[user.id+message.guild.id]
      }

      fs.writeFile("./data/warns.json", JSON.stringify(warnFile), function(err){
        if(err) console.log(err)
      })
  }






    // clear command

    if(message.content.startsWith(prefix + "clear")){
      if(!message.member.permissions.has(Discord.Intents.FLAGS.ADMINESTRATOR)) return message.reply({content:"You have no rights for it!"})
      
      let messages = message.content.split(" ").slice(1).join("");
      message.delete();

        
      if(isNaN(messages)) return  message.reply({content:"Please enter Numbers."}).then(msg=>msg.delete({timeout:5000}));
      
      

      message.channel.bulkDelete(messages);


      var embed = new Discord.MessageEmbed()
      .setColor('#002fff')
      .setTitle('Successfully')
      .setAuthor('Admin_Bot')
      .addField("Successfully " + messages + " .", "Successfully  " + messages + " messages deleted.")
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())
  
  
      message.channel.send({embeds:[embed]})
      console.log(message.member.user.tag + ' executed Command !clear')
      
    }



    //serverinfo command
    if(message.content === prefix + "serverinfo"){
      if(!message.guild) return;

      let server = {
        logo: message.guild.iconURL(),
        name: message.guild.name,
        createdaAt: message.guild.createdAt,
        id: message.guild.id,
        owner: message.guild.owner.user.username,
        region: message.guild.region,
        verified: message.guild.verified,
        members: message.guild.memberCount
        

      }
      let embed = new Discord.MessageEmbed()
      .setTitle("**ServerInfo**")
      .setColor("#002fff")
      .setThumbnail(server.logo)
      .addField("**Name**: ", server.name, true)
      .addField("**Id**: ", server.id, true)
      .addField("**Owner**: ", server.owner, true)
      .addField("**Region**: ", server.region, true)
      .addField("**Verifyd**: ", server.verified, true)
      .addField("**Member**: ", server.members, true)
      .addField("**Created on**: ", server.createdaAt,true)
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send({embeds:[embed]})
    }


    //userrinfo command
    if(message.content === prefix + "user"){
      let user = message.mentions.users.first() || message.author

      let userinfo = {
        avatar: user.avatarURL(),
        name: user.username,
        discrim: `#${user.discriminator}`,
        id: user.id,
        status: user.presence.status,
        bot: user.bot,
        erstelltAm: user.createdAt,
        

      }
      let embed = new Discord.MessageEmbed()
      .setTitle("**User Info**")
      .setColor("#002fff")
      .setThumbnail(userinfo.avatar)
      .addField("Username: ", userinfo.name, true)
      .addField("Discriminator: ", userinfo.discriminator, true)
      .addField("ID: ", userinfo.id, true)
      .addField("Status: ", userinfo.status, true)
      .addField("Bot: ", userinfo.bot, true)
      .addField("Created on: ", userinfo.erstelltAm, true)
      .setFooter("Admin_Bot",client.user.avatarURL())
      

      message.channel.send({embeds:[embed]})
    }

    //say command 
    if(message.content.startsWith( prefix + "say")){
      if(!message.member.permissions.has(Discord.Intents.FLAGS.ADMINESTRATOR)) return message.reply({content:"You have no rights for it!"})
      var text = message.content.split(' ').slice(1).join(' ');
      message.delete();
      if(!text)return message.channel.send("Please say what to repeat i ");
      
      var embed = new Discord.MessageEmbed()
      .setTitle("Admin_Bot")
      .setColor("#002fff")
      .setDescription(text)
      .setTimestamp()
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send({embeds:[embed]})
      
    }


    //coin system

    if(!coinfile[message.author.id+message.guild.id]){
      coinfile[message.author.id+message.guild.id] = {
        coins: 100
      }
    }

    fs.writeFile("./data/coins.json", JSON.stringify(coinfile), err =>{
      if(err){
        console.log(err); 
      }
    })
      

    if(message.content.startsWith( prefix + "flip")){

      if(!coinfile[message.author.id+message.guild.id]){
        coinfile[message.author.id+message.guild.id] = {
          coins: 100
        }
      }

      let bounty = message.content.split(" ").slice(1, 2).join("");

      let val = message.content.split(" ").slice(2, 3).join("");


      Number(bounty) // optional

      if(isNaN(bounty)) return message.reply({contont:"Please write a number for coins.You writed**"+ bounty+"**!"});

      if(!bounty) return message.reply({contont:"you did not specify any coins!!!"});

      if(!val) return message.reply({content:"you havent specify **head** or **number**!"});

      if(coinfile[message.author.id+message.guild.id].coins < bounty) return message.reply({conton:"you don't have enough coins!"});

      coinfile[message.author.id+message.guild.id].coins -= bounty;

      let chance = Math.floor(Math.random() * 2);

      if(chance == 0){
        if(val.toLowerCase() == "head"){
            message.reply({content:"And its..... **Head**! Your stake doubles!"});

            bounty = bounty *2

            coinfile[message.author.id+message.guild.id].coins += bounty;
        
          }else{

            if(val.toLowerCase() == "number"){
              message.reply({content:"And its..... **Head**! you lost! :( "});
            }else{
              coinfile[message.author.id+message.guild.id].coins += bounty
              message.reply({contont:"You have **Head** or **Number** misspelled!"})
            }

        }
       }else{


      
          if(val.toLowerCase() == "number"){
            message.reply({conton:"And its..... **Number**! Your stake doubles!"});

            bounty = bounty *2

            coinfile[message.author.id+message.guild.id].coins += bounty;
        
           }else{


              if(val.toLowerCase() == "head"){
              message.reply({content:"And its..... **Number**! you lost :( "});
             }else{
                coinfile[message.author.id+message.guild.id].coins += bounty
                message.reply({content:"You have **Head** or **Number** misspelled!"})
            }
          
          }


        }
        

       fs.writeFile("./data/coins.json", JSON.stringify(coinfile), err =>{
        if(err){
          console.log(err);
        }

      })


    }
    
    if(message.content ===  prefix + "coins"){
      let embed = new Discord.MessageEmbed()
      .setTitle("Your coins")
      .setColor("#002fff")
      .setDescription("Coins: " + coinfile[message.author.id+message.guild.id].coins)
      .setFooter("Admin_Bot",client.user.avatarURL())

      message.channel.send({embeds:[embed]});

    }

   
    

    //rank system 

    if(message.content.startsWith(prefix + "buyrank")){
      let rank;
      let mrank = message.content.split(" ").slice(1).join(" "); 
      if(!mrank) return message.reply({content:"Du hast keinen Rang zum kaufen angegeben."}).then(msg=>msg.delete({timeout:5000}));

      for(var i=0;i<ranks.length;i++){
        if(isNaN(ranks[i])){
          if(mrank.toLowerCase() == ranks[i].toLowerCase()){
            rank = ranks[i];
            break;
          }
        }
      }

      if(!rank){
        return message.reply({conrtent:"Dieser Rank existiert nicht. Nutze !buyrank list um die lieste der Ranks zu bekommen!!!"}).then(msg=>msg.delete({timeout:5000}));
      }else{

          for(var i=0;i<ranks.length;i++){
            if(isNaN(ranks[i]) && ranks[i] !== "list"){
              if(rank == rank[i]){
                if(coinfile[message.author.id+message.guild.id].coins < ranks[i+1]){
                  message.reply({content:"Du hast zu wenig Coins dafür!!!"}).then(msg=>msg.delete({timeout:5000}));
                  return;
                }

                let name = message.member.nickname || message.author.username;

                if(name.includes(ranks[i].toUpperCase())){
                  message.reply({content:"Du hast diesen Rank bereits!!!"}).then(msg=>msg.delete({timeout:5000}));
                  return;
                }

                coinfile[message.author.id+message.guild.id].coins -= ranks[i+1];

                let coins = ranks[i+1];

                //mit rollen
                let role = message.guild.roles.cache.filter(rl=>rl.name===ranks[i])

                if(role){
                   message.member.roles.add(role).then(()=>{
                    message.channel.send({content:`Erfolgreich den Rang ${rank} gekauft!`}).then(msg=>msg.delete({timeout:5000}));
                  }).catch(err=>{
                    if(err){
                      message.channel.send({content:"Konnte den Rank nicht hinzufügen: "+err})
                      coinfile[message.author.id+message.guild.id].coins += coins;
                      return;
                    }
                  })
                }
              }

            }

          }

          if(rank == "list"){
            let list = "";

            for(var i=0;i<ranks.length;i++){
              if(isNaN(ranks[i]) && ranks[i] !== "list"){
                list+= `-${ranks[i]} - ${ranks[i+1]}\n\n`
              }
            }

            let embed = new Discord.MessageEmbed()
            .setTitle("Liste mit Rängen")
            .setColor("#002fff")
            .setDescription("Hier ist eine Liste mit allen Rängen:\n\n"+list)
            .setFooter("Admin_Bot",client.user.avatarURL())

            message.channel.send({embeds:[embed]})

            
          }

      }

      fs.writeFile("./data/coins.json", JSON.stringify(coinfile),function(err){
        if(err) console.log(err)
      })


    }


    


 //ticket system

 if(message.content.startsWith(prefix + "ticket setup")){
  let channel = message.mentions.channels.first()
  let kate;
  let modrole = message.mentions.roles;

  message.guild.channels.cache.forEach(chn=>{
      if(chn.type == "GUILD_CATEGORY" && !kate && chn.name.toLowerCase() == "tickets"){
          kate = chn;
      }
  })

  if(!channel) return message.channel.send({content:"Du musst einen kanal anegeben, wo die nachricht reingesendt werden sol."});

  if(!kate){
      await message.guild.channels.create("tickets", {
          type:"GUILD_CATEGORY",
          permissionOverwrites:[
              {id:message.guild.id, deny:["VIEW_CHANNEL"]},
              {id:client.user.id,allow:["VIEW_CHANNEL"]}
          ]
      }).then(l=>kate=l);
  }

  if(!tickets[message.guild.id]){
      tickets[message.guild.id] = {
          id:0,
          access:[]
      }
  }

  let l = [{
      id:message.guild.id, 
      deny:["VIEW_CHANNEL"]
  },
  {
      id:client.user.id,
      allow:["VIEW_CHANNEL"]
  }]

  modrole.forEach(role=>{
      l.push({id:role.id, allow:["VIEW_CHANNEL"]})
  })

  tickets[message.guild.id].id = kate.id

  tickets[message.guild.id].access = l

  fs.writeFileSync("./data/tickets.json", JSON.stringify(tickets));

  let button = new Discord.MessageButton()
  .setLabel("Erstelle ein Ticket")
  .setCustomId("create_ticket_button")
  .setStyle("SECONDARY")
  .setEmoji("📩")

  let row = new Discord.MessageActionRow()
  .addComponents(button);

  let embed = new Discord.MessageEmbed()
  .setTitle("Tickets")
  .setDescription("Drücke auf 'Ticket erstellen' um ein Ticket zu erstellen.")
  .setColor("BLUE")
  .setTimestamp()

  channel.send({embeds:[embed], components:[row]});

}

//für den command ordner
if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  if(message.content.startsWith(prefix)) {
      {const args = message.content.slice(prefix.length).trim().split(/ +/);

      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if(!command) return;

      if (command) {
      if (command.cooldown) {
        if(Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send({content:`warte kurz \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), {long: true})}\` Bis du den Command noch mal ausführen darfst!!`});
        command.run(client, message, args)
        Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
        setTimeout(() => {
          Timeout.delete(`${command.name}${message.author.id}`)
        }, command.cooldown)
      } else command.run(client, message, args);}
    }
  }
});

client.on("interactionCreate", async interaction=>{
  if(interaction.customId == "create_ticket_button"){
      interaction.deferUpdate();
      if(tickets[interaction.guild.id]){
          if(!client.channels.cache.get(tickets[interaction.guild.id].id)){
              await interaction.guild.channels.create(`ticket-${message.guild.id}`, {
                  type:"GUILD_CATEGORY",
                  permissionOverwrites:[
                      {id:interaction.guild.id, deny:["VIEW_CHANNEL"]},
                      {id:client.user.id,allow:["VIEW_CHANNEL"]}
                  ]
              }).then(l=>tickets[interaction.guild.id].id = l.id)
          }

          tickets[interaction.guild.id].access.push({id:interaction.user.id, allow:["VIEW_CHANNEL"]})

          interaction.guild.channels.create(`ticket-${interaction.user.username}`, {
              type:"GUILD_TEXT",
              parent:client.channels.cache.get(tickets[interaction.guild.id].id),
              permissionOverwrites:tickets[interaction.guild.id].access
          }).then(chn=>{
              let embed = new Discord.MessageEmbed()
              .setTitle("Tickets")
              .setDescription("Press :x: to close the ticket.")
              .setColor("BLUE")
              .setTimestamp();

              let row = new Discord.MessageActionRow()
              .addComponents(
                  new Discord.MessageButton()
                  .setLabel("Close")
                  .setCustomId("close_ticket_button")
                  .setStyle("DANGER")
                  .setEmoji("❌")
              )

              chn.send({content:"@here", embeds:[embed], components:[row]})
          })
          tickets[interaction.guild.id].access.splice(tickets[interaction.guild.id].access.length - 1, 1);
      }
  }

  if(interaction.customId == "close_ticket_button"){
      interaction.channel.delete()
  }
})


//Reactions Roles 
client.on("messageCreate", async (msg) => {
  if(msg.author.bot || !msg.guild) return;
  if(msg.content.startsWith('?creatReactionRole')){
    var args = msg.content.split(' ')
    if(args.length == 3){
      var emoji = args[1];
      var roleid = args[2];
      var role = msg.guild.roles.cache.get(roleid);
      if(!role){
        msg.reply({content:'Die Rolle gibt es nicht'})
        return;
      }
      var embed = new Discord.MessageEmbed()
      .setDescription(`click ${emoji} for the role => <@&${roleid}>`)
      .setColor("#002fff");

      var sendedMassage = await msg.channel.send({embeds:[embed]});
      sendedMassage.react(emoji)

      var toSave = {message: sendedMassage.id, emoji: emoji, role: roleid}
      reactionRolesConfig.reactions.push(toSave);

      fs.writeFileSync('reactionroles.json', JSON.stringify(reactionRolesConfig))
    }else {
      msg.reply({contont:'!creatReactionRole <emoji> <roleid>'})
    }
  }
});







client.login(process.env.token);