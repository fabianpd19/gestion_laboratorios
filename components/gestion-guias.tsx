"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Guia {
  id: number;
  titulo: string;
  descripcion?: string;
  parcial: string;
  archivo_pdf?: string | null;
}

export default function GestionGuias({ materiaId }: { materiaId: number }) {
  const { token, user } = useAuth();
  const [guias, setGuias] = useState<Guia[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [parcial, setParcial] = useState("1");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [laboratorios, setLaboratorios] = useState<any[]>([]);
  const [laboratorioId, setLaboratorioId] = useState("");

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (materiaId) fetchGuias();
  }, [materiaId]);

  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3001/api/laboratorios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const result = await response.json();
          setLaboratorios(Array.isArray(result) ? result : result.data || []);
        }
      } catch (error) {
        console.error("Error loading laboratories:", error);
      }
    };
    fetchLaboratorios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas de campos
    if (!titulo.trim()) {
      toast({
        title: "Error",
        description: "Debes ingresar un título",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      titulo,
      descripcion,
      parcial: String(parcial),
      laboratorio_id: String(laboratorioId),
      asignatura_id: String(materiaId),
      estado: "borrador",
      archivo_pdf: null, // por ahora solo almacenamos la ruta o null
    };

    try {
      console.log("Payload enviado:", payload);

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
          title: "Guía creada",
          description: "La guía se ha subido correctamente",
        });
        setTitulo("");
        setDescripcion("");
        setArchivo(null);
        fetchGuias(); // refresca la lista
      } else {
        toast({
          title: "Error",
          description: data.message || "No se pudo crear la guía",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      });
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
        toast({ title: "Guía eliminada" });
        fetchGuias();
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la guía",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al eliminar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subir nueva Guía</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <Textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <select
              value={parcial}
              onChange={(e) => setParcial(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="1">Parcial 1</option>
              <option value="2">Parcial 2</option>
              <option value="3">Parcial 3</option>
            </select>
            {/* Laboratorio */}
            <select
              value={laboratorioId}
              onChange={(e) => setLaboratorioId(e.target.value)}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Seleccione laboratorio</option>
              {laboratorios.map((lab) => (
                <option key={lab.id} value={lab.id}>
                  {lab.nombre}
                </option>
              ))}
            </select>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
            <Button type="submit">Subir Guía</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guías existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Cargando...</p>
          ) : guias.length === 0 ? (
            <p>No hay guías registradas.</p>
          ) : (
            <ul className="space-y-2">
              {guias.map((guia) => (
                <li
                  key={guia.id}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <div>
                    <p className="font-medium">{guia.titulo}</p>
                    <p className="text-sm text-gray-600">
                      Parcial {guia.parcial}
                    </p>
                  </div>
                  <div className="space-x-2">
                    {guia.archivo_pdf && (
                      <a
                        href={`http://localhost:3001/${guia.archivo_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Descargar
                      </a>
                    )}
                    {user?.role === "docente" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(guia.id)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
