"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function CambiarPasswordForm() {
  const { user, isOAuthUser, logout, token } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    // Validaciones
    if (!isOAuthUser && !currentPassword) {
      setError("Debes ingresar tu contraseña actual")
      return
    }
    
    if (!newPassword) {
      setError("Debes ingresar una nueva contraseña")
      return
    }
    
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    
    try {
      setLoading(true)
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/usuarios/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          currentPassword: isOAuthUser ? null : currentPassword,
          newPassword,
          isOAuthUser
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("No autorizado. Redirigiendo al inicio de sesión...")
          setTimeout(() => {
            logout()
          }, 2000)
          return
        } else {
          throw new Error(data.message || "Error al cambiar la contraseña")
        }
      }
      
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      // Si el cambio fue exitoso, mostrar mensaje de éxito y preparar para cerrar sesión
      setTimeout(() => {
        logout()
      }, 3000)
      
    } catch (err: any) {
      setError(err.message || "Error al cambiar la contraseña")
    } finally {
      setLoading(false)
    }
  }
  
  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Contraseña actualizada correctamente. Se cerrará tu sesión en unos segundos para aplicar los cambios...
        </AlertDescription>
      </Alert>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}
      
      {isOAuthUser ? (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Tu cuenta está vinculada a {user?.provider}. Al establecer una contraseña, podrás iniciar sesión 
            tanto con {user?.provider} como con tu correo y contraseña.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Contraseña actual</Label>
          <Input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nueva contraseña</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Procesando..." : "Cambiar contraseña"}
      </Button>
    </form>
  )
}