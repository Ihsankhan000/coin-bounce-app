const JWTService = require('../services/JWTService');
const User = require('../models/user');
const UserDTO = require('../dto/user')

const auth = async (req, res, next) => {
    
    // refresh, access tokens validation.
    try {
        const {refreshToken, accessToken} = req.cookies;

        if(!refreshToken || !accessToken){
            const error = {
                status: 401,
                message: 'Unuthorized'
            }
            return next(error)
        }
    
        let _id;
        try {
            // destructure id from payload.
            _id = JWTService.verifyAccessToken(accessToken)._id
        } catch (error) {
            return next(error)
        }
    
        let user;
        try {
            user = await User.findOne({_id: _id})
        } catch (error) {
            return next(error)
        }
    
       
        const userDto = new UserDTO(user);
        req.user = userDto ; // user will be added to the req of authcontroller logout method.
        next();
    } catch (error) {
        return next(error)
    }
   

}


module.exports = auth;