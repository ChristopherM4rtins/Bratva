const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('../../database/controlador')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addplaylist')
        .setDescription('Salva uma playlist')
        .addStringOption(option => {
            return option.setName('nome')
                .setDescription('Nome da playlist')
                .setRequired(true)
        })
        .addStringOption(option => {
            return option.setName('link')
                .setDescription('Link da playlist')
                .setRequired(true)
        })
    ,

    /** 
    @param {CommandInteraction} interaction
    */

    async execute(interaction) {
        const { options } = interaction
        const nome = options.get('nome').value
        const link = options.get('link').value  

        try {
            var resultado = await db.addPlaylist(interaction.guildId, nome, link)

            return interaction.reply({ content: `${resultado}`, ephemeral: true })
        }
        catch (e) {
            console.log(e)
            return interaction.reply({ content: `Erro ao adicionar playlist`, ephemeral: true })
        }
    }    
}