const express = require('express');
const passportMid = require('../auth/passport');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', passportMid.authenticate, authController.authorized);
router.post('/logout', authController.logout);
router.get('/authorized', authController.authorized);
router.get('/unauthorized', authController.unauthorized);

module.exports = router;