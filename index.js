require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // tu_correo@gmail.com
        pass: process.env.EMAIL_PASS  // contraseña de aplicación
    },
});

// Verifica conexión con Gmail
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Error al conectar con Gmail:", error);
    } else {
        console.log("✅ Servidor de correo listo para enviar.");
    }
});

app.post("/send-email", async (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        // 1. Correo para ti (como administrador)
        const mailToAdmin = {
            from: `"Web Contacto" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO, // dirección tuya, definida en el .env
            subject: "📥 Nuevo mensaje desde el formulario de contacto",
            html: `
        <h3>Has recibido un nuevo mensaje desde tu web:</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
        };

        // 2. Correo de confirmación al usuario
        const mailToUser = {
            from: `"JM Merino Advocats" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Gracias por contactarnos",
            html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Gracias por contactarnos. Valoraremos tu solicitud y te responderemos a la mayor brevedad posible.</p>
        <p>Un saludo,</p>
        <p><em>El equipo de JM Merino Advocats</em></p>
      `,
        };

        // Enviar ambos correos (en paralelo)
        await Promise.all([
            transporter.sendMail(mailToAdmin),
            transporter.sendMail(mailToUser),
        ]);

        res.status(200).json({ message: "Correos enviados correctamente" });
    } catch (error) {
        console.error("❌ Error al enviar correos:", error);
        res.status(500).json({ error: "Error al enviar correos" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
