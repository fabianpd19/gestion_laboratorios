import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Guia {
  id: number
  titulo: string
  laboratorio_id: number
  asignatura_id: number
  docente_id: number
  createdAt: string
  estado: string
}

interface Equipo {
  id: number
  nombre: string
}

interface EquipoFormProps {
  guias: Guia[]
  onClose: () => void
  onSubmit: (form: any) => void
}

export function EquipoForm({ guias, onClose, onSubmit }: EquipoFormProps) {
  const [guiaId, setGuiaId] = useState("")
  const [equiposDisponibles, setEquiposDisponibles] = useState<Equipo[]>([])

  const [form, setForm] = useState({
    guia_id: "",
    equipo_id: "",
    observaciones: ""
  })

  // Cuando cambia la guía, llenamos datos y pedimos equipos disponibles
  useEffect(() => {
    if (!guiaId) return

    const guia = guias.find((g) => g.id === Number(guiaId))
    if (guia) {
      setForm((prev) => ({
        ...prev,
        laboratorio_id: String(guia.laboratorio_id),
        asignatura_id: String(guia.asignatura_id),
        docente_id: String(guia.docente_id),
        createdAt: guia.createdAt ? guia.createdAt.split("T")[0] : "",
      }))
    }
  }, [guiaId, guias])

  // Cargar equipos disponibles al montar el componente
  useEffect(() => {
  const token = localStorage.getItem("token") // o donde lo guardes

  fetch(`http://localhost:3001/api/equipos`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Enviamos el token
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setEquiposDisponibles(data)
      } else if (Array.isArray(data.data)) {
        setEquiposDisponibles(data.data)
      } else {
        console.error("Formato inesperado:", data)
        setEquiposDisponibles([])
      }
    })
    .catch((err) => console.error("Error cargando equipos:", err))
}, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "guia_id") {
      setGuiaId(value) // Actualizar también guiaId cuando cambie guia_id
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mapear los datos del formulario a la nueva estructura
    const mappedData = {
      nombre: equiposDisponibles.find(eq => eq.id === Number(form.equipo_id))?.nombre || "",
      id_guia: Number(guiaId), // Usar guiaId en lugar de form.guia_id
      observacion: form.observaciones || "",
      estado: "disponible" // Valor por defecto
    }
    
    onSubmit(mappedData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Agregar equipo de laboratorio</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          
          {/* SELECT de Guía */}
          <div>
            <label className="block text-sm font-medium">Guía</label>
            <select
              name="guia_id"
              className="w-full border rounded px-2 py-1"
              value={guiaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una guía</option>
              {guias
                .filter((g) => g.estado === "activa")
                .map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.titulo}
                  </option>
                ))}
            </select>
          </div>

          {/* SELECT de equipos */}
          <div>
            <label className="block text-xs">Equipo</label>
            <select
              name="equipo_id"
              className="w-full border rounded px-2 py-1"
              value={form.equipo_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un equipo</option>
              {equiposDisponibles.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-xs">Observaciones</label>
            <input
              name="observaciones"
              className="w-full border rounded px-2 py-1"
              value={form.observaciones}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar equipo</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
