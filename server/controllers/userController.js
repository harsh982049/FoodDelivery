const User = require('../model/userModel');
const Admin = require('../model/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = 'your_jwt_secret_key'; 

const digestAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Digest ')) {
        return res.status(401).json({ status: false, msg: 'Digest Authorization required' });
    }

    const digestToken = authorization.split(' ')[1];
    const { username, password } = req.body;

    User.findOne({ username }).then(user => {
        if (!user) {
            return res.status(401).json({ status: false, msg: 'Invalid username or password' });
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err || !match) {
                return res.status(401).json({ status: false, msg: 'Invalid password' });
            }

            // Generate digest token (using username and password)
            const digest = crypto.createHash('md5').update(`${username}:${password}`).digest('hex');
            if (digestToken === digest) {
                // Proceed if digest is correct
                next();
            } else {
                return res.status(401).json({ status: false, msg: 'Invalid Digest token' });
            }
        });
    }).catch(error => next(error));
};

// Token-based Authentication Middleware (JWT)
const tokenAuth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ status: false, msg: 'No token provided' });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ status: false, msg: 'Failed to authenticate token' });

        // Save the decoded user info to request for use in other routes
        req.user = decoded;
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
        // delete user.password;
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

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email
            },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        const user = await User.create({username, email, password: hashedPassword});
        // delete user.password;
        const userObject = {
            username: user.username,
            email: user.email,
            userId: user._id,
            token
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
        const adminObject = {
            username: admin.adminName,
            email: admin.email,
            adminId: admin._id
        };
        // delete user.password;
        return res.json({status: true, admin: adminObject});
    }
    catch(error)
    {
        next(error);
    }
};

const adminRegister = async (req, res, next) => {
    try
    {
        const {adminName, email, password} = req.body;
        // console.log(adminName, email, password);
        const checkAdminName = await Admin.findOne({adminName});
        if(checkAdminName)
        {
            return res.json({status: false, msg: 'Admin with this name is already used'});
        }
        const checkEmail = await Admin.findOne({email});
        if(checkEmail)
        {
            return res.json({status: false, msg: 'Email is already used'});
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // const token = jwt.sign(
        //     {
        //         adminId: admin._id,
        //         username: admin.adminName,
        //         email: admin.email
        //     },
        //     JWT_SECRET,
        //     { expiresIn: '1h' } // Token expires in 1 hour
        // );

        const admin = await Admin.create({adminName, email, password: hashedPassword});
        // delete user.password;
        const adminObject = {
            adminName: admin.adminName,
            email: admin.email,
            adminId: admin._id,
            // token
        };
        // console.log(userObject);
        return res.json({status: true, admin: adminObject});
    }
    catch(error)
    {
        next(error);
    }
};

module.exports = {login, register, digestAuth, tokenAuth, getProtectedData, adminLogin, adminRegister};