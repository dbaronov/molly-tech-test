import { MovieInstance, Company } from "./schema"

export const getMovies = (): Promise<MovieInstance[]> => {
    return fetch(`http://localhost:3000/movies`)
    .then(
      (response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Error eccured")
      }
    )
}

export const getCompanies = (): Promise<Company[]> => {
    return fetch(`http://localhost:3000/movieCompanies`)
    .then(
      (response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Error eccured")
      }
    )
}
