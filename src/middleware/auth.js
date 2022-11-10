
const jwt = require('jsonwebtoken')


const authenticate = async (req, res, next) => {
    try {
        const token = req.headers['x-api-key']

        if (!token) return res.status(401).send({ status: false, message: 'Token must be present ' })

        jwt.verify(token, "securecode", function (err, data) {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })
            }
            else {
                req.studentDetail = data;
                // console.log(req.userDetail)
                next()
            }

        });

    } catch (error) {

        return res.status(500).send({ status: false, message: error.message })
    }

}




module.exports = { authenticate }