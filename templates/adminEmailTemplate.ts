export function adminEmailTemplate(nombre: string, email: string, mensaje: string) {
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px;">
      <h2 style="color: #333;">📩 Nuevo mensaje desde el formulario</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <tr>
          <td style="padding: 8px; font-weight: bold;">Nombre:</td>
          <td style="padding: 8px;">${nombre}</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
          <td style="padding: 8px; font-weight: bold;">Email:</td>
          <td style="padding: 8px;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; font-weight: bold;">Mensaje:</td>
          <td style="padding: 8px;">${mensaje}</td>
        </tr>
      </table>
    </div>
  </div>
  `;
}
