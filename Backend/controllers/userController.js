// controllers/userController.js
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};
//  Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, status } = req.body;

    // Buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar campos
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) user.password = password; // Solo actualizar si se envía nueva contraseña
    user.role = role || user.role;
    user.status = status || user.status;

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

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // ✅ Nombres en inglés, igual que en el modelo

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

    const newUser = new User({
      name,
      email,
      password, // ⚠️ Aún en texto plano (lo mejoraremos después)
      role: role || 'customer' // valor por defecto
    });

    await newUser.save();

    // Eliminar la contraseña de la respuesta
    const { password: _, ...userResponse } = newUser.toObject();
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Si el error es de duplicado por email (único), manejarlo amigablemente
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El correo ya está en uso' });
    }
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser};