"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/ticket"

// Delete Ticket
export async function deleteTicket(id) {
  console.debug("[deleteTicket] called with id:", id)
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    revalidatePath("/")
    revalidatePath("/tickets")
    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("[deleteTicket] error:", error)
    console.error("[deleteTicket] simplified error:", error?.response?.data?.message || error?.message || error)
    return { success: false, error: error.response?.data?.message || "Failed to delete ticket" }
  }
}

// Get Ticket by User ID
export async function getTicketsByUser(userId) {
  console.debug("[getTicketsByUser] called with userId:", userId)
  try {
    const res = await axios.get(`${BASE_URL}/user/${userId}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("[getTicketsByUser] error:", error)
    console.error("[getTicketsByUser] simplified error:", error?.response?.data?.message || error?.message || error)
    return { success: false, error: error.response?.data?.message || "Failed to get tickets by user" }
  }
}

// Get Ticket by Project ID
export async function getTicketsByProject(projectId) {
  console.debug("[getTicketsByProject] called with projectId:", projectId)
  try {
    const res = await axios.get(`${BASE_URL}/project/${projectId}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("[getTicketsByProject] error:", error)
    console.error("[getTicketsByProject] simplified error:", error?.response?.data?.message || error?.message || error)
    return { success: false, error: error.response?.data?.message || "Failed to get tickets by project" }
  }
}

// Get All Tickets
export async function getAllTickets(page = 1, limit = 10) {
  console.debug("[getAllTickets] called with page:", page, "limit:", limit)
  try {
    const res = await axios.get(`${BASE_URL}`, {
      params: { page, limit },
    })
    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("[getAllTickets] error:", error)
    console.error("[getAllTickets] simplified error:", error?.response?.data?.message || error?.message || error)
    return { success: false, error: error.response?.data?.message || "Failed to get tickets" }
  }
}

// Form action wrapper for createTicket with redirect
export async function createTicketAction(formData) {
  console.debug("[createTicketAction] called with formData:", Object.fromEntries(formData.entries()))
  try {
    const ticketData = {
      ticket_heading: formData.get("ticket_heading"),
      ticket_description: formData.get("ticket_description"),
      ticket_status: formData.get("ticket_status") || "Pending",
      ticket_type: formData.get("ticket_type") || "Query",
      userID: formData.get("userID"),
      projectID: formData.get("projectID") || undefined,
    }

    const res = await axios.post(`${BASE_URL}/new`, ticketData)
    revalidatePath("/tickets")
    revalidatePath("/")

    return { success: true, data: res.data.data }
  } catch (error) {
    console.error("[createTicketAction] error:", JSON.stringify(error))
    console.error("[createTicketAction] simplified error:", error?.response?.data?.message || error?.message || error)
    return { success: false, error: error.response?.data?.message || "Failed to create ticket" }
  }
}

// Delete action with redirect
export async function deleteTicketAction(id) {
  console.debug("[deleteTicketAction] called with id:", id)
  const result = await deleteTicket(id)

  if (result.success) {
    revalidatePath("/tickets")
    revalidatePath("/")
  }

  return result
}
