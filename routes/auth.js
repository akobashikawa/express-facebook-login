const express = require('express');
const auth = require('../auth');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', auth.authenticate, authController.authorized);
router.post('/logout', authController.logout);

router.get('/authorized', authController.authorized);
router.get('/unauthorized', authController.unauthorized);

module.exports = router;