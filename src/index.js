

const express = require('express')
const bodyParser = require('body-parser')
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true }))


mongoose.connect("mongodb+srv://Maheshpppp:GfIbvAzpfnLY6IEj@cluster0.lhhqee7.mongodb.net/test",{
    useNewUrlParser: true
})
.then(()=> console.log('mongoDb is connected'))
.catch((error) => console.log(error))

app.use('/',route)

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000));
  });
  