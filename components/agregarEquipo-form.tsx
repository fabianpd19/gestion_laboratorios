import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save } from "lucide-react"

interface EquipoFormProps {
  onClose: () => void
  guias: any[]
  onSubmit: (formData: any) => void
}

export function EquipoForm({ onClose, guias, onSubmit }: EquipoFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    codigo_inventario: "",
    estado: "disponible",
    laboratorio_id: "",
    fecha_adquisicion: "",
    valor_adquisicion: "",
    observaciones: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agregar Nuevo Equipo</CardTitle>
              <CardDescription>Registra un nuevo equipo de laboratorio</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="nombre">Nombre del Equipo *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Microscopio óptico"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  placeholder="Ej: Olympus"
                  value={formData.marca}
                  onChange={(e) => handleInputChange("marca", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  placeholder="Ej: CX23"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="numero_serie">Número de Serie</Label>
                <Input
                  id="numero_serie"
                  placeholder="Número único del equipo"
                  value={formData.numero_serie}
                  onChange={(e) => handleInputChange("numero_serie", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="codigo_inventario">Código de Inventario</Label>
                <Input
                  id="codigo_inventario"
                  placeholder="Código interno"
                  value={formData.codigo_inventario}
                  onChange={(e) => handleInputChange("codigo_inventario", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="en_uso">En Uso</SelectItem>
                    <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
                    <SelectItem value="dañado">Dañado</SelectItem>
                    <SelectItem value="fuera_servicio">Fuera de Servicio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="laboratorio_id">Laboratorio</Label>
                <Select 
                  value={formData.laboratorio_id} 
                  onValueChange={(value) => handleInputChange("laboratorio_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona laboratorio" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Aquí deberías cargar los laboratorios desde tu API */}
                    <SelectItem value="1">Laboratorio de Química</SelectItem>
                    <SelectItem value="2">Laboratorio de Física</SelectItem>
                    <SelectItem value="3">Laboratorio de Biología</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha_adquisicion">Fecha de Adquisición</Label>
                <Input
                  id="fecha_adquisicion"
                  type="date"
                  value={formData.fecha_adquisicion}
                  onChange={(e) => handleInputChange("fecha_adquisicion", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="valor_adquisicion">Valor de Adquisición</Label>
                <Input
                  id="valor_adquisicion"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.valor_adquisicion}
                  onChange={(e) => handleInputChange("valor_adquisicion", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Descripción detallada del equipo..."
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                placeholder="Observaciones adicionales..."
                value={formData.observaciones}
                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Agregar Equipo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function handleInputChange(arg0: string, value: string): void {
  throw new Error("Function not implemented.")
}
