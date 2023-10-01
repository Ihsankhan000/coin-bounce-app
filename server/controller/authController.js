const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const JWTService = require('../services/JWTService');
const UserDTO = require('../dto/user');
const RefreshToken = require('../models/token');

const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/ ;

const authController = {

    // For Register new user.
    async register (req, res, next) {
        // 1. validate user input.
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattren).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegisterSchema.validate(req.body);

        // 2. if error in validation -> return error vai middleware.
         if(error){
            return next(error)
         }

        // 3. if email or username is already register -> return an error.
            const {username, name, email, password} = req.body;
            try {
                const emailInUse = await User.exists({email});
                const usernameInUse = await User.exists({username})
                
                if(emailInUse){
                    const error = {
                        status : 409 ,
                        message: 'Email already registerd, use another email!'
                    }
                    return next(error)
                }

                if(usernameInUse){
                    const error = {
                        status : 409 ,
                        message: 'username not available, choose another username!'
                    }
                    return next(error)
                }

            } catch (error) {
                return next(error)
            }


        // 4. password hash.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. store user data in db.
          let accessToken ;
          let refreshToken ;
          
          let user;
          try {
            const userToRegister = new User({
                username: username,
                name: name,
                email: email,
                password: hashedPassword
              });
    
            user = await userToRegister.save();

             // token generation
             accessToken = JWTService.signAccessToken({_id:user._id}, '30m');

             refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

          } catch (error) {
             return next(error);
          }
            
           // store refreshToken in db
           await JWTService.storeRefreshToken(refreshToken, user._id);

          // send token in cookies;
          res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24, //cookies expiry time
            httpOnly: true  // for security,decrease xss attacks. client side browser can't access token only access in backend
          });
           
          res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
          });

        // 6 respose send.

        const userDto = new UserDTO(user);
        res.status(201).json({user: userDto, auth: true})
    },




    


    







    // For Login user.

    async login (req, res, next) {
        // 1. validate user input.
        // we expect input data to be in such shape
        const userLoginSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattren)
        });

        const {error} = userLoginSchema.validate(req.body);
         
         // 2. if validation error return error.
        if(error){
            return next(error)
        }
        
         // 3. match username and password.
         const {username, password} = req.body;

         let user ;
         try {
            // match username
         user = await User.findOne({username: username});
             
          if(!user){
            const error = {
              status: 401,
              message: "invalid username"
            }
            return next(error)
          }
         
         // match password
         const match = await bcrypt.compare(password, user.password);
         if(!match){
            const error = {
              status: 401,
              message: "invalid password"
            }
            return next(error)
          }

         } catch (error) {
            return next(error)
         }

         const accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
         const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

         // update refresh token in database
         try {
           await RefreshToken.updateOne({
                _id: user._id
            },
            {token: refreshToken},
            {upsert: true}
            );
         } catch (error) {
            return next(error)
         }


         res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
         });

         res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly:true
         })
       
          // 4. return response.
          const userDto = new UserDTO(user);

         res.status(200).json({user: userDto, auth:true})

    },



    async logout(req, res, next) {
      console.log(req);

      // 1. delete refresh token from database.
      const {refreshToken} = req.cookies;

      try {
            await RefreshToken.deleteOne({token: refreshToken})
      } catch (error) {
        return next(error)
      }

      // delete cookies
     res.clearCookie('accessToken');
     res.clearCookie('refreshToken');

      // response
      res.status(200).json({user: null, auth: false})

    },












    

    async refresh(req, res, next) {
      // 1. get refresh token from cookies.
      // 2. verify refresh token.
      // 3. generate new token.
      // 4. update db, return response.

      const originalRefreshToken = req.cookies.refreshToken;
       
      let id;
      try {
          id = JWTService.verifyRefreshToken(originalRefreshToken)._id
      } catch (e) {
         const error = {
          status: 401,
          message: "Unauthorized"
         }
         return next(error)
      }

      try {
        const match =  RefreshToken.findOne({_id: id, token: originalRefreshToken});

        if(!match){
          const error = {
            status: 401,
            message: "Unauthorized"
          }
          return next(error)
        }
      } catch (e) {
        return next(e)
      }

      try {
           const accessToken = JWTService.signAccessToken({_id: id}, '30m');
           const refreshToken = JWTService.signRefreshToken({_id: id}, '60m');

           await RefreshToken.updateOne({_id:id},{token: refreshToken});

           res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 *24,
            httpOnly: true
           })
           res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 *24,
            httpOnly: true
           });

      } catch (error) {
        return next(error)
      }

        const user = await User.findOne({_id: id});
        const userDto = new UserDTO(user);

        res.status(200).json({user: userDto, auth: true})

    }



}


module.exports = authController;