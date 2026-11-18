const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, ChannelType } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`Bot is online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'open_ticket') {
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: ['ViewChannel'] },
        { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
      ]
    });

    await channel.send(`أهلًا ${interaction.user}، فريق الدعم سيساعدك قريبًا.`);
    await interaction.reply({
      content: `تم فتح تذكرتك: ${channel}`,
      ephemeral: true
    });
  }

  if (interaction.customId === 'close_ticket') {
    await interaction.channel.delete();
  }
});

client.on('messageCreate', async message => {
  if (!message.guild || !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

  if (message.content === '!setup') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('open_ticket')
        .setLabel('فتح تذكرة 🎫')
        .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({
      content: 'مرحبًا بك في نظام التذاكر الخاص بنا!',
      components: [row]
    });
  }
});

client.login(process.env.TOKEN);
