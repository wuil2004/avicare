const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Leer el token que viene desde los encabezados (Headers)
  const token = req.header('Authorization');

  // Si no hay token, rebotamos la petición de inmediato
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token de seguridad.' });
  }

  try {
    // El formato estándar es "Bearer TOKEN", así que le quitamos la palabra "Bearer " si viene
    const limpiaToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // 2. Verificar que el token sea real y no esté alterado o expirado
    const verified = jwt.verify(limpiaToken, process.env.JWT_SECRET || 'clave_secreta_temporal_avicare');
    
    // Guardamos los datos del usuario dentro de la petición para usarlo después
    req.user = verified;
    
    next(); // ¡Pase autorizado! Continuamos a la ruta
  } catch (error) {
    res.status(400).json({ error: 'Token inválido o expirado.' });
  }
};