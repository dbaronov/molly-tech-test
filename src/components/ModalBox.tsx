import { useState } from 'react'
import { Film } from '../api/schema'
import { Box, Button, Modal}  from '@mui/material'
import ReviewForm from '../components/ReviewForm'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function ModalBox(props: { selectedMovie: Film }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Button size="small" variant="outlined" style={{ textTransform: "lowercase" }} onClick={handleOpen}>Write review</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ReviewForm selectedMovie={props.selectedMovie} />
        </Box>
      </Modal>
    </div>
  )
}
