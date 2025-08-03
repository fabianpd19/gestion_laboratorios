"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  name: string
  role: "docente" | "estudiante"
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, token: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Función para verificar y validar el token guardado
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")
        
        if (savedToken && savedUser) {
          // Verificar que el token sea válido haciendo una petición al backend
          const response = await fetch("http://localhost:3001/api/usuarios/verify", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${savedToken}`,
              "Content-Type": "application/json"
            }
          })
          
          if (response.ok) {
            // Token válido, restaurar sesión
            const parsedUser = JSON.parse(savedUser)
            setToken(savedToken)
            setUser(parsedUser)
          } else {
            // Token inválido, limpiar datos
            localStorage.removeItem("token")
            localStorage.removeItem("user")
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        // En caso de error, limpiar datos
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (userData: User, token: string) => {
    setUser(userData)
    setToken(token)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    // Redirect to login page
    window.location.href = "/"
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}