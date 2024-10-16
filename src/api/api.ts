import { MovieInstance, CompanyInstance } from "./schema"

const apiCall = <T>(url: string): Promise<T> => {
  return fetch(url)
  .then(
    (response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Error eccured")
    }
  ) 
}

export const getMovies = (): Promise<MovieInstance[]> => {
  return apiCall<MovieInstance[]>("http://localhost:3000/movies")
}

export const getCompanies = (): Promise<CompanyInstance[]> => {
  return apiCall<CompanyInstance[]>("http://localhost:3000/movieCompanies")
}
