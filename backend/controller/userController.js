import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddleware.js"
import {User} from "../models/userSchema.js"
import {generateToken} from "../utils/jwtToken.js"


export const patientRegister=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic,role}=req.body;

    if(!firstName|| !lastName|| !email|| !phone|| !password|| !gender|| !dob|| !nic|| !role)
    {
        return next(new ErrorHandler("Please Fill Full Form",400))
    }

    let user =await User.findOne({email})

    if(user)
    {
        return next(new ErrorHandler("User Already registered!",400))
    }

    user= await User.create({firstName,lastName,email,phone,password,gender,dob,nic,role})

    generateToken(user,"user Registered!",200,res)
})

export const login=catchAsyncErrors(async(req,res,next)=>{
    const{email,password,confirmPassword,role}=req.body;

    if(!email || !password ||!confirmPassword || !role)
    {
        return next(new ErrorHandler("Please Provide all details",400))
    }

    if(password!==confirmPassword)
    {
        return next(new ErrorHandler("Password and confirm Password do not match",400))
    }

    const user=await User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("Invalid email or password!",400))
    }
   
    const isPasswordMatched =await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password!",400))
    }
    if(role !== user.role){
        return next(new ErrorHandler("User with this role not found!",400))
    }
    generateToken(user,"user loggedin Successfully!",200,res)
})


export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,phone,password,gender,dob,nic}=req.body;

    if(!firstName|| !lastName|| !email|| !phone|| !password|| !gender|| !dob|| !nic)
        {
            return next(new ErrorHandler("Please Fill Full Form",400))
        }
    
     
     let isRegistered =await User.findOne({email})

     if(isRegistered)
     {
      return next(new ErrorHandler(`${isRegistered.role} with this email already exists!`))
     }

     const admin=await User.create({firstName,lastName,email,phone,password,gender,dob,nic,role:"Admin"})

     res.status(200).json({
        success:true,
        message:"New Admin Registered!"
     })
})

