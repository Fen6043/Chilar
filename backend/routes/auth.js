const app = require('express')
const bcrypt = require('bcrypt')
/** @type {import('mongoose').Model<any>} */
const User = require('../mongoDB/user')
const JWT = require('../utils/jwt')

const router = app.Router()

router.post('/signup',async(req,res) => {
    try {
        const {username,email,password} = req.body
        const result1 = await User.findOne({username:username})
        const result2 = await User.findOne({email:email})

        if(result1 && result2){
            return res.status(200).json({type:'both'})
        }
        else if(result1){
            return res.status(200).json({type:'username'})
        }
        else if(result2){
            return res.status(200).json({type:'email'})
        }

        const hashPassword = await bcrypt.hash(password,10);

        const newUser = new User({username:username, email:email, password:hashPassword})
        await newUser.save();

        res.status(201).json({message:'new user successfully created'})
    } catch (error) {
        res.status(500).json({message:`error while adding new user:${error}`})      
    }
})

router.post('/login',async(req,res) =>{
    const {username,password} = req.body
    
    try {
        const userDetails = await User.findOne({username:username})
        if(!userDetails || !await bcrypt.compare(password,userDetails.password)){
            return res.status(401).json({message:"Invalid Credentials"})
        }

        const token = JWT.generateToken(userDetails._id.toString())

        res.cookie('chillarToken',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000, // 1 day
            sameSite: process.env.NODE_ENV === 'production'?'None':'lax'
        })

        res.status(200).json({message:"Logged in successfully"})

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.get('/logout',(req,res)=>{
    try {
        res.clearCookie('chillarToken',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'None':'lax'
        })

        res.status(200).json({message:"Logged out"})
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/me',async(req,res) => {
    const token = req.cookies?.chillarToken;
    //console.log(req.cookies)
    if(!token)
        return res.status(401).json({message:"no token found"})
    else{
        const user = JWT.verifyToken(token)
        const userExists = await User.exists({
            _id:{
                $eq: user.id
            }
        })
        if(userExists)
            res.status(200).json({message:"Access granted"})
        else
            res.status(401).json({message:"Unauthorised"})
    }
})


module.exports = router
