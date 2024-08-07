const { SlashCommandBuilder } = require('@discordjs/builders')
const { CommandInteraction, EmbedBuilder } = require('discord.js')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Finaliza playlist')
    ,
    /** 
    @param {CommandInteraction} interaction
    @param {DisTube} distube
    */
    async execute(interaction, distube) {
        const { options, member, guild, channel } = interaction
        const fila = distube.getQueue(guild.id)
        const canalVoz = member.voice.channel

        if (!fila)
            return interaction.reply({ content: 'Fila está vazia', ephemeral: true })

        if (guild.members.me.voice.channelId !== canalVoz.id)
            return interaction.reply({ content: 'Você não está no mesmo canal que o bot', ephemeral: true })

        try {
            await fila.stop()

            return interaction.reply({ content: 'Playlist finalizada', ephemeral: true })
        } catch (e) {
            console.log(e)

            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('Erro ao executar comando')

            return interaction.reply({ embeds: [errorEmbed], ephemeral: true })
        }

    }
}