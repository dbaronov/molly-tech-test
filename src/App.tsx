import { useState, useEffect } from 'react'
import { Movie, Company, Film, AppError } from "./api/schema"
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

const mergeDataArrays = (movies: Movie[], companies: Company[]) => {
  return movies.map((film) => {
    const company = companies.find((company: Company) => company.id === film.filmCompanyId)
    return {
      ...film,
      companyName: company ? company.name : 'Unknown'
    };
  });
};

export const App = () => {

  const [selectedMovie, setSelectedMovie] = useState(Object)
  const [selectedRow, setSelectedRow] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [films, setFilms] = useState<Film[]>([])
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
        setFilms(mergedData)

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
      <Typography variant="h4" component="h1" style={{ textAlign: "center", margin: "20px 0" }}>Welcome to Movie database!</Typography>

      {isLoading && <LinearProgress />}

      {error === AppError.MovieFetchError &&
        <Alert severity='error' style={{ display: "flex", alignItems: "center" }}>
          <span>Problem to fetch data</span>
          <Button onClick={() => getAllData()} variant="contained" size="small" style={{ marginLeft: "15px" }}>Retry</Button>
        </Alert>
      }

      {error === AppError.NO &&
        <TableContainer component={Paper}>

          <Table sx={{ minWidth: 320 }} size="small" aria-label="Movie ratings table">
            <TableBody>
              <TableRow>
                <TableCell style={{ width: '25%', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell style={{ width: '25%', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell style={{ width: '25%', fontWeight: 'bold' }}>Film Company</TableCell>
                <TableCell style={{ width: '25%', fontWeight: 'bold' }}>Write review</TableCell>
              </TableRow>
              {films.map((film, index) =>
                <TableRow
                  key={film.title}
                  selected={selectedRow === index + 1}
                  onClick={() => { handleSelectRow(index + 1); setSelectedMovie(film); }}
                >
                  <TableCell>{film.title}</TableCell>
                  <TableCell>{film.review}</TableCell>
                  <TableCell>{film.companyName || "Unknown"}</TableCell>
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
                  <Typography variant="subtitle2" component="p" style={{ textAlign: "left" }}>Total movies displayed: {films.length}</Typography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      }
    </div>
  )
}
