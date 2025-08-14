// components/docente-dashboard.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Users, FileText, Settings, LogOut, GraduationCap, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PasswordChangeForm } from "@/components/password-change-form"

interface Materia {
  id: string
  nombre: string
  codigo: string
  creditos: number
  unidades: {
    id: number
    numero: number
    nombre: string
    duracion_horas: number
    estado: string
    descripcion?: string
    actividades: {
      id: number
      nombre: string
      tipo: string
      fecha: string
      descripcion?: string
    }[]
  }[]
  inscripciones?: { id: string; name: string }[]
}

interface Bitacora {
  id: string
  estudiante: { name: string }
  asignatura: { nombre: string }
  estado: string
}

interface User {
  id: string
  username: string
  name: string
  role: "docente" | "estudiante"
  email: string
}

interface DocenteDashboardProps {
  user: User
}

export function DocenteDashboard({ user }: DocenteDashboardProps) {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedMateriaId, setSelectedMateriaId] = useState<string | null>(null) // Estado para la materia seleccionada
  const [selectedUnidadId, setSelectedUnidadId] = useState<number | null>(null) // Estado para la unidad seleccionada

  // Datos quemados para materias de ejemplo con inscripciones y actividades por unidad
  const materiasEjemplo: Materia[] = [
    {
      id: "1",
      codigo: "INF-101",
      nombre: "Introducción a la Informática",
      creditos: 4,
      inscripciones: [
        { id: "e1", name: "Ana Gómez" },
        { id: "e2", name: "Luis Pérez" }
      ],
      unidades: [
        {
          id: 1,
          numero: 1,
          nombre: "Unidad 1: Conceptos Básicos",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Conceptos fundamentales de informática.",
          actividades: [
            { id: 1, nombre: "Tarea 1: Introducción a la Informática", tipo: "Tarea", fecha: "2025-08-15", descripcion: "Resolver ejercicios básicos de conceptos." },
            { id: 2, nombre: "Examen Parcial 1", tipo: "Examen", fecha: "2025-08-20", descripcion: "Evaluación de la Unidad 1." }
          ]
        },
        {
          id: 2,
          numero: 2,
          nombre: "Unidad 2: Hardware y Software",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Componentes de hardware y software.",
          actividades: [
            { id: 3, nombre: "Tarea 2: Hardware Básico", tipo: "Tarea", fecha: "2025-08-22", descripcion: "Identificar componentes de hardware." }
          ]
        },
        {
          id: 3,
          numero: 3,
          nombre: "Unidad 3: Redes Básicas",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Introducción a las redes.",
          actividades: [
            { id: 4, nombre: "Proyecto en Grupo", tipo: "Proyecto", fecha: "2025-09-01", descripcion: "Desarrollo de un esquema básico." }
          ]
        }
      ]
    },
    {
      id: "2",
      codigo: "MAT-201",
      nombre: "Matemáticas Discretas",
      creditos: 3,
      inscripciones: [
        { id: "e3", name: "María López" }
      ],
      unidades: [
        {
          id: 4,
          numero: 1,
          nombre: "Unidad 1: Conjuntos y Lógica",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Teoría de conjuntos y lógica propositional.",
          actividades: [
            { id: 5, nombre: "Tarea 1: Lógica Proposicional", tipo: "Tarea", fecha: "2025-08-18", descripcion: "Ejercicios de lógica." }
          ]
        },
        {
          id: 5,
          numero: 2,
          nombre: "Unidad 2: Grafos",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Introducción a los grafos.",
          actividades: [
            { id: 6, nombre: "Examen Parcial 2", tipo: "Examen", fecha: "2025-08-25", descripcion: "Evaluación de la Unidad 2." }
          ]
        },
        {
          id: 6,
          numero: 3,
          nombre: "Unidad 3: Árboles y Algoritmos",
          duracion_horas: 16,
          estado: "activa",
          descripcion: "Árboles y algoritmos básicos.",
          actividades: [
            { id: 7, nombre: "Presentación de Grafos", tipo: "Presentación", fecha: "2025-09-05", descripcion: "Exposición en clase." }
          ]
        }
      ]
    }
  ]

  const bitacorasEjemplo: Bitacora[] = [
    { id: "1", estudiante: { name: "Ana Gómez" }, asignatura: { nombre: "Introducción a la Informática" }, estado: "completada" },
    { id: "2", estudiante: { name: "Luis Pérez" }, asignatura: { nombre: "Matemáticas Discretas" }, estado: "borrador" },
    { id: "3", estudiante: { name: "María López" }, asignatura: { nombre: "Introducción a la Informática" }, estado: "en_sesion" }
  ]

  // Calcular estadísticas
  const totalEstudiantes = materiasEjemplo.reduce((sum, materia) => sum + (materia.inscripciones?.length || 0), 0)
  const totalUnidades = materiasEjemplo.reduce((sum, materia) => sum + (materia.unidades?.length || 0), 0)
  const bitacorasPendientes = bitacorasEjemplo.filter((b) => b.estado === "borrador" || b.estado === "en_sesion").length

  const selectedMateria = materiasEjemplo.find((m) => m.id === selectedMateriaId)
  const selectedUnidad = selectedMateria?.unidades.find((u) => u.id === selectedUnidadId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Docente</h1>
              <p className="text-gray-600">Bienvenido, {user.name}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Materias Asignadas</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materiasEjemplo.length}</div>
                  <p className="text-xs text-muted-foreground">Para este semestre</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estudiantes Totales</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEstudiantes}</div>
                  <p className="text-xs text-muted-foreground">En todas las materias</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bitácoras Pendientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bitacorasPendientes}</div>
                  <p className="text-xs text-muted-foreground">Por revisar</p>
                </CardContent>
              </Card>
            </div>

            {/* Resumen de materias */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Materias</CardTitle>
                <CardDescription>Tus materias asignadas para este semestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materiasEjemplo.map((materia) => (
                    <div key={materia.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{materia.nombre}</p>
                        <p className="text-sm text-gray-600">Código: {materia.codigo}</p>
                        <p className="text-sm text-gray-600">Créditos: {materia.creditos}</p>
                      </div>
                      <Badge variant="secondary">{materia.unidades.length} unidades</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materias" className="space-y-6">
            {/* Vista detallada de materias, unidades y actividades */}
            <Card>
              <CardHeader>
                <CardTitle>Materias Asignadas</CardTitle>
                <CardDescription>Selecciona una materia y unidad para ver detalles</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUnidadId && selectedMateria ? (
                  // Vista de actividades de la unidad seleccionada
                  <div>
                    <div className="mb-4 flex items-center">
                      <Button variant="ghost" onClick={() => setSelectedUnidadId(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a las unidades
                      </Button>
                    </div>
                    <h3 className="font-medium text-lg mb-4">{selectedMateria.nombre} ({selectedMateria.codigo})</h3>
                    <h4 className="font-medium mb-2">Unidad {selectedUnidad?.numero}: {selectedUnidad?.nombre}</h4>
                    <p className="text-sm text-gray-600 mb-4">Duración: {selectedUnidad?.duracion_horas} horas</p>
                    <p className="text-sm text-gray-600 mb-4">Descripción: {selectedUnidad?.descripcion}</p>
                   <Badge
  variant={selectedUnidad?.estado === "activa" ? "secondary" : "default"}
  className={selectedUnidad?.estado === "activa" ? "bg-green-500 text-white" : ""}
>
  {selectedUnidad?.estado}
</Badge>

                    {/* Sección de Actividades */}
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Actividades:</h4>
                      <div className="space-y-2">
                        {(selectedUnidad?.actividades ?? []).map((actividad) => (
                          <div key={actividad.id} className="p-2 bg-gray-50 rounded-md">
                            <p className="font-medium">{actividad.nombre}</p>
                            <p className="text-sm text-gray-600">Tipo: {actividad.tipo}</p>
                            <p className="text-sm text-gray-600">Fecha: {actividad.fecha}</p>
                            <p className="text-sm text-gray-600">Descripción: {actividad.descripcion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : selectedMateriaId ? (
                  // Vista de unidades de la materia seleccionada
                  <div>
                    <div className="mb-4 flex items-center">
                      <Button variant="ghost" onClick={() => setSelectedMateriaId(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a la lista de materias
                      </Button>
                    </div>
                    <h3 className="font-medium text-lg mb-4">{selectedMateria?.nombre} ({selectedMateria?.codigo})</h3>
                    <p className="text-sm text-gray-600 mb-4">Créditos: {selectedMateria?.creditos}</p>

                    {/* Sección de Unidades */}
                    <h4 className="font-medium mb-2">Unidades:</h4>
                    <div className="space-y-2">
                      {(selectedMateria?.unidades ?? []).map((unidad) => (
                        <div
                          key={unidad.id}
                          className="p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedUnidadId(unidad.id)}
                        >
                          <p className="font-medium">Unidad {unidad.numero}: {unidad.nombre}</p>
                          <p className="text-sm text-gray-600">Duración: {unidad.duracion_horas} horas</p>
                          <p className="text-sm text-gray-600">Descripción: {unidad.descripcion}</p>
                          <Badge variant={unidad.estado === "activa" ? "secondary" : "default"}>
  {unidad.estado}
</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Vista inicial de materias
                  <div className="space-y-4">
                    {materiasEjemplo.map((materia) => (
                      <div
                        key={materia.id}
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedMateriaId(materia.id)}
                      >
                        <div>
                          <p className="font-medium">{materia.nombre}</p>
                          <p className="text-sm text-gray-600">Código: {materia.codigo}</p>
                          <p className="text-sm text-gray-600">Créditos: {materia.creditos}</p>
                        </div>
                        <Badge variant="secondary">{materia.unidades.length} unidades</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitacoras" className="space-y-6">
            {/* Contenido de bitácoras */}
            <Card>
              <CardHeader>
                <CardTitle>Bitácoras</CardTitle>
                <CardDescription>Gestión de bitácoras de prácticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bitacorasEjemplo.map((bitacora) => (
                    <div key={bitacora.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Bitácora #{bitacora.id}</p>
                        <p className="text-sm text-gray-600">Estudiante: {bitacora.estudiante.name}</p>
                        <p className="text-sm text-gray-600">Materia: {bitacora.asignatura.nombre}</p>
                      </div>
                     <Badge variant={bitacora.estado === "completada" ? "secondary" : "default"}>
  {bitacora.estado}
</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            {/* Perfil del docente */}
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Información personal y configuración</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre</label>
                    <p className="text-gray-600">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rol</label>
                    <p className="text-gray-600 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">ID Usuario</label>
                    <p className="text-gray-600">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Materias Asignadas</label>
                    <p className="text-gray-600">{materiasEjemplo.length} materias</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Unidades</label>
                    <p className="text-gray-600">{totalUnidades} unidades</p>
                  </div>
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Resumen de actividad */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Actividad</CardTitle>
                <CardDescription>Estadísticas de tu actividad docente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{materiasEjemplo.length}</div>
                    <p className="text-sm text-gray-600">Materias Activas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{bitacorasEjemplo.filter(b => b.estado === 'completada').length}</div>
                    <p className="text-sm text-gray-600">Bitácoras Revisadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{bitacorasPendientes}</div>
                    <p className="text-sm text-gray-600">Pendientes de Revisión</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cambio de Contraseña */}
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
                <CardDescription>Cambiar contraseña y configuración de seguridad</CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}