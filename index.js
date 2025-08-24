require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Error al conectar con Gmail:", error);
    } else {
        console.log("✅ Servidor de correo listo para enviar.");
    }
});

// Función para plantilla del correo al admin
const adminEmailTemplate = (nombre, email, telefono, mensaje) => `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <h2 style="color: #004085;">📩 Nuevo mensaje desde el formulario</h2>
  <p><strong>Nombre:</strong> ${nombre}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Telefono:</strong> ${telefono}</p>
  <p><strong>Mensaje:</strong></p>
  <blockquote style="background: #f8f9fa; padding: 10px; border-left: 4px solid #004085;">
    ${mensaje}
  </blockquote>
</div>
`;

// Función para plantilla del correo al usuario
const userEmailTemplate = (nombre) => `
<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
  <h2 style="color: #28a745;">✅ Gracias por contactarnos</h2>
  <p>Hola <strong>${nombre}</strong>,</p>
  <p>Gracias por escribirnos. Hemos recibido tu mensaje y lo revisaremos a la mayor brevedad posible.</p>
  <p>Un saludo,<br><em>El equipo de JM Merino Advocats</em></p>
</div>
`;

app.post("/send-email", async (req, res) => {
    const { nombre, email, mensaje, confirmarEmail, telefono, confirmTelefono } = req.body;

    // Validación de campos
    if (!nombre || !email || !mensaje || !telefono) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Validación de coincidencia de correos
    if (email !== confirmarEmail) {
        return res.status(400).json({ error: "Los correos electrónicos no coinciden" });
    }

    // Validación de coincidencia de correos
    if (telefono !== confirmTelefono) {
        return res.status(400).json({ error: "Los telefonos no coinciden" });
    }

    try {
        // Correo al administrador
        const mailToAdmin = {
            from: `"Web Contacto" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO,
            subject: "📥 Nuevo mensaje desde el formulario de contacto",
            html: adminEmailTemplate(nombre, email, telefono,  mensaje),
        };

        // Correo al usuario
        const mailToUser = {
            from: `"JM Merino Advocats" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Gracias por contactarnos",
            html: userEmailTemplate(nombre),
        };

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
