const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTRO
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verificar si el correo ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Encriptar la contraseña (10 rondas de salting)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ mensaje: '¡Usuario registrado con éxito! 🎉' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el registro', detalle: error.message });
  }
};

// 2. LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
    }

    // Verificar si la contraseña coincide con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas (correo o contraseña incorrectos).' });
    }

    // Crear el JWT (Token de acceso válido por 7 días)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'clave_secreta_temporal_avicare',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      mensaje: '¡Inicio de sesión exitoso! 🔑',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error en el inicio de sesión', detalle: error.message });
  }
};