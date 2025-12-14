import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  console.log("1. 🟢 API contactada: Iniciando proceso...");

  try {
    // 1. Validar variables de entorno antes de nada
    if (!process.env.SMTP_PASS || !process.env.SMTP_USER) {
      console.error("❌ ERROR: Faltan las variables de entorno en .env.local");
      throw new Error("Configuración del servidor incompleta (Faltan credenciales)");
    }

    // 2. Leer los datos que vienen del frontend
    const data = await req.json();
    const { attendees } = data;

    if (!attendees || attendees.length === 0) {
      throw new Error("No llegaron datos de los asistentes");
    }

    console.log("2. 👤 Datos recibidos:", attendees.length, "asistentes");

    // 3. Configurar el transporte (Brevo)
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: "info@nextbyn.com", // Tu login de Brevo
        pass: process.env.SMTP_PASS, // Tu API Key de Brevo (desde .env.local)
      },
      tls: {
        rejectUnauthorized: false // Ayuda a evitar errores de certificados en desarrollo
      }
    });

    // 4. Verificar la conexión con Brevo antes de enviar
    // Esto nos dirá si la contraseña está mal sin intentar enviar el mail
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error("❌ Error de Conexión SMTP:", error);
          reject(new Error("No se pudo conectar con Brevo. Revisa tu Clave SMTP."));
        } else {
          console.log("3. ✅ Conexión SMTP exitosa");
          resolve(success);
        }
      });
    });

    // 5. Formatear el HTML del correo
    const asistentesHTML = attendees.map((p: any) => `
      <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <p><strong>Nombre:</strong> ${p.name}</p>
        <p><strong>Asistencia:</strong> ${p.attendance === 'si' ? '<span style="color:green">✅ SÍ ASISTE</span>' : '<span style="color:red">❌ NO ASISTE</span>'}</p>
        <p><strong>Restricciones Alimentarias:</strong> ${p.dietaryRestrictions || 'Ninguna'}</p>
      </div>
    `).join('');

    // 6. Enviar el correo
    const info = await transporter.sendMail({
      from: `"Invitación XV Agustina" <info@nextbyn.com>`,
      to: "nataliah_@hotmail.com", 
      subject: `💌 Nueva Confirmación: ${attendees[0].name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px;">
          <h2 style="color: #7e22ce; border-bottom: 2px solid #7e22ce; padding-bottom: 10px;">Nueva Confirmación Recibida</h2>
          <p>Se han registrado los siguientes datos en la invitación web:</p>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
            ${asistentesHTML}
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">Este correo fue enviado automáticamente desde la web de invitación.</p>
        </div>
      `,
    });

    console.log("4. 🚀 Correo enviado ID:", info.messageId);

    return NextResponse.json({ success: true, message: 'Correo enviado con éxito' });

  } catch (error: any) {
    console.error('🔴 Error FINAL en route.ts:', error.message);
    // Devolvemos JSON incluso si falla, para que el frontend no de error de sintaxis
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}