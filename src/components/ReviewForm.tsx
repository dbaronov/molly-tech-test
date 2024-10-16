import { useState } from 'react'
import { Movie } from '../api/schema'
import { Alert, Button } from '@mui/material'

export default function ReviewForm(props: { selectedMovie: Movie }) {

  const [message, setMessage] = useState("Form is not submitted")
  const [reviewInputTextLength, setReviewInputTextLength] = useState(0)
  const [reviewInputRatingLength, setReviewInputRatingLength] = useState(0)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form as HTMLFormElement)

    try {

      if (reviewInputTextLength < 10 && reviewInputRatingLength < 1) {
        setMessage("Please fill in the form.")
        return
      } else if (reviewInputTextLength < 10) {
        setMessage("Review text is too short.")
        return
      } else if (reviewInputRatingLength < 1) {
        setMessage("Review rating is missing.")
        return
      } else {
        const response = await fetch("http://localhost:3000/submitReview", {
          method: "POST",
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(data => setMessage(data.message))
      }

    } catch (error) {
      setMessage("There was a problem with your submission")
      console.error(error)
    }
  }

  const handleTextInputCounter = (event: React.FormEvent) => {
    setReviewInputTextLength((event.target as HTMLTextAreaElement).value.length)
  }

  const handleRatingInputCounter = (event: React.FormEvent) => {
    setReviewInputRatingLength((event.target as HTMLTextAreaElement).value.length)
  }

  return (
    <div className='review-form'>
      {props.selectedMovie && props.selectedMovie.title &&
        <form name="reviewForm" style={{ display: "flex", flexDirection: "column", rowGap: "10px" }} onSubmit={(event) => { handleSubmit(event) }}>
          <h2>Submit your review</h2>
          <input
            hidden
            type="text"
            name="reviewTitle"
            id="reviewTitle"
            readOnly
            value={props.selectedMovie.title}
          />
          <label htmlFor="reviewText"> Review:</label>
          <textarea
            style={{ width: '100%' }} 
            rows={10}
            cols={40}
            maxLength={100}
            id="reviewText"
            name="reviewText"
            onInput={(event) => handleTextInputCounter(event)}
            placeholder={`For "${props.selectedMovie.title}" movie by ${props.selectedMovie.companyName}`}
          />

          <legend style={{ fontSize: '12px', textAlign:'right' }}>{`${reviewInputTextLength} of 100 (min 10, max 100 )`}</legend>
          
          <label>Your rating:
            <input
              style={{ width: '30px', marginLeft: '10px' }} 
              name="reviewRating"
              type="number"
              min={1}
              max={10}
              onInput={(event) => handleRatingInputCounter(event)}
            ></input>
          </label>
          <Button variant='contained' type="submit">Submit</Button> 

          <Alert severity="info">Status: {message}</Alert>
        </form>
      }
    </div>
  )
}
