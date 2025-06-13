"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/client"

// Create Client
export async function createClient(data) {

}

// Update Client
export async function updateClient(clientId, data) {
  try {
    const res = await axios.put(`${BASE_URL}/${clientId}`, data)
    revalidatePath("/clients")
    revalidatePath(`/clients/${clientId}`)
    revalidatePath("/")
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to update client" }
  }
}

// Delete Client
export async function deleteClient(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    revalidatePath("/clients")
    revalidatePath("/")
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to delete client" }
  }
}

// Get Client by ID
export async function getClient(id) {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`)

    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to get client" }
  }
}

// Search Clients
export async function searchClients(search, page = 1, limit = 10) {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: { search, page, limit },
    })
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to search clients" }
  }
}

// Form action wrapper for createClient with redirect
export async function createClientAction(formData) {

  try {
    const clientData = {
      client_name: formData.get("client_name"),
      client_contact: formData.get("client_contact"),
      client_mail: formData.get("client_mail"),
      projects: formData.get("projects") ? JSON.parse(formData.get("projects")) : [],
    }

    const res = await axios.post(`${BASE_URL}/new`, clientData)
    revalidatePath("/clients")
    revalidatePath("/")
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to create client" }
  }
}

// Form action wrapper for updateClient with redirect
export async function updateClientAction(id, formData) {
  const clientData = {
    client_name: formData.get("client_name"),
    client_contact: formData.get("client_contact"),
    client_mail: formData.get("client_mail"),
  }

  const result = await updateClient(id, clientData)

  if (result.success) {
    revalidatePath("/clients")
    revalidatePath(`/clients/${id}`)
    revalidatePath("/")
  }

  return result
}

// Delete action with redirect
export async function deleteClientAction(id) {
  const result = await deleteClient(id)

  if (result.success) {
    revalidatePath("/clients")
    revalidatePath("/")
  }

  return result
}
