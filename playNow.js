const { SlashCommandBuilder } = require('@discordjs/builders')
const { CommandInteraction, EmbedBuilder } = require('discord.js')
const { DisTube, DisTubeError } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playnow')
        .setDescription('Tocar música / playlist agora')
        .addStringOption(option => {
            return option.setName('musica')
                .setDescription('Link / Nome da música')
                .setRequired(true)
        })
    ,
    /** 
    @param {CommandInteraction} interaction
    @param {DisTube} distube
    */
    async execute(interaction, distube) {
        const { options, member, guild, channel } = interaction
        const canalVoz = member.voice.channel

        if (!canalVoz)
            return interaction.reply({ content: 'Você não está em um canal de voz', ephemeral: true })

        if (guild.members.me.voice.channelId && canalVoz.id !== guild.members.me.voice.channelId)
            return interaction.reply({ content: 'Já estou sendo usado em outro canal', ephemeral: true })

        try {
            await interaction.reply({ content: 'Pesquisando', ephemeral: true });
            const query = options.get('musica').value
            await distube.play(canalVoz, query, {member: member, textChannel: channel, skip: true})

            return interaction.editReply({ content: 'Música(s) adiconada(s)', ephemeral: true })
        } catch (e) {
            console.log(e)
            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Erro ao executar comando')

            return interaction.editReply({ content:'', embeds: [errorEmbed], ephemeral: true })
        }
    }
}