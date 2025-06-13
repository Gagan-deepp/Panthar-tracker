"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/feed"

export const getAllFeedback = async (search, page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${BASE_URL}/`, {
      params: { search, page, limit }
    })
    console.debug("Get all feedback response: ", res.data)
    return { success: true, data: res.data.data }
  } catch (error) {
    console.log("Error while getting feedback ==> ", error?.response?.data?.message || "Failed to get feedback")
    return { success: false, error: error.response?.data?.message || "Failed to get feedback" }
  }
}

// Delete Feedback
export async function deleteFeedback(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    revalidatePath("/feedback")
    revalidatePath("/")
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to delete feedback" }
  }
}

// Get Feedback by Client ID
export async function getFeedbackByClient(clientId) {
  try {
    const res = await axios.get(`${BASE_URL}/client/${clientId}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to get feedback by client" }
  }
}

// Get Feedback by Project ID
export async function getFeedbackByProject(projectId) {
  try {
    const res = await axios.get(`${BASE_URL}/project/${projectId}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to get feedback by project" }
  }
}

// Form action wrapper for createFeedback with redirect
export async function createFeedbackAction(formData) {


  try {

    const feedbackData = {
      comment: formData.get("comment"),
      rating: Number(formData.get("rating")),
      clientID: formData.get("clientID"),
      projectID: formData.get("projectID"),
    }

    const res = await axios.post(`${BASE_URL}/`, feedbackData)
    revalidatePath("/feedback")
    revalidatePath("/")

    return { success: true, data: res.data.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to create feedback" }
  }
}

// Delete action with redirect
export async function deleteFeedbackAction(id) {
  const result = await deleteFeedback(id)

  if (result.success) {
    revalidatePath("/feedback")
    revalidatePath("/")
  }

  return result
}
