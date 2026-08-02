import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export function useSaveStep(stepNumber) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const save = async (data, next) => {
    setSaving(true)
    setError(null)
    try {
      await api.saveStep(stepNumber, data)
      if (next) navigate(next)
      return true
    } catch (err) {
      if (err.status === 401) {
        navigate('/register/step-1')
      } else {
        setError(err.message)
      }
      return false
    } finally {
      setSaving(false)
    }
  }

  return { save, saving, error }
}
