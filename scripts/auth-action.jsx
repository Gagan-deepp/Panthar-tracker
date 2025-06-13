"use server"

import { signIn, signOut } from "@/lib/auth"
import axios from "axios"
import { AuthError } from "next-auth"
// https://tracker-backend-708150210175.asia-south1.run.app
const BASE_URL = "https://tracker-backend-708150210175.asia-south1.run.app/api/v1/users"

export const signinAction = async ({ email }) => {
    try {
        await signIn("credentials", { email, redirectTo: "/dashboard" })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return {
                        message: "Invalid Credentials"
                    }
                default:
                    return {
                        message: "Something went wrong!!"
                    }
            }
        }

        throw error;
    }
}

export const signOutAction = async () => {
    await signOut({
        redirectTo: "/"
    })
}

export const signinMail = async (email) => {
    try {
        const res = await axios.post(`${BASE_URL}/mail`, { email })

        return res.data.data
    } catch (error) {
        console.log("Error while signin => ", error)
        return null
    }
}

export const dashboardMetrics = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/metrics`)
        return res.data.data
    } catch (error) {
        console.log("Error while fetching dashboard metrics => ", error)
        return null
    }
}