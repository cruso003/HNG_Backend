const express = require('express');
const { createOrganisation, getUserOrganisations, getOrganisation, addUserToOrganisation } = require('../controllers/organisationController');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
router.post('/', authMiddleware, createOrganisation);
router.get('/', authMiddleware, getUserOrganisations);
router.get('/:orgId', authMiddleware, getOrganisation);
router.post('/:orgId/users', authMiddleware, addUserToOrganisation);

module.exports = router;
