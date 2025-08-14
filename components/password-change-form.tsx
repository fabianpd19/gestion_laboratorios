"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { user, logout, isOAuthUser, token } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    if (!token) {
      setError("No hay sesión activa")
      setLoading(false)
      return
    }

    try {
      // Validaciones
      if (!isOAuthUser && !currentPassword) {
        throw new Error("La contraseña actual es requerida")
      }
      
      if (newPassword.length < 6) {
        throw new Error("La nueva contraseña debe tener al menos 6 caracteres")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      // Realizar petición al servidor
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordActual: isOAuthUser ? undefined : currentPassword,
          passwordNueva: newPassword,
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("La contraseña actual es incorrecta")
        }
        throw new Error("Error al cambiar la contraseña")
      }

      setSuccess(true)
      
      // Esperar un momento antes de cerrar la sesión
      setTimeout(() => {
        logout()
        router.push("/")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambiar Contraseña</CardTitle>
        <CardDescription>
          {isOAuthUser 
            ? "Establece una contraseña para tu cuenta"
            : "Ingresa tu contraseña actual y la nueva contraseña"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isOAuthUser && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Tu contraseña actual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
              Contraseña actualizada exitosamente. Se cerrará tu sesión en breve...
            </div>
          )}

          <Button 
            type="submit" 
            className={cn("w-full", success && "bg-green-500 hover:bg-green-600")} 
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cambiando contraseña...
              </>
            ) : success ? (
              "¡Contraseña Actualizada!"
            ) : (
              "Cambiar Contraseña"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
