import * as yup from 'yup';
const passwordPattren = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/ ;

const erroMessage = 'use lowercase, uppercase and digits';

const loginSchema = yup.object().shape({
    username: yup.string().min(5).max(30).required('username is required'),
    password: yup.string().min(8).max(25).matches(passwordPattren,{message: erroMessage}).required('password is required'),
})

export default loginSchema ;