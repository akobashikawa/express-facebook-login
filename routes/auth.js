const express = require('express');

const auth = require('../auth');

const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', auth.authenticate, authController.authorized);
router.get('/facebook-login', auth.facebookAuthenticate, authController.authorized);
router.get('/facebook-validate', auth.facebookValidate, authController.authorized);
router.get('/facebook-callback', (req, res) => {
    res.json({
        message: 'Facebook callback'
    });
});
router.post('/logout', authController.logout);

router.get('/authorized', authController.authorized);
router.get('/unauthorized', authController.unauthorized);

module.exports = router;