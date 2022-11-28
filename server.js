const { ok } = require('assert')
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 's13025820MuhammadFurqanProject'

mongoose.connect('mongodb+srv://123:123@cluster0.pc0m5sy.mongodb.net/?retryWrites=true&w=majority',{
})
const app  = express()
app.use ('/', express.static(path.join(__dirname, 'static')))

app.use(express.json())



//login
app.post('/api/login', async(req,res) =>{

    const {username, password}= req.body
    const user = await User.findOne({username}).lean()
    //checking if the record exists
    if(!user){
        return res.json({status: 'error', error:'invalid credentials'})
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({id: user.id, username: user.username},
            JWT_SECRET)
        return res.json({status: 'ok', data:'token'})
    }
    res.json({
        status: 'error', error: 'invalid credentials'
    })
})



//register
app.post('/api/register', async (req, res) =>{
    console.log(req.body)

    const {username, password: plainTextPassword}= req.body

    //empty username and or string
    if(!username || typeof username !== 'string'){
        return res.json({ststus: 'error',error:'invalid entry'})
    }
    //same check for password && pasword lenght check
    if(!plainTextPassword || typeof plainTextPassword !== 'string'){
        return res.json({ststus: 'error',error:'invalid entry'})
    }
    if(plainTextPassword.lenght < 5){ return res.json({status:'error', error:'password must contain at least 5 chars'})
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try{
        const response =await User.create({
            username, password
        })
        console.log('user created',response);
    }catch (error){
        //code for duplicate kay which is a result of "unique:true"
        if(error.code === 11000){
        return res.json({status:'error', error: 'username already exists'})
        }throw error
    }

    res.json({status:'ok'})
})



//List Port
app.listen(3500, ()=>{
    console.log('server up at 3000')
})

//Instead of "app.use(bodyParser.json());" as of the new express versions
//Use "app.use(express.json());"