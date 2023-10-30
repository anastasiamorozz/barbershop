const express = require("express")
const app = express()
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://pollodrax:nastia@cluster0.htpcyzl.mongodb.net/?retryWrites=true&w=majority")

app.get('/', (req, res) => {
    res.send("Server is runing");
})

app.listen(3000, ()=>{
    console.log('server running on port 3000')});