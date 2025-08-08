import { jsPDF } from 'jspdf';

export function generarPDFBitacoras(bitacoras: any[]) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setTextColor('#2d3748');
  doc.text('UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE', 105, 18, { align: 'center' });
  doc.setFontSize(13);
  doc.text('Reporte de Bitácoras', 105, 28, { align: 'center' });
  doc.setDrawColor('#e5e7eb');
  doc.line(20, 32, 190, 32);

  // Métricas institucionales en texto alineado a la izquierda
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(34, 34, 34);
  const total = bitacoras.length;
  const completadas = bitacoras.filter(b => b.estado === 'Completada').length;
  const pendientes = bitacoras.filter(b => b.estado === 'Pendiente').length;
  const metricas = [
    `Total Bitácoras: ${total}`,
    `Completadas: ${completadas}`,
    `Pendientes: ${pendientes}`
  ];
  metricas.forEach((texto, i) => {
    doc.text(texto, 20, 45 + i * 12);
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(45, 55, 72);
  let tablaY = 45 + metricas.length * 12 + 20;
  doc.setFontSize(12);
  const headers = ['Estudiante', 'Práctica', 'Fecha', 'Estado'];
  const colWidths = [50, 60, 40, 30];
  let x = 20;
  headers.forEach((header, i) => {
    doc.text(header, x, tablaY);
    x += colWidths[i];
  });
  doc.setLineWidth(0.2);
  doc.line(20, tablaY + 2, 20 + colWidths.reduce((a, b) => a + b, 0), tablaY + 2);

  bitacoras.forEach((b, idx) => {
    let yRow = tablaY + 10 * (idx + 1);
    x = 20;
    doc.setFontSize(11);
    doc.text(b.estudiante || '-', x, yRow);
    x += colWidths[0];
    doc.text(b.practica || '-', x, yRow);
    x += colWidths[1];
    doc.text(b.fecha || '-', x, yRow);
    x += colWidths[2];
    doc.text(b.estado || '-', x, yRow);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, yRow + 2, 20 + colWidths.reduce((a, b) => a + b, 0), yRow + 2);
  });
  doc.save('reporte_bitacoras.pdf');
}
export function generarPDFUsuarios(usuarios: any[]) {
  const doc = new jsPDF();
  // Encabezado institucional
  doc.setFontSize(16);
  doc.setTextColor('#2d3748');
  doc.text('UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE', 105, 18, { align: 'center' });
  doc.setFontSize(13);
  doc.text('Reporte de Usuarios', 105, 28, { align: 'center' });
  doc.setDrawColor('#e5e7eb');
  doc.line(20, 32, 190, 32);

  // Métricas institucionales en texto alineado a la izquierda
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(34, 34, 34);
  const total = usuarios.length;
  const activos = usuarios.filter(u => u.activo).length;
  const inactivos = usuarios.filter(u => !u.activo).length;
  const docentes = usuarios.filter(u => u.rol === 'docente').length;
  const metricas = [
    `Total Usuarios: ${total}`,
    `Activos: ${activos}`,
    `Inactivos: ${inactivos}`,
    `Docentes: ${docentes}`
  ];
  metricas.forEach((texto, i) => {
    doc.text(texto, 20, 45 + i * 12);
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(45, 55, 72);
  let tablaY = 45 + metricas.length * 12 + 20;
  const headers = ['Nombre', 'Email', 'Tipo', 'Estado', 'Laboratorios'];
  const colWidths = [30, 40, 35, 22, 28];
  // Centrar la tabla en la página
  const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
  const marginLeft = (doc.internal.pageSize.getWidth() - totalTableWidth) / 2;
  let x = marginLeft;
  headers.forEach((header, i) => {
    doc.text(header, x, tablaY);
    x += colWidths[i];
  });
  doc.setLineWidth(0.2);
  doc.line(marginLeft, tablaY + 2, marginLeft + totalTableWidth, tablaY + 2);

  usuarios.forEach((u, idx) => {
    let yRow = tablaY + 10 * (idx + 1);
    x = marginLeft;
    doc.setFontSize(11);
    doc.text(u.nombre || '-', x, yRow);
    x += colWidths[0];
    doc.text(u.email || u.correo || u.correo_electronico || '-', x, yRow);
    x += colWidths[1];
    doc.text(u.rol || '-', x, yRow);
    x += colWidths[2];
    doc.text(u.activo ? 'Activo' : 'Inactivo', x, yRow);
    x += colWidths[3];
    doc.text(u.laboratorios ? String(u.laboratorios) : '-', x, yRow);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginLeft, yRow + 2, marginLeft + totalTableWidth, yRow + 2);
  });

  doc.save('reporte_usuarios.pdf');
}
