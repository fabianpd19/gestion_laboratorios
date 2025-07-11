"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, FileText, Settings, LogOut, Plus, CheckCircle } from "lucide-react"
import { BitacoraForm } from "@/components/bitacora-form"

interface User {
  id: string
  username: string
  name: string
  role: "docente" | "estudiante"
  email: string
}

interface EstudianteDashboardProps {
  user: User
}

export function EstudianteDashboard({ user }: EstudianteDashboardProps) {
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [showBitacoraForm, setShowBitacoraForm] = useState(false)

  // Datos simulados (aquí irán las APIs)
  const materias = [
    { id: 1, nombre: "Química Orgánica", codigo: "QUI-301", docente: "Dr. Juan Pérez" },
    { id: 2, nombre: "Física Experimental", codigo: "FIS-201", docente: "Dra. Ana Martínez" },
  ]

  const practicas = [
    { id: 1, nombre: "Síntesis de Aspirina", materia: "Química Orgánica", fecha: "2024-01-20", estado: "Pendiente" },
    { id: 2, nombre: "Medición de pH", materia: "Química Orgánica", fecha: "2024-01-15", estado: "Completada" },
    { id: 3, nombre: "Ley de Ohm", materia: "Física Experimental", fecha: "2024-01-18", estado: "En Progreso" },
  ]

  const misBitacoras = [
    { id: 1, practica: "Medición de pH", fecha: "2024-01-15", estado: "Enviada" },
    { id: 2, practica: "Ley de Ohm", fecha: "2024-01-18", estado: "Borrador" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel Estudiante</h1>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="practicas">Prácticas</TabsTrigger>
            <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Materias Inscritas</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materias.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Prácticas Pendientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{practicas.filter((p) => p.estado === "Pendiente").length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bitácoras Enviadas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{misBitacoras.filter((b) => b.estado === "Enviada").length}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Próximas Prácticas</CardTitle>
                <CardDescription>Prácticas programadas para esta semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practicas
                    .filter((p) => p.estado !== "Completada")
                    .map((practica) => (
                      <div key={practica.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{practica.nombre}</p>
                          <p className="text-sm text-gray-600">{practica.materia}</p>
                          <p className="text-xs text-gray-500">{practica.fecha}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              practica.estado === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {practica.estado}
                          </span>
                          <Button size="sm">Ver Detalles</Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Materias</CardTitle>
                <CardDescription>Materias inscritas este semestre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {materias.map((materia) => (
                    <Card key={materia.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                        <CardDescription>{materia.codigo}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <strong>Docente:</strong> {materia.docente}
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm">Ver Contenido</Button>
                            <Button size="sm" variant="outline">
                              Moodle
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="practicas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registro de Prácticas</CardTitle>
                <CardDescription>Todas tus prácticas de laboratorio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Práctica</th>
                        <th className="px-4 py-2 text-left">Materia</th>
                        <th className="px-4 py-2 text-left">Fecha</th>
                        <th className="px-4 py-2 text-left">Estado</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practicas.map((practica) => (
                        <tr key={practica.id} className="border-t">
                          <td className="px-4 py-2">{practica.nombre}</td>
                          <td className="px-4 py-2">{practica.materia}</td>
                          <td className="px-4 py-2">{practica.fecha}</td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                practica.estado === "Completada"
                                  ? "bg-green-100 text-green-800"
                                  : practica.estado === "En Progreso"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {practica.estado}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <Button size="sm" variant="outline">
                              Ver Guía
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitacoras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mis Bitácoras</CardTitle>
                <CardDescription>Gestiona tus bitácoras de prácticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={() => setShowBitacoraForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Bitácora
                  </Button>

                  <div className="space-y-4">
                    {misBitacoras.map((bitacora) => (
                      <div key={bitacora.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{bitacora.practica}</p>
                          <p className="text-sm text-gray-600">{bitacora.fecha}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              bitacora.estado === "Enviada"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {bitacora.estado}
                          </span>
                          <Button size="sm" variant="outline">
                            Editar
                          </Button>
                          <Button size="sm">Ver</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {showBitacoraForm && <BitacoraForm onClose={() => setShowBitacoraForm(false)} practicas={practicas} />}
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Datos personales y académicos</CardDescription>
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
                    <label className="text-sm font-medium">ID Estudiante</label>
                    <p className="text-gray-600">{user.id}</p>
                  </div>
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Libro del Estudiante</CardTitle>
                <CardDescription>Historial académico y calificaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Aquí se mostrará tu historial académico completo una vez que se integren las APIs del Banner.
                </p>
                <Button variant="outline" className="mt-4 bg-transparent">
                  Descargar Historial
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
