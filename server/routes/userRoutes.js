const express = require('express');
const router = express.Router();
const {login, register, tokenAuth, adminLogin, adminTokenAuth} = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);
router.post('/adminLogin', adminLogin);

router.get('/protected', tokenAuth);

module.exports = router;