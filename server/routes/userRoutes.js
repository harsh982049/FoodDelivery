const express = require('express');
const router = express.Router();
const {login, register, tokenAuth, getProtectedData } = require('../controllers/userController');

router.post('/login', login);
router.post('/register', register);

router.get('/protected', tokenAuth, getProtectedData);

module.exports = router;