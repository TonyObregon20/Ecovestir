// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Los campos name, email y password son obligatorios'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: 'El correo electrónico ya está registrado'
      });
    }

    // ✅ Hashear la contraseña antes de guardar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // ✅ Guardar hash
      role: role || 'customer',
      status: 'active'
    });

    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ✅ Actualizar usuario (si se cambia la contraseña, hashearla)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    // Solo hashear si se envía nueva contraseña
    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


//  Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      deletedUser: user
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser};