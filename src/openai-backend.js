const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { route } = require('@forge/api');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = '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';

app.post('/generate-text', async (req, res) => {
const { summary, description } = req.body;

try {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
        prompt: `I want you to act as a sharp and structured product Owner. Please write a comprehensive User Story based on " ${summary} ${description} " with acceptance criteria, notes, limitations and suggestions for subtasks.`,
        max_tokens: 2048,
        api_key: OPENAI_API_KEY,
    });

    const generatedText = response.data.choices[0].text;

    // Do any necessary post-processing of the output here
    // ...

    res.send({ generatedText });
} catch (error) {
    console.error(error);
    res.send({ error: 'Error generating text' });
}
});

app.listen(3000, () => {
console.log('Server listening on port 3000');
});

module.exports = { route: route({app}) };