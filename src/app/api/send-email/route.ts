import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { invitados } = await request.json();

    // Configurá tu transporte (usando Gmail, por ejemplo)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tu email
        pass: process.env.EMAIL_PASS  // tu contraseña o app password
      }
    });

    // Contenido del mail
    const mailOptions = {
      from: `"Invitación XV" <${process.env.EMAIL_USER}>`,
      to: "tucorreo@ejemplo.com", // destinatario
      subject: "Nueva confirmación de asistencia 💌",
      html: `
        <h2>Se confirmó asistencia</h2>
        <p>Personas invitadas:</p>
        <ul>
          ${invitados.map((p: string) => `<li>${p}</li>`).join("")}
        </ul>
      `
    };

    // Enviar el mail
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error al enviar el correo:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}