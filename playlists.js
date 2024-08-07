const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, EmbedBuilder } = require('discord.js')
const db = require('../../database/controlador')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playlists')
        .setDescription('Lista todas as playlists do servidor')
    ,

    /** 
    @param {CommandInteraction} interaction
    */
   
    async execute(interaction) {
        try {
            var resultado = await db.getPlaylists(interaction.guildId)

            if (resultado.length > 0) {
                const embedMsg = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("Playlists")
                    .setDescription("Lista de playlists do servidor")


                resultado.forEach(function(x, index) {
                    embedMsg.addFields({ name: `${index + 1}#: ${x.name}`, value: `${x.url}`})
                })

                return interaction.reply({embeds: [embedMsg]})
            } else {
                return interaction.reply({ content: "Nenhuma playlist encontrada", ephemeral: true })
            }     
        }
        catch (e) {
            console.log(e)
            return await interaction.reply({ content: `Erro ao recuperar playlists`, ephemeral: true })
        }
    }
}