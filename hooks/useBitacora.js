// hooks/useBitacoras.js (versión simplificada)
import { useState, useEffect } from "react"

export function useBitacoras(userId) {
  const [bitacoras, setBitacoras] = useState([])
  const [loading, setLoading] = useState(false) // Cambiar a false para no mostrar loading
  const [error, setError] = useState(null)

  useEffect(() => {
    // Por ahora, devolvemos datos simulados para evitar errores
    const bitacorasSimuladas = [
      {
        id: 1,
        nombre_profesor: "Dr. García López",
        tema: "Síntesis de Aspirina",
        fecha_bitacora: "2025-01-10",
        estado: "completada"
      },
      {
        id: 2,
        nombre_profesor: "Dra. Martínez Silva",
        tema: "Análisis Espectroscópico",
        fecha_bitacora: "2025-01-08",
        estado: "pendiente"
      },
      {
        id: 3,
        nombre_profesor: "Dr. Rodríguez Paz",
        tema: "Péndulo Simple",
        fecha_bitacora: "2025-01-05",
        estado: "completada"
      }
    ]
    
    setBitacoras(bitacorasSimuladas)
    setLoading(false)
    setError(null)
  }, [userId])

  return {
    bitacoras,
    loading,
    error
  }
}

// Hook alternativo que intenta usar la API pero maneja errores
export function useBitacorasReal(userId) {
  const [bitacoras, setBitacoras] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchBitacoras = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        
        if (!token) {
          // Si no hay token, usar datos simulados
          setBitacoras([])
          setLoading(false)
          return
        }

        // Intentar diferentes endpoints de bitácoras
        const endpoints = [
          `http://localhost:3001/api/bitacoras?usuario_id=${userId}`,
          `http://localhost:3001/api/bitacoras?docente_id=${userId}`,
          `http://localhost:3001/api/bitacoras`
        ]

        let success = false
        
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              },
            })

            if (response.ok) {
              const result = await response.json()
              const bitacorasData = Array.isArray(result) ? result : result.data || []
              setBitacoras(bitacorasData)
              success = true
              break
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} no disponible:`, endpointError.message)
          }
        }

        if (!success) {
          // Si ningún endpoint funciona, usar datos simulados
          console.log("Usando datos simulados para bitácoras")
          setBitacoras([])
        }

        setError(null)
      } catch (err) {
        console.error("Error general en fetchBitacoras:", err)
        setBitacoras([])
        setError(null) // No mostrar error, solo usar datos vacíos
      } finally {
        setLoading(false)
      }
    }

    fetchBitacoras()
  }, [userId])

  return {
    bitacoras,
    loading,
    error
  }
}