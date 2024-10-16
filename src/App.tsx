import { useState, useEffect } from 'react'
import { Movie, CompanyInstance, Film, AppError } from "./api/schema"
import { getMovies, getCompanies } from './api/api'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableFooter from '@mui/material/TableFooter'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import ModalBox from './components/ModalBox'

const avg = (numbers: number[]) => (numbers.reduce((acc, i) => acc + i) / numbers.length).toFixed(1)

const mergeDataArrays = (movies: Movie[], companies: CompanyInstance[]) => {
  return movies.map((film) => {
    const company = companies.find((company: CompanyInstance) => company.id === film.filmCompanyId)
    return {
      ...film,
      companyName: company ? company.name : 'Unknown'
    };
  });
};

export const App = () => {

  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null)
  const [selectedRow, setSelectedRow] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<AppError>(AppError.NO)

  const getAllData = () => {
    setIsLoading(true)

    // Fetch movies and companies in parallel
    Promise.all([getMovies(), getCompanies()])
      .then(([moviesData, companiesData]) => {
        const processedMovies = moviesData.map(movie => ({
          id: movie.id,
          review: avg(movie.reviews),
          title: movie.title,
          filmCompanyId: movie.filmCompanyId
        }))

        const processedCompanies = companiesData.map(company => ({
          id: company.id,
          name: company.name
        }))

        // Merging movies and companies after both are fetched
        const mergedData = mergeDataArrays(processedMovies, processedCompanies)
        setMovies(mergedData)

        setIsLoading(false)
        setError(AppError.NO)
      })
      .catch(() => {
        setIsLoading(false)
        setError(AppError.MovieFetchError)
      })
  }

  useEffect(() => {
    getAllData()
  }, [])

  const handleSelectRow = (rowIndex: number) => {
    setSelectedRow(rowIndex)
  }

  return (
    <div className="App" style={{ padding: "15px" }}>
      <Typography variant="h4" component="h1" sx={{ textAlign: "center", margin: "20px 0" }}>Welcome to Movie database!</Typography>

      {isLoading && <LinearProgress />}

      {error === AppError.MovieFetchError &&
        <Alert severity='error' sx={{ display: "flex", alignItems: "center" }}>
          <span>Problem to fetch data</span>
          <Button onClick={() => getAllData()} variant="contained" size="small" sx={{ marginLeft: "15px" }}>Retry</Button>
        </Alert>
      }

      {error === AppError.NO &&
        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 320 }} size="small" aria-label="Movie ratings table">
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Film Company</TableCell>
                <TableCell sx={{ width: '25%', fontWeight: 'bold' }}>Write review</TableCell>
              </TableRow>
              {movies.map((movie, index) =>
                <TableRow
                  key={movie.title}
                  selected={selectedRow === index + 1}
                  onClick={() => { handleSelectRow(index + 1); setSelectedMovie(movie); }}
                >
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.review}</TableCell>
                  <TableCell>{movie.companyName || "Unknown"}</TableCell>
                  <TableCell>
                    <ModalBox selectedMovie={selectedMovie} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell>
                  <Typography variant="subtitle2" component="p" sx={{ textAlign: "left" }}>Total movies displayed: {movies.length}</Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }
    </div>
  )
}
