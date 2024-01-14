const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { ensureAuthenticated } = require('../config/auth');
const constants = require('../config/constants');

router.get('/', (req, res) => res.success('Admin Running'));

// User Routes
router.post('/users/register', adminController.users_register_post);
router.post('/users/login', adminController.users_login_post);
router.get('/users/me', ensureAuthenticated(constants.userTypes.any), adminController.users_me_get);
router.get('/users', ensureAuthenticated(constants.userTypes.admin), adminController.users_get);

// Profile Apis
router.put('/profile', ensureAuthenticated(constants.userTypes.admin), adminController.profile_put);
router.put(
  '/profile/change-password',
  ensureAuthenticated(constants.userTypes.any),
  adminController.profile_change_password_post
);

module.exports = router;
