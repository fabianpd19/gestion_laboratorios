import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, Send } from "lucide-react"

interface GuiaFormProps {
  onClose: () => void
  docenteId: string
  materiaId: string
  unidadSeleccionada?: number
  onSuccess: () => void
}

export function AgregarGuiaForm({ onClose, docenteId, materiaId, unidadSeleccionada = 1, onSuccess }: GuiaFormProps) {
  interface Laboratorio {
    id: number | string
    nombre: string
    codigo?: string
  }

  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    objetivos: "",
    fundamento_teorico: "",
    procedimiento: "",
    resultados_esperados: "",
    criterios_evaluacion: "",
    bibliografia: "",
    laboratorio_id: "",
    duracion_estimada: "",
    nivel_dificultad: "1",
    materiales_requeridos: "",
    unidad: unidadSeleccionada
  })

  // Cargar laboratorios disponibles
  useEffect(() => {
    const fetchLaboratorios = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:3001/api/laboratorios", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (response.ok) {
          const result = await response.json()
          setLaboratorios(Array.isArray(result) ? result : result.data || [])
        }
      } catch (error) {
        console.error("Error loading laboratories:", error)
      }
    }
    fetchLaboratorios()
  }, [])

  const handleSubmit = async (e: React.FormEvent, action: "save" | "publish") => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      
      // Preparar datos
      const guiaData = {
        ...formData,
        duracion_estimada: parseInt(formData.duracion_estimada) || null,
        nivel_dificultad: parseInt(formData.nivel_dificultad) || 1,
        materiales_requeridos: formData.materiales_requeridos
          .split('\n')
          .filter(item => item.trim() !== '')
          .map(item => item.trim()),
        estado: action === "publish" ? "publicada" : "borrador"
      }

      const response = await fetch(
        `http://localhost:3001/api/docente-materias/${docenteId}/${materiaId}/guias`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(guiaData)
        }
      )

      if (response.ok) {
        const result = await response.json()
        alert(`Guía ${action === "publish" ? "publicada" : "guardada como borrador"} exitosamente`)
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Error al crear guía")
      }
    } catch (error) {
      console.error("Error creating guide:", error)
      alert(`Error: ${typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Nueva Guía de Laboratorio</CardTitle>
              <CardDescription>Unidad {unidadSeleccionada} - Completa todos los campos requeridos</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="titulo">Título de la Guía *</Label>
                <Input
                  id="titulo"
                  placeholder="Ej: Práctica de Destilación Simple"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="laboratorio">Laboratorio *</Label>
                <Select 
                  value={formData.laboratorio_id} 
                  onValueChange={(value) => handleInputChange("laboratorio_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {laboratorios.map((lab) => (
                      <SelectItem key={lab.id} value={lab.id.toString()}>
                        {lab.nombre} - {lab.codigo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unidad">Unidad</Label>
                <Select 
                  value={formData.unidad.toString()} 
                  onValueChange={(value) => handleInputChange("unidad", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Unidad 1</SelectItem>
                    <SelectItem value="2">Unidad 2</SelectItem>
                    <SelectItem value="3">Unidad 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duracion">Duración (minutos)</Label>
                <Input
                  id="duracion"
                  type="number"
                  placeholder="120"
                  value={formData.duracion_estimada}
                  onChange={(e) => handleInputChange("duracion_estimada", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="nivel">Nivel de Dificultad</Label>
                <Select 
                  value={formData.nivel_dificultad} 
                  onValueChange={(value) => handleInputChange("nivel_dificultad", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Básico</SelectItem>
                    <SelectItem value="2">Intermedio</SelectItem>
                    <SelectItem value="3">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción general de la práctica..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={3}
              />
            </div>

            {/* Objetivos */}
            <div>
              <Label htmlFor="objetivos">Objetivos *</Label>
              <Textarea
                id="objetivos"
                placeholder="Describe los objetivos de aprendizaje de la práctica..."
                value={formData.objetivos}
                onChange={(e) => handleInputChange("objetivos", e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Fundamento teórico */}
            <div>
              <Label htmlFor="fundamento">Fundamento Teórico</Label>
              <Textarea
                id="fundamento"
                placeholder="Marco teórico y conceptos necesarios para la práctica..."
                value={formData.fundamento_teorico}
                onChange={(e) => handleInputChange("fundamento_teorico", e.target.value)}
                rows={4}
              />
            </div>

            {/* Materiales */}
            <div>
              <Label htmlFor="materiales">Materiales y Equipos Requeridos *</Label>
              <Textarea
                id="materiales"
                placeholder="Lista los materiales necesarios (uno por línea)&#10;Ej:&#10;Beaker 250mL&#10;Probeta graduada&#10;Termómetro digital"
                value={formData.materiales_requeridos}
                onChange={(e) => handleInputChange("materiales_requeridos", e.target.value)}
                rows={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Escribe cada material en una línea separada
              </p>
            </div>

            {/* Procedimiento */}
            <div>
              <Label htmlFor="procedimiento">Procedimiento *</Label>
              <Textarea
                id="procedimiento"
                placeholder="Describe paso a paso el procedimiento a seguir..."
                value={formData.procedimiento}
                onChange={(e) => handleInputChange("procedimiento", e.target.value)}
                rows={8}
                required
              />
            </div>

            {/* Resultados esperados */}
            <div>
              <Label htmlFor="resultados">Resultados Esperados</Label>
              <Textarea
                id="resultados"
                placeholder="Describe los resultados que se esperan obtener..."
                value={formData.resultados_esperados}
                onChange={(e) => handleInputChange("resultados_esperados", e.target.value)}
                rows={4}
              />
            </div>

            {/* Criterios de evaluación */}
            <div>
              <Label htmlFor="criterios">Criterios de Evaluación</Label>
              <Textarea
                id="criterios"
                placeholder="Define los criterios y rúbrica de evaluación..."
                value={formData.criterios_evaluacion}
                onChange={(e) => handleInputChange("criterios_evaluacion", e.target.value)}
                rows={4}
              />
            </div>

            {/* Bibliografía */}
            <div>
              <Label htmlFor="bibliografia">Bibliografía</Label>
              <Textarea
                id="bibliografia"
                placeholder="Referencias bibliográficas y recursos adicionales..."
                value={formData.bibliografia}
                onChange={(e) => handleInputChange("bibliografia", e.target.value)}
                rows={3}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => handleSubmit(e, "save")} 
                className="flex-1"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Guardando..." : "Guardar Borrador"}
              </Button>
              <Button 
                type="button" 
                onClick={(e) => handleSubmit(e, "publish")} 
                className="flex-1"
                disabled={loading}
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Publicando..." : "Publicar Guía"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}