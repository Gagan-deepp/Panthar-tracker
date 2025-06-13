"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchClients } from "@/scripts/client-actions"

/**
 * @param {Object} props
 * @param {string} [props.value] - Selected value
 * @param {function} props.onValueChange - Callback when value changes
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required] - Whether the field is required
 */
export function ClientSelect({ value, onValueChange, placeholder = "Select client", required }) {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClients() {
      try {
        const result = await searchClients("", 1, 100)
        if (result.success) {
          setClients(result.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading clients..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} required={required}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {clients.map((client) => (
          <SelectItem key={client._id} value={client._id}>
            {client.client_name} ({client.client_mail})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
