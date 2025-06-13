"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { searchProjects } from "@/scripts/project-actions"

/**
 * @param {Object} props
 * @param {string} [props.value] - Selected value
 * @param {function} props.onValueChange - Callback when value changes
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.required] - Whether the field is required
 */
export function ProjectSelect({ value, onValueChange, placeholder = "Select project", required }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const result = await searchProjects("", 1, 100)
        if (result.success) {
          setProjects(result.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading projects..." />
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
        {projects.map((project) => (
          <SelectItem key={project._id} value={project._id}>
            {project.project_name} ({project.project_status})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
