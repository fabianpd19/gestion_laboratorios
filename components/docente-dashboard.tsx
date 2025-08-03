"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { BookOpen, Users, FileText, Settings, LogOut, Download } from "lucide-react"

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
  const [usuariosOpen, setUsuariosOpen] = useState(false)
  const [labsOpen, setLabsOpen] = useState(false)
  const [usoOpen, setUsoOpen] = useState(false)

  // --- DATOS SIMULADOS ---
  // Para usar las APIs, descomenta el bloque de useEffect y useState correspondiente y coloca el endpoint correcto

  // USUARIOS
  // const [usuarios, setUsuarios] = useState([])
  // const [usuariosLoading, setUsuariosLoading] = useState(false)
  // const [usuariosError, setUsuariosError] = useState<string|null>(null)
  // useEffect(() => {
  //   setUsuariosLoading(true)
  //   fetch('/api/usuarios') // <-- Cambia por tu endpoint real
  //     .then(res => res.json())
  //     .then(data => setUsuarios(data))
  //     .catch(() => setUsuariosError('Error al cargar usuarios'))
  //     .finally(() => setUsuariosLoading(false))
  // }, [])
  const usuarios = [
    { id: 1, nombre: "Ana López", email: "ana@uni.edu", rol: "estudiante", activo: true, updated_at: "2024-07-01T10:00:00", laboratorios: "Lab Química, Lab Física" },
    { id: 2, nombre: "Luis Pérez", email: "luis@uni.edu", rol: "docente", activo: true, updated_at: "2024-07-02T09:30:00", laboratorios: "Lab Física" },
    { id: 3, nombre: "Marta Ruiz", email: "marta@uni.edu", rol: "estudiante", activo: false, updated_at: "2024-06-28T15:20:00", laboratorios: "Lab Química" },
  ];
  const [usuariosLoading] = useState(false)
  const [usuariosError] = useState<string|null>(null)

  // LABORATORIOS
  // const [labs, setLabs] = useState([])
  // const [labsLoading, setLabsLoading] = useState(false)
  // const [labsError, setLabsError] = useState<string|null>(null)
  // useEffect(() => {
  //   setLabsLoading(true)
  //   fetch('/api/laboratorios') // <-- Cambia por tu endpoint real
  //     .then(res => res.json())
  //     .then(data => setLabs(data))
  //     .catch(() => setLabsError('Error al cargar laboratorios'))
  //     .finally(() => setLabsLoading(false))
  // }, [])
  const labs = [
    { id: 1, nombre: "Lab Química", codigo: "LAB-Q01", ubicacion: "Edificio A, Piso 2", capacidad_maxima: 30, equipos_disponibles: [ { nombre: "Probetas" }, { nombre: "Balanza" } ], activo: true, responsable: "Dra. Ana Torres" },
    { id: 2, nombre: "Lab Física", codigo: "LAB-F01", ubicacion: "Edificio B, Piso 1", capacidad_maxima: 25, equipos_disponibles: [ { nombre: "Osciloscopio" }, { nombre: "Multímetro" } ], activo: true, responsable: "Dr. Luis Pérez" },
    { id: 3, nombre: "Lab Biología", codigo: "LAB-B01", ubicacion: "Edificio C, Piso 3", capacidad_maxima: 20, equipos_disponibles: [ { nombre: "Microscopio" } ], activo: false, responsable: "Dra. Marta Ruiz" },
  ];
  const [labsLoading] = useState(false)
  const [labsError] = useState<string|null>(null)

  // ASIGNATURAS
  // const [materias, setMaterias] = useState([])
  // useEffect(() => {
  //   fetch('/api/asignaturas') // <-- Cambia por tu endpoint real
  //     .then(res => res.json())
  //     .then(data => setMaterias(data))
  //     .catch(() => {/* manejar error */})
  // }, [])
  const materias = [
    { id: 1, nombre: "Química Orgánica", codigo: "QUI-301", estudiantes: 25, docente: "Dra. Ana Torres", laboratorio: "Lab Química", avance: "80%", proximaGuia: "Guía 5", estado: "En curso" },
    { id: 2, nombre: "Física Experimental", codigo: "FIS-201", estudiantes: 30, docente: "Dr. Luis Pérez", laboratorio: "Lab Física", avance: "60%", proximaGuia: "Guía 3", estado: "En curso" },
  ]

  const bitacorasRecientes = [
    { id: 1, estudiante: "Ana López", practica: "Síntesis de Aspirina", fecha: "2024-01-15", estado: "Completada" },
    { id: 2, estudiante: "Carlos Ruiz", practica: "Medición de pH", fecha: "2024-01-14", estado: "Pendiente" },
  ]

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

          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="materias">Materias</TabsTrigger>
            <TabsTrigger value="bitacoras">Bitácoras</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
          </TabsList>
          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes</CardTitle>
                <CardDescription>Visualiza y descarga reportes relacionados a tus materias y bitácoras.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Usuarios */}
                  <Dialog open={usuariosOpen} onOpenChange={handleOpenUsuarios}>
                    <Card className="shadow-none border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Usuarios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">Ver Reporte</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Reporte de Usuarios</DialogTitle>
                        <DialogDescription>Listado de usuarios registrados en el sistema</DialogDescription>
                      </DialogHeader>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" onClick={() => alert('Descargar reporte de usuarios (simulado)')}>Descargar Reporte</Button>
                    </div>
                      {usuariosLoading ? (
                        <div className="py-8 text-center">Cargando...</div>
                      ) : usuariosError ? (
                        <div className="py-8 text-center text-red-500">{usuariosError}</div>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-blue-50 border-blue-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-700">{usuarios.length}</div>
                                <div className="text-xs text-gray-600">Total Usuarios</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 border-green-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-700">{usuarios.filter(u => u.activo).length}</div>
                                <div className="text-xs text-gray-600">Usuarios Activos</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-red-50 border-red-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-700">{usuarios.filter(u => !u.activo).length}</div>
                                <div className="text-xs text-gray-600">Usuarios Inactivos</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-purple-50 border-purple-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-700">{usuarios.filter(u => u.rol === 'docente').length}</div>
                                <div className="text-xs text-gray-600">Docentes</div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 border">Nombre</th>
                                  <th className="px-3 py-2 border">Email</th>
                                  <th className="px-3 py-2 border">Tipo</th>
                                  <th className="px-3 py-2 border">Estado</th>
                                  <th className="px-3 py-2 border">Último Acceso</th>
                                  <th className="px-3 py-2 border">Laboratorios</th>
                                </tr>
                              </thead>
                              <tbody>
                                {usuarios.map((u) => (
                                  <tr key={u.id}>
                                    <td className="px-3 py-2 border">{u.nombre}</td>
                                    <td className="px-3 py-2 border">{u.email}</td>
                                    <td className="px-3 py-2 border capitalize">{u.rol}</td>
                                    <td className="px-3 py-2 border">{u.activo ? 'Activo' : 'Inactivo'}</td>
                                    <td className="px-3 py-2 border">{u.updated_at ? new Date(u.updated_at).toLocaleString() : '-'}</td>
                                    <td className="px-3 py-2 border">{u.laboratorios}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  {/* Laboratorios */}
                  <Dialog open={labsOpen} onOpenChange={handleOpenLabs}>
                    <Card className="shadow-none border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Laboratorios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">Ver Reporte</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Reporte de Laboratorios</DialogTitle>
                        <DialogDescription>Listado de laboratorios registrados en el sistema</DialogDescription>
                      </DialogHeader>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" onClick={() => alert('Descargar reporte de laboratorios (simulado)')}>Descargar Reporte</Button>
                    </div>
                      {labsLoading ? (
                        <div className="py-8 text-center">Cargando...</div>
                      ) : labsError ? (
                        <div className="py-8 text-center text-red-500">{labsError}</div>
                      ) : (
                        <>
                          {/* Cuadros resumen de laboratorios */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-blue-50 border-blue-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-700">{labs.length}</div>
                                <div className="text-xs text-gray-600">Total Laboratorios</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-green-50 border-green-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-700">{labs.filter(l => l.activo).length}</div>
                                <div className="text-xs text-gray-600">Laboratorios Activos</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-yellow-50 border-yellow-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-700">{labs.filter(l => l.estado === 'mantenimiento' || l.activo === false).length}</div>
                                <div className="text-xs text-gray-600">En Mantenimiento</div>
                              </CardContent>
                            </Card>
                            <Card className="bg-purple-50 border-purple-200">
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-700">
                                  {/* Ocupación promedio simulada: (usosLaboratorio.length / labs.length) * 100 % */}
                                  {labs.length > 0 ? `${Math.round((usosLaboratorio.length / labs.length) * 100)}%` : '0%'}
                                </div>
                                <div className="text-xs text-gray-600">Ocupación Promedio</div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 border">Laboratorio</th>
                                  <th className="px-3 py-2 border">Código</th>
                                  <th className="px-3 py-2 border">Ubicación</th>
                                  <th className="px-3 py-2 border">Capacidad</th>
                                  <th className="px-3 py-2 border">Equipos</th>
                                  <th className="px-3 py-2 border">Estado</th>
                                  <th className="px-3 py-2 border">Responsable</th>
                                </tr>
                              </thead>
                              <tbody>
                                {labs.map((lab) => (
                                  <tr key={lab.id}>
                                    <td className="px-3 py-2 border">{lab.nombre}</td>
                                    <td className="px-3 py-2 border">{lab.codigo}</td>
                                    <td className="px-3 py-2 border">{lab.ubicacion}</td>
                                    <td className="px-3 py-2 border">{lab.capacidad_maxima}</td>
                                    <td className="px-3 py-2 border">{Array.isArray(lab.equipos_disponibles) ? lab.equipos_disponibles.map((e:any) => e.nombre).join(', ') : '-'}</td>
                                    <td className="px-3 py-2 border">{lab.activo ? 'Activo' : 'Inactivo'}</td>
                                    <td className="px-3 py-2 border">{lab.responsable}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                  {/* Asignaturas */}
                  <Dialog open={asigOpen} onOpenChange={setAsigOpen}>
                    <Card className="shadow-none border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Asignaturas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">Ver Reporte</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Reporte de Asignaturas</DialogTitle>
                        <DialogDescription>Listado de asignaturas y su avance</DialogDescription>
                      </DialogHeader>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" onClick={() => alert('Descargar reporte de asignaturas (simulado)')}>Descargar Reporte</Button>
                    </div>
                      {/* Cuadros resumen de asignaturas */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-700">{materias.length}</div>
                            <div className="text-xs text-gray-600">Total Asignaturas</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-700">{materias.filter(m => m.estado === 'En curso').length}</div>
                            <div className="text-xs text-gray-600">Asignaturas Activas</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-purple-50 border-purple-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-700">{materias.reduce((sum, m) => {
                              // Extraer número de la cadena avance (ej: "80%")
                              const match = m.avance.match(/(\d+)%/);
                              return sum + (match ? parseInt(match[1]) / 20 : 0); // Suponiendo 5 guías por materia
                            }, 0)}</div>
                            <div className="text-xs text-gray-600">Guías Ejecutadas</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-yellow-50 border-yellow-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-700">
                              {/* Porcentaje de ejecución promedio */}
                              {materias.length > 0 ? `${Math.round(materias.reduce((sum, m) => {
                                const match = m.avance.match(/(\d+)%/);
                                return sum + (match ? parseInt(match[1]) : 0);
                              }, 0) / materias.length)}%` : '0%'}
                            </div>
                            <div className="text-xs text-gray-600">Porcentaje de Ejecución</div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 border">Asignatura</th>
                              <th className="px-3 py-2 border">Docente</th>
                              <th className="px-3 py-2 border">Laboratorio</th>
                              <th className="px-3 py-2 border">Avance Guías</th>
                              <th className="px-3 py-2 border">Próxima Guía</th>
                              <th className="px-3 py-2 border">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {materias.map((m) => (
                              <tr key={m.id}>
                                <td className="px-3 py-2 border">{m.nombre}</td>
                                <td className="px-3 py-2 border">{m.docente}</td>
                                <td className="px-3 py-2 border">{m.laboratorio}</td>
                                <td className="px-3 py-2 border">{m.avance}</td>
                                <td className="px-3 py-2 border">{m.proximaGuia}</td>
                                <td className="px-3 py-2 border">{m.estado}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Uso de Laboratorios */}
                  <Dialog open={usoOpen} onOpenChange={setUsoOpen}>
                    <Card className="shadow-none border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Uso de Laboratorios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full">Ver Reporte</Button>
                        </DialogTrigger>
                      </CardContent>
                    </Card>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Reporte de Uso de Laboratorios</DialogTitle>
                        <DialogDescription>Listado de usos de laboratorios registrados</DialogDescription>
                      </DialogHeader>
                    <div className="flex justify-end mb-4">
                      <Button variant="outline" onClick={() => alert('Descargar reporte de uso de laboratorios (simulado)')}>Descargar Reporte</Button>
                    </div>
                      {/* Cuadros resumen de uso de laboratorios */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-700">{usosLaboratorio.length}</div>
                            <div className="text-xs text-gray-600">Total Registros</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-700">{
                              (() => {
                                // Contar equipos únicos utilizados
                                const equiposSet = new Set<string>();
                                usosLaboratorio.forEach(u => {
                                  if (u.equipos) {
                                    u.equipos.split(',').map(e => e.trim()).forEach(e => equiposSet.add(e));
                                  }
                                });
                                return equiposSet.size;
                              })()
                            }</div>
                            <div className="text-xs text-gray-600">Equipos Utilizados</div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-3 py-2 border">Fecha</th>
                              <th className="px-3 py-2 border">Laboratorio</th>
                              <th className="px-3 py-2 border">Asignatura</th>
                              <th className="px-3 py-2 border">Docente</th>
                              <th className="px-3 py-2 border">Guía Ejecutada</th>
                              <th className="px-3 py-2 border">Equipos</th>
                              <th className="px-3 py-2 border">Horarios</th>
                              <th className="px-3 py-2 border">Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usosLaboratorio.map((u) => (
                              <tr key={u.id}>
                                <td className="px-3 py-2 border">{u.fecha}</td>
                                <td className="px-3 py-2 border">{u.laboratorio}</td>
                                <td className="px-3 py-2 border">{u.asignatura}</td>
                                <td className="px-3 py-2 border">{u.docente}</td>
                                <td className="px-3 py-2 border">{u.guia}</td>
                                <td className="px-3 py-2 border">{u.equipos}</td>
                                <td className="px-3 py-2 border">{u.horarios}</td>
                                <td className="px-3 py-2 border">{u.estado}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Materias</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{materias.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {materias.reduce((sum, materia) => sum + materia.estudiantes, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bitácoras Pendientes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bitacoras.filter((b) => b.estado === "pendiente").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Bitácoras Recientes</CardTitle>
                <CardDescription>Últimas actividades de los estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bitacoras.map((bitacora) => (
                    <div key={bitacora.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{bitacora.titulo_laboratorio}</p>
                        <p className="text-sm text-gray-600">{bitacora.tema}</p>
                        <p className="text-xs text-gray-500">{bitacora.fecha_bitacora}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            bitacora.estado === "completada"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bitacora.estado}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
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
                <CardDescription>Materias que impartes este semestre</CardDescription>
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{materia.estudiantes} estudiantes</span>
                          <Button size="sm">Ver Detalles</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bitacoras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Bitácoras</CardTitle>
                <CardDescription>Administra las bitácoras de prácticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button>Generar Nueva Bitácora</Button>
                    <Button variant="outline">Exportar Reportes</Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Estudiante</th>
                          <th className="px-4 py-2 text-left">Práctica</th>
                          <th className="px-4 py-2 text-left">Fecha</th>
                          <th className="px-4 py-2 text-left">Estado</th>
                          <th className="px-4 py-2 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bitacoras.map((bitacora) => (
                          <tr key={bitacora.id} className="border-t">
                            <td className="px-4 py-2">{bitacora.nombre_profesor}</td>
                            <td className="px-4 py-2">{bitacora.tema}</td>
                            <td className="px-4 py-2">{bitacora.fecha_bitacora}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  bitacora.estado === "completada"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {bitacora.estado}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  Ver
                                </Button>
                                <Button size="sm" variant="outline">
                                  Descargar
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Perfil</CardTitle>
                <CardDescription>Datos personales y configuración</CardDescription>
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
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
