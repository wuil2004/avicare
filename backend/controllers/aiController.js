const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.consultVeterinarian = async (req, res) => {
  try {
    const { prompt } = req.body;
    const file = req.file; // Aquí viene la imagen gracias a Multer y Cloudinary

    if (!prompt) {
      return res.status(400).json({ error: "Por favor describe el síntoma." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Actualizamos las instrucciones para que sepa que puede recibir fotos
    const systemPrompt = `
      Eres un veterinario experto en ornitología.
      El usuario te describirá un síntoma y opcionalmente te mostrará una foto (puede ser de un ave, de sus heces, de una herida, o de su nido).
      Tu trabajo es:
      1. Dar un pre-diagnóstico basado en el texto y analizar visualmente la imagen (si la hay).
      2. Dar recomendaciones de primeros auxilios.
      3. Aclarar que no sustituyes a un veterinario real.
      
      Síntoma reportado: ${prompt}
    `;

    // Empaquetamos la información
    let contentArray = [systemPrompt];

    // Si el usuario mandó una foto, la preparamos para que la IA la "vea"
    if (file) {
      // Usamos el fetch nativo de Node 20 para leer la imagen desde Cloudinary
      const imageResponse = await fetch(file.path);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: file.mimetype
        }
      };
      contentArray.push(imagePart); // Agregamos la foto al paquete
    }

    // Disparamos la consulta a Gemini con el texto y la foto
    const result = await model.generateContent(contentArray);
    const responseText = result.response.text();

    res.status(200).json({ 
      mensaje: "Consulta exitosa 🩺",
      fotoSubida: file ? file.path : "No se envió foto", // Te devuelve el link de tu nube
      diagnostico: responseText 
    });

  } catch (error) {
    res.status(500).json({ error: 'Fallo al consultar a Gemini', detalle: error.message });
  }
};