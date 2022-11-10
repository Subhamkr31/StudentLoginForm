

const mongoose = require('mongoose')
// const ObjectId = mongoose.Schema.Types.ObjectId

const StudentSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
            trim : true
        },

        subject: {
            type: String,
            required: true,
            trim : true
        },

        marks: {
            type: Number,
            required: true,
            trim : true
        },
        email : {
            type: String,
            required : true,
            trim : true
        },
        password:{
            type: String,
            required : true,
            trim : true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

    },{versionKey: false , timestamps: true}
)


module.exports = mongoose.model("student", StudentSchema)