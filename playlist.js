const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js')
const db = require('../../database/controlador')
const { DisTube } = require('distube')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlist')
        .setDescription('Toca playlist salva')
        .addStringOption(option => {
            return option.setName('nome')
                .setDescription('Nome da playlist')
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
        const nome = options.get('nome').value

        try {
            var resultado = await db.getPlaylist(interaction.guildId, nome)

            if (resultado.url) {
                if (!canalVoz)
                    return interaction.reply({ content: 'Você não está em um canal de voz', ephemeral: true })

                if (guild.members.me.voice.channelId && (canalVoz.id !== guild.members.me.voice.channelId))
                    return interaction.reply({ content: 'Já estou sendo usado em outro canal', ephemeral: true })

                try {
                    await interaction.reply({ content: 'Pesquisando', ephemeral: true });
                    await distube.play(canalVoz, resultado.url, { member: member, textChannel: channel })

                    return interaction.editReply({ content: 'Música(s) adiconada(s)', ephemeral: true })
                } catch (e) {
                    console.log(e)
                    const errorEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription('Erro ao executar comando')

                    return interaction.editReply({ content: '', embeds: [errorEmbed], ephemeral: true })
                }
            } else {
                return interaction.reply({ content: `${resultado}`, ephemeral: true })
            }
        }
        catch (e) {
            console.log(e)
            return interaction.reply({ content: `Erro ao recuperar playlist`, ephemeral: true })
        }
    }


}