"use server"

import axios from "axios"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/users"

// Create User
export async function createUser(data) {

}

// Get User by ID
export async function getUser(id) {
  try {
    console.debug("Getting user with id: ", id)
    const res = await axios.get(`${BASE_URL}/${id}`)
    return { success: true, data: res.data.data }
  } catch (error) {
    console.log("Error while getting user ==> ", error.response?.data?.message)
    return { success: false, error: error.response?.data?.message || "Failed to get user" }
  }
}

// Update User
export async function updateUser(id, data) {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, data)
    revalidatePath("/users")
    revalidatePath(`/users/${id}`)
    revalidatePath("/")
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to update user" }
  }
}

// Delete User
export async function deleteUser(id) {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`)
    revalidatePath("/users")
    revalidatePath("/")
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error.response?.data?.message || "Failed to delete user" }
  }
}

// Search Users
export async function searchUsers(search, page = 1, limit = 10) {
  try {
    const res = await axios.get(`${BASE_URL}/search`, {
      params: { search, page, limit },
    })

    console.debug("Search users response: ", res.data)
    return { success: true, data: res.data.data }
  } catch (error) {
    console.log("Error while searching users ==> ", error.response.data.error)
    return { success: false, error: error.response?.data?.message || "Failed to search users" }
  }
}

// Form action wrapper for createUser with redirect
export async function createUserAction(formData) {

  try {
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company_role: formData.get("company_role"),
      user_role: formData.get("user_role"),
      points: Number(formData.get("points")) || 0,
      skills: formData.get("skills") ? JSON.parse(formData.get("skills")) : [],
    }

    console.log("Usser data ==> ", userData)
    const res = await axios.post(`${BASE_URL}/new`, userData)
    revalidatePath("/users")
    revalidatePath("/")

    return { success: true, data: res.data.data }
  } catch (error) {
    console.log("Error while creating user ==> ", error)
    return { success: false, error: error.response?.data?.message || "Failed to create user" }
  }
}

// Form action wrapper for updateUser with redirect
export async function updateUserAction(id, formData) {
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company_role: formData.get("company_role"),
    points: Number(formData.get("points")) || 0,
  }

  const result = await updateUser(id, userData)

  if (result.success) {
    revalidatePath("/users")
    revalidatePath(`/users/${id}`)
    revalidatePath("/")
  }

  return result
}

// Delete action with redirect
export async function deleteUserAction(id) {
  const result = await deleteUser(id)

  if (result.success) {
    revalidatePath("/users")
    revalidatePath("/")
  }

  return result
}
