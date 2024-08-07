const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Tocar música / playlist')
        .addStringOption(option =>
            option.setName('musica')
                .setDescription('Link / Nome da música')
                .setRequired(true)
        ),
    /** 
    @param {CommandInteraction} interaction
    @param {DisTube} distube
    */
    async execute(interaction, distube) {
        const { options, member, guild, channel } = interaction;
        const canalVoz = member.voice.channel;

        if (!canalVoz) {
            return interaction.reply({ content: 'Você não está em um canal de voz', ephemeral: true });
        }

        if (guild.members.me.voice.channelId && (canalVoz.id !== guild.members.me.voice.channelId)) {
            return interaction.reply({ content: 'Já estou sendo usado em outro canal', ephemeral: true });
        }

        try {
            await interaction.reply({ content: 'Pesquisando...', ephemeral: true });
            const query = options.getString('musica');  // Use getString para obter a opção

            // Play the song, ensuring proper handling
            const song = await distube.play(canalVoz, query, {
                member: member,
                textChannel: channel,
                // You may need to add options here depending on the documentation
            });

            return interaction.editReply({ content: `Música(s) adicionada(s): ${song.name}`, ephemeral: true });
        } catch (e) {
            console.error(e);
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Erro ao executar comando');

            return interaction.editReply({ content: '', embeds: [errorEmbed], ephemeral: true });
        }
    }
};
