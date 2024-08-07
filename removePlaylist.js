const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database/controlador')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeplaylist')
        .setDescription('Salva uma playlist')
        .addStringOption(option => {
            return option.setName('nome')
                .setDescription('Nome da playlist')
                .setRequired(true)
        })
    ,

    /** 
    @param {CommandInteraction} interaction
    */

    async execute(interaction) {
        const { options } = interaction
        const nome = options.get('nome').value

        try {
            var resultado = await db.removePlaylist(interaction.guildId, nome)

            return interaction.reply({ content: `${resultado}`, ephemeral: true })
        }
        catch (e) {
            console.log(e)
            return interaction.reply({ content: `Erro ao remover playlist`, ephemeral: true })
        }
    }    
}