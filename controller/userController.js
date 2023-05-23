const singupValidation = require("../validation/usersingup");
const logingValidation = require('../validation/userLoging');
const userModel = require('../model/userModel');
const { findOne } = require("../model/userModel");
const { isValidObjectId } = require("mongoose");
const hash = require('../modules/utils');
const yup = require('yup');

const singup = async (req, res, next) => {
    try {
        const { phoneNumber, name, familly, email, adress, password, confirmPassword } = req.body
        console.log(await singupValidation.validate({ phoneNumber, name, familly, email, adress, password, confirmPassword }, { abortEarly: false }));
        if (password != confirmPassword) throw { message: "پسورد شما یکسان نیست" }

        const user = await userModel.findOne({ name })

        if (user) throw { message: "نام کابری تکراری است" }


        const userEmail = await userModel.findOne({ email })

        if (userEmail) throw { message: "ایمیل شما تاکراری است" }

        const userPhonNumber = await userModel.findOne({ phoneNumber })
        if (userPhonNumber) throw { message: "شماره تلفن شما تکراری است" }
        await userModel.create({
            phoneNumber, name, familly, email, adress, password: hash.hashedSring(password), confirmPassword
        })

        console.log(req.body);
        res.status(201).json({ success: true, message: "user has been created" })

    } catch (error) {
        // console.log(error);
        // res.status(400).json({ success: false, message: error.errors || error.massage })

        next({
            status: 400,
            message: error.errors || error.message

        })
    }
}

const loging = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body
        
        await logingValidation.validate({ phoneNumber, password })


        const user = await userModel.findOne({ phoneNumber })
        if (!user) throw ({ message: "شماره تلفن یا رمز عبور صحیح نمی باشد" })

        if (!hash.compareHashedString(password, user.password))

            throw ({ message: "شماره تلفن یا رمز عبور صحیح نمی باشد" })
        user.token = hash.generatWebToken(user.phoneNumber)
        console.log(user)
        user.save()
        res.status(201).json({ message: "با موفقیت وارد شدید" })




    } catch (error) {
        next({ status: 400, message: error.errors || error.message, success: false })
    }
}

const changePassword = async (req, res, next) => {
    try {
        const {newPassword,oldPassword,confirmNewpassword } = req.body
        const user = await userModel.findOne({ phoneNumber: req.result })
        if(!user) throw {message:"کاربر وجود ندارد"}

        if (!hash.compareHashedString(oldPassword, user.password))
            throw ({ message: "پسورد قبلی شما صحیح نیست" })


         if(newPassword != confirmNewpassword)
             throw ({ message: "پسورد های جدید یکسان نیستند" })

          res.status(200).json({message:"پسورد با موفقیت تغییر کرد"})   

        await yup.string()
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
        .validate(newPassword)
       
        
        next()
    } catch (error) {
        next({ message: error.errors || error.message, success: false, status: 400 })

    }
}

const changeProfile = async (req, res, next) => {
    try {
        const { name, familly, email, adress } = req.body

        const changedprofile = await userModel.updateOne({ phoneNumber: req.result }, { name, familly, email, password, adress })
        if (!changedprofile.modifiedCount) throw ({
            message: "پروفایل شما آپدیت نشد"
        })
        res.status(200).json({ message: "پروفایل آپدیدت شد" })




    } catch (error) {
        
        next({ message: error.errors || error.message, success: false, status: 400 })
    }
}
const saveimage = async(req,res,next)=>{
    try {
        const img = req.file
        const imgPath = req.protocol +"://"+req.get("host")+img.path.slice(6).replaceAll("\\","/")
        const result = await userModel.updateOne({phoneNumber :req.result},{avatar:imgPath})
        res.status(200).json({message:"عکس کاربری با موفقیت آپلود شد",success:true})
        next()
    } catch (error) {
        next({status:400,message:error.message})
        
    }
}



const getProfile = async(req,res,next)=>{
    try {
        const user = await userModel.findOne({phoneNumber:req.result},{password :0 ,updatedAt:0,createdAt:0 ,__v
        :0})
        if(!user) throw ({message:"کار بر یافت نشد"})
        res.status(200).json(user)
    } catch (error) {
        next({ message: error.errors || error.message, success: false, status: 400 })
        
    }
}
const deletAcont = async(req,res,next)=>{
    try {
        const delet = await userModel.deleteOne({phoneNumber :req.result})
        res.status(200).json(delet)
        next()
    } catch (error) {
        next({ message: error.message })
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await userModel.find()
        res.status(200).json(users)

    } catch (error) {
        next({ message: error.message })

    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById({ _id: id })
        res.json(user)

    } catch (error) {
        res.json({ message: "کاربر یافت نشد" })
    }
}
module.exports = { singup,getProfile, loging, changeProfile, getUser, getUsers, changePassword ,deletAcont,saveimage}