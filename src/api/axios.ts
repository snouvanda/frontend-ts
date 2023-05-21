import axios, { isAxiosError } from "axios"

export default axios.create({
  baseURL: "http://localhost:5000/toko-soya",
})

export const axiosError = isAxiosError
