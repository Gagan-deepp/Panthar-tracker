"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/project"


// Get Project by ID
export async function getProject(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to get project" }
  }
}


// Delete Project
export async function deleteProject(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    revalidatePath("/projects")
    revalidatePath("/")
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to delete project" }
  }
}

// Search Projects
export async function searchProjects(search, page = 1, limit = 10) {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: { search, page, limit },
    })
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to search projects" }
  }
}

// Form action wrapper for createProject with redirect
export async function createProjectAction(formData) {

  try {

    const projectData = {
      project_name: formData.get("project_name"),
      project_desc: formData.get("project_desc"),
      project_status: formData.get("project_status") || "active",
      client: formData.get("client"),
      project_start_date: formData.get("project_start_date"),
      project_end_date: formData.get("project_end_date"),
      team: formData.get("team") ? JSON.parse(formData.get("team")) : [],
    }

    const res = await axios.post(`${BASE_URL}/new`, projectData)
    revalidatePath("/projects")
    revalidatePath("/")

    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to create project" }
  }
}

// Form action wrapper for updateProject with redirect
export async function updateProjectAction(id, formData) {

  try {

    const projectData = {
      project_name: formData.get("project_name"),
      project_desc: formData.get("project_desc"),
      project_status: formData.get("project_status"),
      client: formData.get("client"),
      project_start_date: formData.get("project_start_date"),
      project_end_date: formData.get("project_end_date"),
      team: formData.get("team") ? JSON.parse(formData.get("team")) : [],
    }

    const res = await axios.put(`${BASE_URL}/${id}`, projectData)
    revalidatePath("/projects")
    revalidatePath(`/projects/${id}`)
    revalidatePath("/")
    return { success: true, data: res.data.data }

  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to update project" }
  }
}

// Delete action with redirect
export async function deleteProjectAction(id) {
  const result = await deleteProject(id)

  if (result.success) {
    revalidatePath("/projects")
    revalidatePath("/")
  }

  return result
}
