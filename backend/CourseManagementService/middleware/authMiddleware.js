import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Lowest level of authorization - Anyone who has logged in can access
const authLvl1 = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    let roles = ["ROLE_LEARNER","ROLE_INSTRUCTOR","ROLE_ADMIN"]
    try {
        let email = validateToken(token, roles);
        req.email = email

        next();
    } catch (error) {
        res.status(401).json({message: error.message});
        return
    }   
});

// Middle level of authorization - Only Faculty and Admin can access
const authLvl2 = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    let roles = ["ROLE_INSTRUCTOR","ROLE_ADMIN"]
    try {
        let email = validateToken(token, roles);
        req.email = email

        next();
    } catch (error) {
        res.status(401).json({message: error.message});
        return
    }  
});

// Highest level of authorization - Only Admin can access
const authLvl3 = asyncHandler(async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    let roles = ["ROLE_ADMIN"]
    try {
        let email = validateToken(token, roles);
        req.email = email

        next();
    } catch (error) {
        res.status(401).json({message: error.message});
        return
    } 
});


const validateToken = (token, roles) => {

    if(token){
        try {
            console.log(token);
            const decoded = jwt.verify(token, Buffer.from(process.env.JWT_SECRET, 'base64'));

            let userRoles = decoded.role?.split(',');
            if(!userRoles.some(r => roles.includes(r))){
                throw new Error('Not Authorized, insufficient access level');
            }

            return decoded.sub;

        } catch (error) {
            console.log(error);
            throw new Error(error.message + ". Please login again");
        }
    }else{
        throw new Error('Not Authorized, no token');
    }
}

export { authLvl1, authLvl2, authLvl3 };

