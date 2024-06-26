const express = require('express');
const cors = require('cors')
require('dotenv').config()
const {GoogleGenerativeAI} = require('@google/generative-ai');

const PORT = 8000


const app = express();

app.use(cors());

app.use(express.json()) 


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY)

app.post('/gemini', async (req, res) => {

    
    const model = genAI.getGenerativeModel({model : 'gemini-pro'})
    
    const chat = model.startChat({
        history : req.body.history
       
    });

    const message = req.body.message;


    const result = await chat.sendMessage(message)
    const response =  await result.response;
    const txt = response.text();
    res.send(txt);

    
})

app.listen(PORT , () => console.log(`Listening on port number ${PORT}`));