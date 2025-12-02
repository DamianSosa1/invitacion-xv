import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { song, link } = await request.json();

    // Ubicación del archivo
    const filePath = path.join(process.cwd(), "public", "data", "playlist.json");

    // Si no existe, crearlo vacío
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
    }

    // Leer y parsear el archivo existente
    const fileData = fs.readFileSync(filePath, "utf8");
    const suggestions = fileData.trim() ? JSON.parse(fileData) : [];

    // Agregar nueva sugerencia
    suggestions.push({ song, link });

    // Guardar nuevamente el archivo
    fs.writeFileSync(filePath, JSON.stringify(suggestions, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Sugerencia guardada correctamente" });
  } catch (error: any) {
    console.error("Error al guardar sugerencia:", error);
    return NextResponse.json(
      { success: false, message: "Error al guardar sugerencia" },
      { status: 500 }
    );
  }
}