// routes/users.js
const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);   // Editar usuario
router.delete('/:id', deleteUser); // Eliminar usuario

module.exports = router;