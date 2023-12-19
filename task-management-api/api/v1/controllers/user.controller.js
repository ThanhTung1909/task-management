const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password.model");
const md5 = require("md5");
const generate = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if(existEmail){
        res.json({
            code: 400,
            message: "email đã tồn tại"
        })
    }

    const inforUser = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: md5(req.body.password),
        token: generate.generateRandomString(30)
    };

    const user = new User(inforUser);
    await user.save();

    const token = user.token;
    // res.cookie("token", token);

    res.json({
        code: 200,
        message: "Đắng kỳ tài khoản thành công!",
        token: token
    });
}

// [POST] /api/v1/users/register
module.exports.login  = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            message: " Email không tồn tại"
        });
        return;
    }

    if(md5(password) !== user.password){
        res.json({
            code: 400,
            message: "Sai mật khẩu"
        });
        return;
    }

    const token = user.token;

    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    })
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    const otp = generate.generateRandomNumber(8);

    const timeExpire = 5;

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() + timeExpire * 60 * 1000
    };

    // việc 1 lưu vào database
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    forgotPassword.save();

    // việc 2: gửi otp qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = ` Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (Sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẻ mã OTP này với bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP"
    });
}

 // [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });

    if(!result){
        res.json({
            code: 400,
            message: "OTP không hợp lệ"
        });
        return;
    }

    const user = await User.findOne({email: email});

    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Xác thực thành công",
        token: token
    });
}

// [POST] /api/v1/users/password/otp
module.exports.resetPassword = async (req, res) => {
    const token = req.body.token;
    const password = req. body.password;

    const user = await User.findOne({
        token: token,
        deleted: false
    });

    if(!user){
        res.json({
            code: 400,
            message: "Tài khoản không tồn tại"
        });
        return;
    }

    if(md5(password) === user.password){
        res.json({
            code: 400,
            message: "Vui lòng nhập khẩu khác mật khẩu cũ"
        });
        return;
    }

    await User.updateOne({ token: token},{
        password: md5(password)
    });

    res.json({
        code: 200,
        message: "Đổi mật khẩu thành công"
    });
}

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
    
    res.json({
        code:200,
        message: "Thành công",
        info: req.user
    });
}

// [GET] /api/v1/users/detail
module.exports.list = async (req, res) => {
    const users = await User.find({deleted: false}).select("fullname email");

    res.json({
        code: 200,
        message: "Thành công",
        users: users
    });
}