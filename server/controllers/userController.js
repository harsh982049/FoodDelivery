const User = require('../model/userModel');
const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ADMIN_JWT_SECRET = process.env.ADMIN_TOKEN_SECRET;

// Token-based Authentication Middleware (JWT)
const tokenAuth = (req, res, next) => {
    // console.log('Reached tokenAuth');
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    // console.log(token);
    if(!token)
    {
        return res.json({status: false, msg: 'No token provided'});
    }
    
    jwt.verify(token, JWT_SECRET, (err) => {
        if(err) return res.json({status: false, msg: 'Failed to authenticate token'});
        // console.log('Failed to authenticate');
        // Save the decoded user info to request for use in other routes
        // req.user = decoded;
        next();
    });
}

const adminTokenAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    // console.log(token);

    jwt.verify(token, ADMIN_JWT_SECRET, (err) => {
        if(err) return res.json({status: false, msg: 'Failed to authenticate token'});
        next();
    });
}

const login = async (req, res, next) => {
    try
    {
        const {username, password} = req.body;
        // console.log(req.body);
        const user = await User.findOne({username});
        if(!user)
        {
            return res.json({status: false,  msg: 'Username does not exist'});
        }
        // const user = await User.findOne({username});
        const checkPassword = await bcrypt.compare(password, user.password);
        if(!checkPassword)
        {
            return res.json({status: false,  msg: 'Password is invalid'});
        }

        const userObject = {
            username: user.username,
            email: user.email,
            userId: user._id
        };
        return res.json({status: true, user: userObject});
    }
    catch(error)
    {
        next(error);
    }
};

const register = async (req, res, next) => {
    try
    {
        const {username, email, password} = req.body;
        // console.log(username, email, password);
        const checkUserName = await User.findOne({username});
        if(checkUserName)
        {
            return res.json({status: false, msg: 'Username is already used'});
        }
        const checkEmail = await User.findOne({email});
        if(checkEmail)
        {
            return res.json({status: false, msg: 'Email is already used'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({username, email, password: hashedPassword});

        // const token = jwt.sign(
        //     {
        //         userId: user._id,
        //         username: user.username,
        //         email: user.email
        //     },
        //     JWT_SECRET
        // );

        const userObject = {
            username: user.username,
            email: user.email,
            userId: user._id,
        };

        // console.log(userObject);
        return res.json({status: true, user: userObject});
    }
    catch(error)
    {
        next(error);
    }
};

const getProtectedData = (req, res) => {
    // This route is protected by tokenAuth middleware
    return res.json({ status: true, msg: 'Protected data', user: req.user });
};

const adminLogin = async (req, res, next) => {
    try
    {
        const {adminName, password} = req.body;
        // console.log(req.body);
        const admin = await Admin.findOne({adminName});
        if(!admin)
        {
            return res.json({status: false,  msg: 'Admin with this name does not exist'});
        }
        // const user = await User.findOne({username});
        const checkPassword = await bcrypt.compare(password, admin.password);
        if(!checkPassword)
        {
            return res.json({status: false,  msg: 'Password is invalid'});
        }

        // const token = jwt.sign(
        //     {
        //         adminId: admin._id,
        //         adminName: admin.adminName,
        //         email: admin.email
        //     },
        //     ADMIN_JWT_SECRET
        // );
        // console.log(token);
        
        const adminObject = {
            username: admin.adminName,
            email: admin.email,
            adminId: admin._id,
        };
        // console.log('Verified admin token');
        // delete user.password;
        return res.json({status: true, admin: adminObject});
    }
    catch(error)
    {
        next(error);
    }
};

module.exports = {login, register, tokenAuth, adminTokenAuth, adminLogin};