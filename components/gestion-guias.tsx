"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Trash2,
  Download,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Guia {
  id: number;
  titulo: string;
  descripcion?: string;
  parcial: string;
  archivo_pdf?: string | null;
  habilitada?: boolean | "f";
  laboratorio_nombre?: string;
  created_at?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

interface FormErrors {
  titulo?: string;
  laboratorioId?: string;
  archivo?: string;
  hora_inicio?: string;
  hora_fin?: string;
  horarios?: string;
}

export default function GestionGuias({ materiaId }: { materiaId: number }) {
  const { token, user } = useAuth();
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [parcial, setParcial] = useState("1");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [laboratorios, setLaboratorios] = useState<any[]>([]);
  const [laboratorioId, setLaboratorioId] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Obtener el id del docente desde el contexto de usuario
  const docenteId = user && user.id ? user.id : null;

  // Función para validar formato de hora
  const isValidTime = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  // Función para comparar horas
  const isTimeAfter = (startTime: string, endTime: string): boolean => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes > startMinutes;
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar título
    if (!titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    } else if (titulo.trim().length < 5) {
      newErrors.titulo = "El título debe tener al menos 5 caracteres";
    } else if (titulo.trim().length > 100) {
      newErrors.titulo = "El título no puede exceder 100 caracteres";
    }

    // Validar laboratorio
    if (!laboratorioId) {
      newErrors.laboratorioId = "Debe seleccionar un laboratorio";
    }

    // Validar horarios
    if (horaInicio && !isValidTime(horaInicio)) {
      newErrors.hora_inicio = "Formato de hora inválido (HH:MM)";
    }

    if (horaFin && !isValidTime(horaFin)) {
      newErrors.hora_fin = "Formato de hora inválido (HH:MM)";
    }

    // Validar que la hora de fin sea posterior a la hora de inicio
    if (
      horaInicio &&
      horaFin &&
      isValidTime(horaInicio) &&
      isValidTime(horaFin)
    ) {
      if (!isTimeAfter(horaInicio, horaFin)) {
        newErrors.horarios =
          "La hora de fin debe ser posterior a la hora de inicio";
      }
    }

    // Validar que si se proporciona una hora, se proporcionen ambas
    if ((horaInicio && !horaFin) || (!horaInicio && horaFin)) {
      newErrors.horarios =
        "Debe proporcionar tanto la hora de inicio como la hora de fin";
    }

    // Validar archivo
    if (archivo) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ["application/pdf"];

      if (!allowedTypes.includes(archivo.type)) {
        newErrors.archivo = "Solo se permiten archivos PDF";
      } else if (archivo.size > maxSize) {
        newErrors.archivo = "El archivo no puede superar los 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchGuias = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3001/api/guias-laboratorio?materia_id=${materiaId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setGuias(data.data);
      }
    } catch (error) {
      console.error("Error cargando guías", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las guías",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (archivo_pdf: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3001/api/upload/download/${archivo_pdf}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error al descargar");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivo_pdf.split("/").pop()!;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la guía", error);
      toast({
        title: "Error",
        description: "No se pudieron descargar la guía",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleEstadoGuia = async (id: number, habilitadaActual?: boolean) => {
    const nuevaHabilitada = !habilitadaActual;

    try {
      const res = await fetch(
        `http://localhost:3001/api/guias-laboratorio/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ habilitada: nuevaHabilitada }),
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "✅ Estado actualizado",
          description: `La guía ahora está ${
            nuevaHabilitada ? "habilitada" : "deshabilitada"
          }`,
        });
        fetchGuias(); // refrescar lista
      } else {
        throw new Error(data.message || "No se pudo actualizar el estado");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error de conexión con el servidor",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (materiaId) fetchGuias();
  }, [materiaId]);

  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/laboratorios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const result = await response.json();
          setLaboratorios(Array.isArray(result) ? result : result.data || []);
        }
      } catch (error) {
        console.error("Error loading laboratories:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los laboratorios",
          variant: "destructive",
        });
      }
    };

    fetchLaboratorios();
  }, [token]);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "guias"); // Carpeta específica para guías

      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        return data.data.filePath; // Acceder a la ruta desde data.data.filePath
      } else {
        throw new Error(data.message || "Error al subir archivo");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let archivo_pdf_path = null;
      // Subir archivo si existe
      if (archivo) {
        archivo_pdf_path = await uploadFile(archivo);
      }

      // Preparar las horas para envío al backend
      let hora_inicio_date = null;
      let hora_fin_date = null;

      if (horaInicio && horaFin) {
        // Crear fechas con la hora actual y la hora especificada
        const today = new Date();
        const [horaInicioHour, horaInicioMin] = horaInicio
          .split(":")
          .map(Number);
        const [horaFinHour, horaFinMin] = horaFin.split(":").map(Number);

        hora_inicio_date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          horaInicioHour,
          horaInicioMin
        );
        hora_fin_date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          horaFinHour,
          horaFinMin
        );
      }

      const payload = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        parcial: String(parcial),
        laboratorio_id: String(laboratorioId),
        asignatura_id: String(materiaId),
        docente_id: docenteId,
        estado: "borrador",
        archivo_pdf: archivo_pdf_path,
        hora_inicio: hora_inicio_date,
        hora_fin: hora_fin_date,
      };

      const res = await fetch("http://localhost:3001/api/guias-laboratorio", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          title: "✅ Guía creada exitosamente",
          description: "La guía se ha guardado correctamente",
        });

        // Limpiar formulario
        setTitulo("");
        setDescripcion("");
        setParcial("1");
        setLaboratorioId("");
        setArchivo(null);
        setHoraInicio("");
        setHoraFin("");
        setErrors({});

        // Limpiar input file
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        fetchGuias();
      } else {
        toast({
          title: "Error",
          description: data.message || "No se pudo crear la guía",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error de conexión con el servidor",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta guía?")) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/guias-laboratorio/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        toast({
          title: "✅ Guía eliminada",
          description: "La guía se eliminó correctamente",
        });
        fetchGuias();
      } else {
        const data = await res.json();
        toast({
          title: "Error",
          description: data.message || "No se pudo eliminar la guía",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al eliminar la guía",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (dateString?: string): string => {
    if (!dateString) return "No definido";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Formulario para nueva guía */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <Upload className="h-6 w-6" />
            Crear Nueva Guía de Laboratorio
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Título */}
              <div className="space-y-2">
                <Label
                  htmlFor="titulo"
                  className="text-sm font-semibold text-gray-700"
                >
                  Título de la Guía *
                </Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Introducción a los Circuitos Eléctricos"
                  value={titulo}
                  onChange={(e) => {
                    setTitulo(e.target.value);
                    if (errors.titulo) {
                      setErrors((prev) => ({ ...prev, titulo: undefined }));
                    }
                  }}
                  className={`transition-all ${
                    errors.titulo
                      ? "border-red-500 focus:ring-red-200"
                      : "focus:ring-blue-200"
                  }`}
                />
                {errors.titulo && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.titulo}
                  </p>
                )}
              </div>

              {/* Laboratorio */}
              <div className="space-y-2">
                <Label
                  htmlFor="laboratorio"
                  className="text-sm font-semibold text-gray-700"
                >
                  Laboratorio *
                </Label>
                <Select
                  value={laboratorioId}
                  onValueChange={(value) => {
                    setLaboratorioId(value);
                    if (errors.laboratorioId) {
                      setErrors((prev) => ({
                        ...prev,
                        laboratorioId: undefined,
                      }));
                    }
                  }}
                >
                  <SelectTrigger
                    className={`transition-all ${
                      errors.laboratorioId ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione un laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratorios.map((lab) => (
                      <SelectItem key={lab.id} value={String(lab.id)}>
                        {lab.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.laboratorioId && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.laboratorioId}
                  </p>
                )}
              </div>

              {/* Parcial */}
              <div className="space-y-2">
                <Label
                  htmlFor="parcial"
                  className="text-sm font-semibold text-gray-700"
                >
                  Parcial
                </Label>
                <Select value={parcial} onValueChange={setParcial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Primer Parcial</SelectItem>
                    <SelectItem value="2">Segundo Parcial</SelectItem>
                    <SelectItem value="3">Tercer Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Archivo PDF */}
              <div className="space-y-2">
                <Label
                  htmlFor="archivo"
                  className="text-sm font-semibold text-gray-700"
                >
                  Archivo PDF
                </Label>
                <div className="relative">
                  <Input
                    id="archivo"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setArchivo(file);
                      if (errors.archivo) {
                        setErrors((prev) => ({ ...prev, archivo: undefined }));
                      }
                    }}
                    className={`transition-all ${
                      errors.archivo ? "border-red-500" : ""
                    }`}
                  />
                  {archivo && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{archivo.name}</span>
                        <span className="text-blue-500">
                          ({formatFileSize(archivo.size)})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {errors.archivo && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.archivo}
                  </p>
                )}
              </div>
            </div>

            {/* Horarios */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <Label className="text-sm font-semibold text-gray-700">
                  Horarios de la Guía (Opcional)
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hora Inicio */}
                <div className="space-y-2">
                  <Label
                    htmlFor="horaInicio"
                    className="text-sm font-medium text-gray-600"
                  >
                    Hora de Inicio
                  </Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={horaInicio}
                    onChange={(e) => {
                      setHoraInicio(e.target.value);
                      if (errors.hora_inicio || errors.horarios) {
                        setErrors((prev) => ({
                          ...prev,
                          hora_inicio: undefined,
                          horarios: undefined,
                        }));
                      }
                    }}
                    className={`transition-all ${
                      errors.hora_inicio || errors.horarios
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-blue-200"
                    }`}
                    placeholder="HH:MM"
                  />
                  {errors.hora_inicio && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.hora_inicio}
                    </p>
                  )}
                </div>

                {/* Hora Fin */}
                <div className="space-y-2">
                  <Label
                    htmlFor="horaFin"
                    className="text-sm font-medium text-gray-600"
                  >
                    Hora de Fin
                  </Label>
                  <Input
                    id="horaFin"
                    type="time"
                    value={horaFin}
                    onChange={(e) => {
                      setHoraFin(e.target.value);
                      if (errors.hora_fin || errors.horarios) {
                        setErrors((prev) => ({
                          ...prev,
                          hora_fin: undefined,
                          horarios: undefined,
                        }));
                      }
                    }}
                    className={`transition-all ${
                      errors.hora_fin || errors.horarios
                        ? "border-red-500 focus:ring-red-200"
                        : "focus:ring-blue-200"
                    }`}
                    placeholder="HH:MM"
                  />
                  {errors.hora_fin && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.hora_fin}
                    </p>
                  )}
                </div>
              </div>

              {errors.horarios && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.horarios}
                </p>
              )}

              {horaInicio && horaFin && !errors.horarios && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duración: {horaInicio} - {horaFin}
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label
                htmlFor="descripcion"
                className="text-sm font-semibold text-gray-700"
              >
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción detallada de la guía de laboratorio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="min-h-[100px] resize-none focus:ring-blue-200"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right">
                {descripcion.length}/500 caracteres
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2 transition-all transform hover:scale-105"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Crear Guía
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de guías existentes */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            Guías de Laboratorio ({guias.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Cargando guías...</span>
            </div>
          ) : guias.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay guías registradas para esta materia. ¡Crea la primera
                guía!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4">
              {guias.map((guia, index) => (
                <Card
                  key={guia.id}
                  className="border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {guia.titulo}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Parcial {guia.parcial}
                          </span>
                        </div>
                        {guia.descripcion && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {guia.descripcion}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {guia.laboratorio_nombre && (
                            <span>📍 {guia.laboratorio_nombre}</span>
                          )}
                          {guia.created_at && (
                            <span>
                              📅{" "}
                              {new Date(guia.created_at).toLocaleDateString()}
                            </span>
                          )}
                          {(guia.hora_inicio || guia.hora_fin) && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(guia.hora_inicio)} -{" "}
                              {formatTime(guia.hora_fin)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          guia.habilitada === false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {guia.habilitada === true || guia.habilitada === "t"
                          ? "Habilitada"
                          : "Deshabilitada"}
                      </span>
                      <div className="flex items-center gap-2 ml-4">
                        {user?.role === "docente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              toggleEstadoGuia(guia.id, guia.habilitada)
                            }
                            className={`${
                              guia.habilitada === true ||
                              guia.habilitada === "t"
                                ? "text-gray-700 border-gray-700 hover:bg-gray-50"
                                : "text-green-600 border-green-600 hover:bg-green-50"
                            }`}
                          >
                            {guia.habilitada === true || guia.habilitada === "t"
                              ? "Deshabilitar"
                              : "Habilitar"}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {guia.archivo_pdf && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              guia.archivo_pdf &&
                              handleDownload(guia.archivo_pdf)
                            }
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {user?.role === "docente" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(guia.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
