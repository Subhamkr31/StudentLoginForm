
const studentModel = require('../model/studentModel')
const emailValidation = require('email-validator')
const jwt = require('jsonwebtoken')



const login = async (req,res) => {

    let data = req.body

    let {email , password} = data

    if(!email || email.length == 0) return res.status(400).send({
        status: false, message: 'Please enter email.'
    })

    if(!emailValidation.validate(email)) return res.status(400).send({
        status: false, message: 'Please enter valid email.'
    })
git 
    let findEmail = await studentModel.findOne({email})

    // console.log(findEmail);
    if(!findEmail)return res.status(404).send({
        status: false, message: 'email not found!'
    })

    if(findEmail.password != password)return res.status(400).send({
        status: false, message: 'Invalid Password !'
    })

    if(!password || password.length == 0) return res.status(400).send({
        status: false, message: 'Password cannot empty .'
    })

    let token = jwt.sign({_id: findEmail._id},"securecode", { expiresIn: "1hr" } )

    
    res.status(200).send({status :true , message :"Login Successful", token : token})

}

module.exports = {login}



