module.exports.register = (req, res, next) => {
    if(!req.body.fullname){
        res.json({
            code: 400,
            message: "Vui lòng nhập họ và tên"
        });
        return;
    }
    if(!req.body.email){
        res.json({
            code: 400,
            message: "Vui lòng nhập email"
        });
        return;
    }
    if(!req.body.password){
        res.json({
            code: 400,
            message:"Vui lòng nhập password"
        });
        return;
    }
    next();
}

module.exports.login = (req, res, next) => {
    if(!req.body.email){
        res.json({
            code: 400,
            message: "Vui lòng nhập email"
        });
        return;
    }
    if(!req.body.password){
        res.json({
            code: 400,
            message:"Vui lòng nhập password"
        });
        return;
    }
    next();
}