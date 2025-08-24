export function userEmailTemplate(nombre: string) {
    return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; text-align: center;">
      <h2 style="color: #333;">Gracias por contactarnos, ${nombre}</h2>
      <p style="color: #555; font-size: 16px;">
        Hemos recibido tu mensaje y lo revisaremos a la mayor brevedad posible.
      </p>
      <p style="color: #777; font-size: 14px;">
        Un saludo,<br><strong>Equipo de Soporte</strong>
      </p>
    </div>
  </div>
  `;
}
