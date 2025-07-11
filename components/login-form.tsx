"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  // const [userType, setUserType] = useState("")
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

    const res = await fetch("http://localhost:3001/api/usuarios/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
    })

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.message || "Error al iniciar sesión")
    }

    const { token, rol, nombre, id, email } = json.data

  /*   if (rol !== userType) {
      throw new Error("El tipo de usuario no coincide con el rol asignado")
    } */

    localStorage.setItem("token", token)
    await login({ id, username: email, name: nombre, role: rol, email })

    router.push("/dashboard")
  } catch (err) {
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
          {/* <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuario</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="docente">Docente</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

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

        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <p className="font-medium">Usuarios de prueba:</p>
          <p>Docente: docente@universidad.edu / 123456</p>
          <p>Estudiante: estudiante@universidad.edu / 123456</p>
        </div>
      </CardContent>
    </Card>
  )
}
