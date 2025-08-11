"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CambiarPasswordForm } from "@/components/perfil/cambiar-password-form"

export default function PerfilPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          Regresar al Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del perfil */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-center">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Tipo de cuenta</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user.provider === 'local' ? 'Cuenta local' : `Cuenta de ${user.provider}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Pestañas de configuración */}
        <div className="md:col-span-2">
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Cambiar Contraseña</TabsTrigger>
              <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                  <CambiarPasswordForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Próximamente podrás personalizar tu experiencia en la plataforma.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}