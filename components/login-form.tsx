"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      if (!username || !password) {
        throw new Error("Todos los campos son obligatorios")
      }

      const res = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: username, password }),
      })

      const json = await res.json()
      
      if (!res.ok) {
        throw new Error(json.message || "Error al iniciar sesión")
      }

      console.log("Respuesta completa del backend:", json)
      console.log("Datos recibidos:", json.data)

      const { token, usuario } = json.data
      const { rol, nombre, id, correo } = usuario  // ← Extraer desde usuario

      // Debug: mostrar cada campo individualmente
      console.log("Token:", token)
      console.log("Rol:", rol) 
      console.log("Nombre:", nombre)
      console.log("ID:", id)
      console.log("Correo:", correo)

      // Validar que los datos necesarios estén presentes
      const missingFields = []
      if (!token) missingFields.push("token")
      if (!rol) missingFields.push("rol") 
      if (!nombre) missingFields.push("nombre")
      if (!id) missingFields.push("id")
      if (!correo) missingFields.push("correo")

      if (missingFields.length > 0) {
        throw new Error(`Datos de usuario incompletos. Faltan: ${missingFields.join(", ")}`)
      }

      // Crear objeto de usuario con la estructura correcta
      const userData = {
        id: id.toString(), // Asegurar que sea string
        username: correo,  // Usar correo como username
        name: nombre,
        role: rol as "docente" | "estudiante", // Type assertion para TypeScript
        email: correo      // Mapear correo a email
      }

      console.log("Datos del usuario a guardar:", userData) // Para debug

      // Guardar en el contexto
      await login(userData, token)
      
      // Redireccionar al dashboard
      router.push("/dashboard")
      
    } catch (err) {
      console.error("Error en login:", err)
      setError(err instanceof Error ? err.message : "Error de autenticación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa con tus credenciales del Banner</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Usuario/Email</Label>
            <Input
              id="username"
              type="email"
              placeholder="tu.email@universidad.edu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña del Banner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}