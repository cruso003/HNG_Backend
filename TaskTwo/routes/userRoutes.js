const express = require('express');
const { getUserById } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/:id', authMiddleware, getUserById);

module.exports = router;
