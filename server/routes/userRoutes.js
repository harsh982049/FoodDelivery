const express = require('express');
const router = express.Router();
const {login, register, tokenAuth, getProtectedData, adminLogin} = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/adminLogin', adminLogin);

router.get('/protected', tokenAuth, getProtectedData);

module.exports = router;