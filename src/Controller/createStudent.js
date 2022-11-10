

const studentModel = require('../model/studentModel')
const emailValidation = require('email-validator')

const mongoose = require('mongoose')

const nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/



///////////////////////////      CreateAPi      //////////////////////////

const CreateStudent = async function (req, res) {

    try {
        const data = req.body
        let { name, subject, marks, email, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({
            status: false, message: 'Please enter details for user registration.'
        })

        if (!name || name.length == 0) return res.status(400).send({
            status: false, message: 'Please enter name.'
        })

        if (!nameRegex.test(name)) return res.status(400).send({
            status: false, message: 'Please enter valid name.'
        })

        data.name = name.trim().split(" ").filter((word) => word).join(" ");

        if (!subject || subject.length == 0) return res.status(400).send({
            status: false, message: 'Please enter Subject.'
        })
        if (!nameRegex.test(subject)) return res.status(400).send({
            status: false, message: 'Please enter valid subject.'
        })

        data.subject = subject.trim().split(" ").filter((word) => word).join(" ");
        if (!marks) return res.status(400).send({
            status: false, message: 'Please enter marks.'
        })

        if (!(marks > 0 && marks < 100)) return res.status(400).send({
            status: false, message: 'Please enter invalid marks.'
        })

        if (!email || email.length == 0) return res.status(400).send({
            status: false, message: 'Please enter email.'
        })
        if (!emailValidation.validate(email)) return res.status(400).send({
            status: false, message: 'Please enter valid email.'
        })

        let findEmail = await studentModel.findOne({ email })

        if (findEmail) return res.status(409).send({
            status: false, message: 'email is already exist'
        })

        if (!password || password.length == 0) return res.status(400).send({
            status: false, message: 'Password cannot empty .'
        })

        const registerdata = await studentModel.create(data)

        let save = { id: registerdata._id, name: registerdata.name, subject: registerdata.subject, marks: registerdata.marks, createdAt: registerdata.createdAt, updatedAt: registerdata.updatedAt }

        return res.status(201).send({ status: true, message: 'Success', data: save })

    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }


}

///////////////////////////      Get Api      //////////////////////////
const getStudentDetail = async (req, res) => {
    try {

        let filter = req.query

        let { name, subject } = filter

        if (name == 0) return res.status(400).send({ status: false, message: "enter valid name" })

        if (subject == 0) return res.status(400).send({ status: false, message: "enter valid subject" })

        let studentdata = await studentModel.find({ $or: [{ name ,isDeleted: false}, { subject, isDeleted: false }, ] })

        if (studentdata.length === 0) return res.status(404).send({
            status: false, message: 'Student data not found.'
        })

        return res.status(200).send({ status: true, message: 'Success', data: studentdata })
    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }


}

///////////////////////////      updateApi      //////////////////////////
const updateStudent = async (req, res) => {
    try {
        let data = req.body
        const StudentId = req.params.studentId;

        let { name, subject, marks } = data

        let student = await studentModel.findById(StudentId)

        //check if isDeleated Status is True
        if (!student || student.isDeleted === true) return res.status(404).send({ status: false, message: "student is not found" })

        //// /------------------------------authorisation-----------------------------------

        if (StudentId != req.studentDetail._id)
            return res.status(403).send({ status: false, message: "you are not Authorised" })
        ///// /-------------------------------------------------------------------------------


        if (!name || name.length == 0) return res.status(400).send({
            status: false, message: 'Please enter name.'
        })

        if (!nameRegex.test(name)) return res.status(400).send({
            status: false, message: 'Please enter valid name.'
        })

        data.name = name.trim().split(" ").filter((word) => word).join(" ");
        if (!subject || subject.length == 0) return res.status(400).send({
            status: false, message: 'Please enter Subject.'
        })
        if (!nameRegex.test(subject)) return res.status(400).send({
            status: false, message: 'Please enter valid subject.'
        })

        data.subject = subject.trim().split(" ").filter((word) => word).join(" ");

        if (!marks) return res.status(400).send({
            status: false, message: 'Please enter marks.'
        })

        if (!(marks > 0 && marks < 100)) return res.status(400).send({
            status: false, message: 'Please enter invalid marks.'
        })

        let update = await studentModel.findOneAndUpdate({ $and: [{ name: data.name }, { subject: data.subject }] }, { $inc: { marks: marks }, }, { new: true })

        if (!update) return res.status(404).send({
            status: false, message: 'Data not Found'
        })

        return res.status(200).send({ status: true, message: 'Success', data: `Total marks :  ${update.marks}` })


    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }


}


///////////////////////////      DeleteApi      //////////////////////////


const deleteStudent = async (req, res) => {


    try {
        const StudentId = req.params.studentId;

        if (!mongoose.isValidObjectId(StudentId)) return res.status(400).send({ status: false, msg: 'Please enter valid StudentId' })

        let student = await studentModel.findById(StudentId)

        //check if isDeleated Status is True
        if (!student || student.isDeleted === true) return res.status(404).send({ status: false, message: "student is not found" })

        //// /------------------------------authorisation-----------------------------------

        if (StudentId != req.studentDetail._id)
            return res.status(403).send({ status: false, message: "you are not Authorised" })
        ///// /-------------------------------------------------------------------------------


        await studentModel.findOneAndUpdate({ _id: StudentId }, { isDeleted: true, deletedAt: new Date() }, { new: true });
        return res.status(200).send({ status: true, message: "successfuly Deleted", });

    } catch (error) { return res.status(500).send({ status: false, message: error.message }) }


}



module.exports = { CreateStudent, getStudentDetail, updateStudent, deleteStudent }