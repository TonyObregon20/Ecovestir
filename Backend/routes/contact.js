const express = require('express');
const router = express.Router();
const { createContact, listContacts } = require('../controllers/contactController');
// Public: create a contact message
router.post('/', createContact);

// Admin: list contact messages (you can protect this route with auth/admin middleware later)
router.get('/', listContacts);

module.exports = router;
