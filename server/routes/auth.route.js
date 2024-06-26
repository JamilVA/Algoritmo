const { Router } = require('express');
const { login, register, refreshToken, logout, changePassword, changePasswordAdmin, getInfo } = require('../controllers/auth.controller');
// const requireToken = require('../middleware/requireToken');
// const requireRefreshToken = require('../middleware/requireRefreshToken');
// const { bodyRegisterValidator, bodyLoginValidator } = require('../middleware/validatorManager');

const router = Router();

//router.post('/register', bodyRegisterValidator, register);

router.post('/login', login);
// router.get('/refresh', requireRefreshToken, refreshToken)
router.get('/logout', logout);

router.get('/info', getInfo);


// router.put('/changePassword', requireToken, changePassword);
// router.put('/auth/changePasswordAdmin', requireToken, changePasswordAdmin);

module.exports = router;