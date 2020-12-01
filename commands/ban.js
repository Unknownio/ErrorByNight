module.exports = {
    name: 'ban',
    description: "This command bans a member!",
    execute(message, args){
        const member = message.mentions.user.first();
        if(member){
               const memberTarget = message.guild.members.cache.get(member.id);
               memberTarget.kick();
               message.channel.send('User has been banned');
        }else{
                message.channel.send('You couldt ban that member');
            }
        }
    }