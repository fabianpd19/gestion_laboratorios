import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { useDetalleMateria } from "@/hooks/useDocenteMaterias"
import { AgregarGuiaForm } from "@/components/agregar-guia-form"

type DetalleMateriaProps = {
  docenteId: string | number
  materiaId: string | number
  onBack: () => void
}

type Materia = {
  nombre: string
  codigo: string
  departamento: string
  carrera: string
  creditos: number
  semestre: number
}

type Guia = {
  id: string | number
  titulo: string
  descripcion?: string
  estado: string | number
  createdAt: string
}

type Unidad = {
  numero: number
  nombre: string
  guias: Guia[]
}

type Estudiante = {
  id: string | number
  nombre: string
  correo: string
  programa_academico?: string
}

type Estadisticas = {
  totalEstudiantes: number
  totalGuias: number
  guiasPorUnidad: { unidad: number, cantidad: number }[]
}

type DetalleMateriaType = {
  materia: Materia
  estudiantes: Estudiante[]
  unidades: Unidad[]
  estadisticas: Estadisticas
}

export function DetalleMateria({ docenteId, materiaId, onBack }: DetalleMateriaProps) {
  const { detalle, loading, error } = useDetalleMateria(docenteId, materiaId) as { detalle: DetalleMateriaType | null, loading: boolean, error: string | null }
  const [unidadSeleccionada, setUnidadSeleccionada] = useState("1")
  const [showGuiaForm, setShowGuiaForm] = useState(false)
  const [unidadParaGuia, setUnidadParaGuia] = useState(1)

  const handleAgregarGuia = (unidad = 1) => {
    setUnidadParaGuia(unidad)
    setShowGuiaForm(true)
  }

  const handleGuiaSuccess = () => {
    // Aquí podrías refrescar los datos si tienes una función de refetch
    setShowGuiaForm(false)
    // window.location.reload() // Opción temporal para refrescar
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando detalle de materia...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-medium mb-2">Error al cargar</h3>
          <p>{error}</p>
          <Button onClick={onBack} className="mt-4">Volver</Button>
        </div>
      </Card>
    )
  }

  if (!detalle) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>No se encontró información de la materia</p>
          <Button onClick={onBack} className="mt-4">Volver</Button>
        </div>
      </Card>
    )
  }

  const { materia, estudiantes, unidades, estadisticas } = detalle

  const getEstadoBadge = (estado: string | number) => {
    const estados = {
      borrador: { color: 'bg-gray-100 text-gray-800', text: 'Borrador' },
      publicada: { color: 'bg-green-100 text-green-800', text: 'Publicada' },
      revision: { color: 'bg-yellow-100 text-yellow-800', text: 'En Revisión' }
    }
    type EstadoKey = keyof typeof estados;
    const key = String(estado) as EstadoKey;
    return estados[key] ?? estados['borrador'];
  }

  return (
    <div className="space-y-6">
      {/* Formulario para agregar guía */}
      {showGuiaForm && (
        <AgregarGuiaForm
          onClose={() => setShowGuiaForm(false)}
          docenteId={String(docenteId)}
          materiaId={String(materiaId)}
          unidadSeleccionada={unidadParaGuia}
          onSuccess={handleGuiaSuccess}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" onClick={onBack} className="p-2">
              ←
            </Button>
            <h1 className="text-2xl font-bold">{materia.nombre}</h1>
          </div>
          <p className="text-gray-600">{materia.codigo} • {materia.departamento}</p>
        </div>
        <Button onClick={() => handleAgregarGuia(parseInt(unidadSeleccionada))}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Guía
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalEstudiantes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guías</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalGuias}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materia.creditos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semestre</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materia.semestre}°</div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal */}
      <Tabs defaultValue="unidades">
        <TabsList>
          <TabsTrigger value="unidades">Unidades y Guías</TabsTrigger>
          <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="unidades" className="space-y-6">
          {/* Selector de unidades */}
          <div className="flex gap-2">
            {unidades.map((unidad) => (
              <Button
                key={unidad.numero}
                variant={unidadSeleccionada === unidad.numero.toString() ? "default" : "outline"}
                onClick={() => setUnidadSeleccionada(unidad.numero.toString())}
                className="flex items-center gap-2"
              >
                {unidad.nombre}
                <Badge variant="secondary" className="ml-2">
                  {unidad.guias.length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Contenido de la unidad seleccionada */}
          {unidades.map((unidad) => (
            unidad.numero.toString() === unidadSeleccionada && (
              <Card key={unidad.numero}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{unidad.nombre}</CardTitle>
                      <CardDescription>
                        {unidad.guias.length} guías de laboratorio
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleAgregarGuia(unidad.numero)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Guía
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {unidad.guias.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-30" />
                      <p>No hay guías en esta unidad</p>
                      <p className="text-sm">Agrega la primera guía de laboratorio</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {unidad.guias.map((guia) => {
                        const estadoBadge = getEstadoBadge(guia.estado)
                        return (
                          <div
                            key={guia.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{guia.titulo}</h4>
                                <Badge className={estadoBadge.color}>
                                  {estadoBadge.text}
                                </Badge>
                              </div>
                              {guia.descripcion && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {guia.descripcion}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Creado: {new Date(guia.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          ))}
        </TabsContent>

        <TabsContent value="estudiantes">
          <Card>
            <CardHeader>
              <CardTitle>Estudiantes Inscritos</CardTitle>
              <CardDescription>
                {estudiantes.length} estudiantes inscritos en esta materia
              </CardDescription>
            </CardHeader>
            <CardContent>
              {estudiantes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-30" />
                  <p>No hay estudiantes inscritos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {estudiantes.map((estudiante) => (
                    <div
                      key={estudiante.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{estudiante.nombre}</h4>
                        <p className="text-sm text-gray-600">{estudiante.correo}</p>
                        {estudiante.programa_academico && (
                          <p className="text-xs text-gray-500">
                            {estudiante.programa_academico}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Ver Perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Unidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estadisticas.guiasPorUnidad.map((unidadStat) => (
                    <div key={unidadStat.unidad} className="flex items-center justify-between">
                      <span>Unidad {unidadStat.unidad}</span>
                      <Badge variant="outline">{unidadStat.cantidad} guías</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Carrera:</span>
                    <span className="font-medium">{materia.carrera}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departamento:</span>
                    <span className="font-medium">{materia.departamento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créditos:</span>
                    <span className="font-medium">{materia.creditos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Semestre:</span>
                    <span className="font-medium">{materia.semestre}°</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}