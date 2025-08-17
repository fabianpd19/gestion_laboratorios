import { jsPDF } from "jspdf";

// Función auxiliar para convertir imagen a Base64 desde /public
async function getImageBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

// ===============================
//  REPORTE USO DE LABORATORIO (FORMATO OFICIAL)
// ===============================
export async function generarPDFUsoLaboratorio(
  datos: {
    codigoDocumento: string;
    codigoProceso: string;
    revision: string;
    fecha: string;
    pagina: string;
    laboratorio: string;
    departamento: string;
    profesor: string;
    tema: string;
    objetivo: string;
    sesiones: { fecha: string; nrc: string; alumnos: number; firmaProfesor: string }[];
    alumnos: { numero: number; nombre: string; equipos: string; observaciones: string }[];
  }
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // =========================
  // 1. ENCABEZADO MEJORADO
  // =========================
  const headerX = 10;
  const headerY = 10;
  const headerWidth = 190;
  const headerHeight = 30;

  // Rectángulo general
  doc.rect(headerX, headerY, headerWidth, headerHeight);

  // Logo ESPE a la izquierda
  const logoBase64 = await getImageBase64("/images/espe-logo.png");
  doc.addImage(logoBase64, "PNG", headerX + 4, headerY + 4, 38, 22);

  // Título centrado en dos líneas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const centerX = headerX + headerWidth / 2;
  doc.text("Bitácora del Laboratorio de", centerX, headerY + 12, { align: "center" });
  doc.text(datos.laboratorio, centerX, headerY + 19, { align: "center" });

  // Cuadro derecho (departamento, fecha, página)
  const rightBoxWidth = 80;
  const rightBoxX = headerX + headerWidth - rightBoxWidth;
  const rightBoxY = headerY;
  const rightBoxHeight = headerHeight;
  doc.rect(rightBoxX, rightBoxY, rightBoxWidth, rightBoxHeight);

  // Departamento (arriba)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(datos.departamento, rightBoxX + rightBoxWidth / 2, rightBoxY + 7, { align: "center" });
  // Línea separadora
  doc.line(rightBoxX, rightBoxY + 10, rightBoxX + rightBoxWidth, rightBoxY + 10);
  // Fecha y página
  doc.setFontSize(8);
  doc.text("Fecha", rightBoxX + 15, rightBoxY + 17);
  doc.text(datos.fecha, rightBoxX + 35, rightBoxY + 17);
  doc.text("Página:", rightBoxX + 15, rightBoxY + 24);
  doc.text(datos.pagina, rightBoxX + 35, rightBoxY + 24);

  // Línea inferior del encabezado
  doc.line(headerX, headerY + headerHeight, headerX + headerWidth, headerY + headerHeight);

  // Línea "PAO" antes de la tabla principal
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("PAO", headerX, headerY + headerHeight + 7);

  // ====================
  // 2. TABLA SESIONES
  // ====================
  let y = headerY + headerHeight + 10;
  const startX = 10;
  const tableWidth = 190;

  // Columnas de la tabla sesiones (anchos)
  const colWidths = [30, 20, 20, 75, 45];
  const colsX = [startX];
  colWidths.reduce((acc, w) => {
    colsX.push(acc + w);
    return acc + w;
  }, startX);

  // Altura fila
  const headerRowHeight = 12;
  const rowHeight = 15; // aumenté para dejar espacio firma

  // Dibujar rectángulo completo tabla sesiones
  const sesionesTableHeight = headerRowHeight + datos.sesiones.length * rowHeight;
  doc.rect(startX, y, tableWidth, sesionesTableHeight);

  // Dibujar líneas verticales (columnas)
  for (let i = 0; i < colsX.length; i++) {
    doc.line(colsX[i], y, colsX[i], y + sesionesTableHeight);
  }

  // Dibujar líneas horizontales (filas)
  for (let i = 0; i <= datos.sesiones.length; i++) {
    const rowY = y + headerRowHeight + i * rowHeight;
    doc.line(startX, rowY, startX + tableWidth, rowY);
  }

  // Encabezado tabla sesiones
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Fecha\n(aa-mm-dd)", colsX[0] + 5, y + 8);
  doc.text("NRC", colsX[1] + 5, y + 8);
  doc.text("Alumnos", colsX[2] + 5, y + 8);
  doc.text("Cada sesión de laboratorio es de dos horas", colsX[3] + 5, y + 8);
  doc.text("Nombre del profesor:", colsX[4] + 5, y + 8);

  // --- Cargar firmas ---
  const firmasBase64: (string | null)[] = await Promise.all(
    datos.sesiones.map(async (s) => {
      if (s.firmaProfesor) {
        try {
          return await getImageBase64(s.firmaProfesor);
        } catch {
          return null;
        }
      }
      return null;
    })
  );

  // Filas tabla sesiones con firma
  doc.setFont("helvetica", "normal");
  let currentY = y + headerRowHeight + 8;
  // --- En filas sesiones con firmas ---
for (let i = 0; i < datos.sesiones.length; i++) {
  const s = datos.sesiones[i];
  doc.text(s.fecha, colsX[0] + 5, currentY);
  doc.text(s.nrc, colsX[1] + 5, currentY);
  doc.text(String(s.alumnos), colsX[2] + 5, currentY);
  doc.text(s.tema || datos.tema, colsX[3] + 5, currentY, { maxWidth: colWidths[3] - 10 });
  doc.text(datos.profesor, colsX[4] + 5, currentY, { maxWidth: colWidths[4] - 10 });

  if (firmasBase64[i]) {
    const imgWidth = 35;
    const imgHeight = 15;
    const imgX = colsX[4] + 5;
    const imgY = currentY + 5; // Más espacio debajo del texto
    doc.addImage(firmasBase64[i]!, "PNG", imgX, imgY, imgWidth, imgHeight);
  }

  currentY += rowHeight;
}

  // ========================
  // 3. CUADRO OBJETIVO
  // ========================
  const objetivoBoxHeight = 20;
  const objetivoBoxWidth = 190;
  const objetivoBoxX = 10;
  const objetivoBoxY = y + sesionesTableHeight + 10;

  doc.rect(objetivoBoxX, objetivoBoxY, objetivoBoxWidth, objetivoBoxHeight);

  // Texto objetivo con título
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Objetivo:", objetivoBoxX + 3, objetivoBoxY + 7);

  doc.setFont("helvetica", "normal");
  doc.text(datos.objetivo, objetivoBoxX + 20, objetivoBoxY + 7, { maxWidth: objetivoBoxWidth - 25 });

  // ======================
  // 4. TABLA ALUMNOS
  // ======================
  let yAlumnos = objetivoBoxY + objetivoBoxHeight + 15;
  // Ajuste de anchos: N° (12), Alumno responsable (55), Equipos entregados (80), Observaciones/Novedades (43)
  const colsAlumnosWidths = [12, 55, 80, 43];
  const colsAlumnosX = [startX];
  colsAlumnosWidths.reduce((acc, w) => {
    colsAlumnosX.push(acc + w);
    return acc + w;
  }, startX);

  const alumnosHeaderHeight = 13;
  const alumnosRowHeight = 13;
  const alumnosTableHeight = alumnosHeaderHeight + datos.alumnos.length * alumnosRowHeight;

  // Rectángulo completo tabla alumnos
  doc.rect(startX, yAlumnos, colsAlumnosWidths.reduce((a, b) => a + b, 0), alumnosTableHeight);

  // Líneas verticales
  for (let i = 0; i < colsAlumnosX.length; i++) {
    doc.line(colsAlumnosX[i], yAlumnos, colsAlumnosX[i], yAlumnos + alumnosTableHeight);
  }

  // Líneas horizontales filas
  for (let i = 0; i <= datos.alumnos.length; i++) {
    const rowY = yAlumnos + alumnosHeaderHeight + i * alumnosRowHeight;
    doc.line(startX, rowY, startX + colsAlumnosWidths.reduce((a, b) => a + b, 0), rowY);
  }

  // Encabezados tabla alumnos
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("N°", colsAlumnosX[0] + 3, yAlumnos + 8);
  doc.text("Alumno responsable", colsAlumnosX[1] + 3, yAlumnos + 8);
  doc.text("Equipos entregados", colsAlumnosX[2] + 3, yAlumnos + 8);
  doc.text("Observaciones/Novedades", colsAlumnosX[3] + 3, yAlumnos + 8);

  // Filas tabla alumnos
  doc.setFont("helvetica", "normal");
  let yFilaAlumnos = yAlumnos + alumnosHeaderHeight + alumnosRowHeight/2 + 2;
  datos.alumnos.forEach((a) => {
    doc.text(String(a.numero), colsAlumnosX[0] + 3, yFilaAlumnos, { baseline: 'middle' });
    doc.text(a.nombre, colsAlumnosX[1] + 3, yFilaAlumnos, { maxWidth: colsAlumnosWidths[1] - 6, baseline: 'middle' });
    doc.text(a.equipos, colsAlumnosX[2] + 3, yFilaAlumnos, { maxWidth: colsAlumnosWidths[2] - 6, baseline: 'middle' });
    doc.text(a.observaciones, colsAlumnosX[3] + 3, yFilaAlumnos, { maxWidth: colsAlumnosWidths[3] - 6, baseline: 'middle' });
    yFilaAlumnos += alumnosRowHeight;
  });

  doc.save(`bitacora_uso_laboratorio.pdf`);
}

// =====================================
//  FUNCIONES ORIGINALES (no se tocan)
// =====================================
export function generarPDFBitacoras(bitacoras: any[]) {
  // tu código original...
}

export function generarPDFUsuarios(usuarios: any[]) {
  // tu código original...
}
