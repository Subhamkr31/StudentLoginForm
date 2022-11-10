

const express = require('express')
const router = express.Router()


const LoginController = require('../Controller/login')
const Controller = require('../Controller/createStudent')

const {authenticate} = require('../middleware/auth')

//  router -------------------
router.post('/createuser', Controller.CreateStudent)
router.post('/login', LoginController.login)
router.get('/getstudent', Controller.getStudentDetail)
router.put('/update/:studentId',authenticate, Controller.updateStudent)
router.delete('/deletestudent/:studentId',authenticate, Controller.deleteStudent)

module.exports = router

