const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adhan')
        .setDescription('Shows Adhan in a Specified Location')
        .addStringOption(option =>
            option.setName('city')
            .setDescription('City input')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('country')
            .setDescription('Country input')
            .setRequired(true)
        ),
    async execute(interaction) {
        try {
            // Log the interaction data
            console.log('Received interaction:', interaction);

            // Defer the reply before processing
            await interaction.deferReply();

            const inputCity = interaction.options.getString('city');
            const inputCountry = interaction.options.getString('country');

            // Log inputs
            console.log(`Received command with city: ${inputCity} and country: ${inputCountry}`);

            const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity/12-01-2024?city=${inputCity}&country=${inputCountry}&method=8`);
            const data = response.data;

            // Log API response data
            console.log('API Response Data:', data);

            // Print only data.timings
            console.log('Prayer Times:', data.timings);

            await interaction.editReply('Prayer times data logged. Check console.');

            // Log success message
            console.log('Command executed successfully.');
        } catch (err) {
            console.error('Error occurred while executing the command:', err);

            // Check if the error is due to invalid city or country
            if (err.response && err.response.status === 404) {
                console.error('Invalid city or country. Please check your input.');
                await interaction.followUp({ content: 'Invalid city or country. Please check your input.', ephemeral: true });
            } else {
                console.error('An error occurred while fetching prayer times.');
                await interaction.followUp({ content: 'An error occurred while fetching prayer times.', ephemeral: true });
            }
        }
    },
};
