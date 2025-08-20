const jwt = require('jsonwebtoken')
const { message } = require('prompt')

const verifyToken = (req,res,next) => {
    let token
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({message: "No token , authorization denied"})
        }
        
        try {            
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decoded
            //console.log("Decoded user is :",decoded);
            next()
        } catch (error) {
            res.status(400).json({message: "Token is not Valid"})
        }
    }
    else{
        return res.status(401).json({message: "No token , authorization denied"})
    }
}

module.exports = verifyToken