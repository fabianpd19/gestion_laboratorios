// hooks/useDocenteMaterias.js
import { useState, useEffect } from "react"

export function useDocenteMaterias(docenteId, periodoAcademico = "2025-1") {
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docenteId) {
      setLoading(false)
      return
    }

    const fetchMaterias = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        
        if (!token) {
          throw new Error("No hay token de autenticación")
        }
        
        console.log(`Fetching materias for docente ${docenteId}, periodo ${periodoAcademico}`)
        
        const response = await fetch(
          `http://localhost:3001/api/docente-materias/${docenteId}?periodo_academico=${periodoAcademico}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        )

        console.log(`Response status: ${response.status}`)

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("No tienes permisos para acceder a esta información")
          } else if (response.status === 404) {
            throw new Error("Servicio no disponible. Verifica que el servidor esté funcionando.")
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log("Materias response:", result)
        
        if (result.success) {
          setMaterias(result.data || [])
          setError(null)
        } else {
          throw new Error(result.message || "Error al cargar materias")
        }
      } catch (err) {
        console.error("Error fetching docente materias:", err)
        setError(err.message)
        setMaterias([])
      } finally {
        setLoading(false)
      }
    }

    fetchMaterias()
  }, [docenteId, periodoAcademico])

  const refetch = () => {
    if (docenteId) {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No hay token de autenticación")
        return
      }
      
      setLoading(true)
      setError(null)
      
      fetch(
        `http://localhost:3001/api/docente-materias/${docenteId}?periodo_academico=${periodoAcademico}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            if (res.status === 403) {
              throw new Error("No tienes permisos para acceder a esta información")
            }
            throw new Error(`Error ${res.status}: ${res.statusText}`)
          }
          return res.json()
        })
        .then((result) => {
          if (result.success) {
            setMaterias(result.data || [])
            setError(null)
          } else {
            throw new Error(result.message)
          }
        })
        .catch((err) => {
          console.error("Error in refetch:", err)
          setError(err.message)
          setMaterias([])
        })
        .finally(() => setLoading(false))
    }
  }

  return {
    materias,
    loading,
    error,
    refetch,
  }
}

export function useDetalleMateria(docenteId, materiaId, periodoAcademico = "2025-1") {
  const [detalle, setDetalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!docenteId || !materiaId) {
      setLoading(false)
      return
    }

    const fetchDetalle = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem("token")
        
        if (!token) {
          throw new Error("No hay token de autenticación")
        }
        
        const response = await fetch(
          `http://localhost:3001/api/docente-materias/${docenteId}/${materiaId}?periodo_academico=${periodoAcademico}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
          }
        )

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("No tienes permisos para acceder a esta materia")
          } else if (response.status === 404) {
            throw new Error("Materia no encontrada o no asignada")
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        
        if (result.success) {
          setDetalle(result.data)
          setError(null)
        } else {
          throw new Error(result.message || "Error al cargar detalle de materia")
        }
      } catch (err) {
        console.error("Error fetching detalle materia:", err)
        setError(err.message)
        setDetalle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDetalle()
  }, [docenteId, materiaId, periodoAcademico])

  return {
    detalle,
    loading,
    error,
  }
}