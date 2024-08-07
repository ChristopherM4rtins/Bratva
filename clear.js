const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Limpe o canal de texto')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setDMPermission(false)
        .addNumberOption(options => options
            .setName('quantidade')
            .setDescription('coloque a quantidade de mensagens que você quer deletar')
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true)
        ),

    async execute(interaction) {
        const Amount = interaction.options.getNumber('quantidade');

        const respondeEmbed = new EmbedBuilder().setColor('DarkNavy');
        const logEmbed = new EmbedBuilder().setColor('Aqua')
            .setAuthor({ name: 'Usado o comando Clear' });

        let logEmbedDescription = [
            `Moderador: ${interaction.member}`,
            `Canal: ${interaction.channel}`
        ];

        if (Amount > 0) {
            interaction.channel.bulkDelete(Amount, true).then((messages) => {
                interaction.reply({
                    embeds: [respondeEmbed.setDescription(`limpo \`${messages.size}\` mensagens.`)],
                    ephemeral: true
                });
            });
        } else {
            interaction.reply('Quantidade inválida. Por favor, insira um número entre 1 e 100.');
        }
    }
}
