'use client';
import React from 'react';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import {
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ExpectedCSVInfo } from '../../utils/constants/index';

export default function ImportInfoModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>View File Requirements</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'white',
              boxShadow: 24,
              p: 4,
              minWidth: 500,
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h4"
                sx={{ paddingBottom: 2 }}
              >
                CSV File Requirements
              </Typography>

              <IconButton onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography
              id="modal-modal-description"
              variant="body1"
              sx={{ paddingBottom: 2 }}
            >
              Please ensure your CSV file contains the following fields before
              importing. If the data for a field is not available, please enter
              a 0 as a placeholder.
            </Typography>
            <TableContainer sx={{ maxHeight: '60vh' }}>
              <Table stickyHeader aria-label="file requirements">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Field Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: 200 }}>
                      Max Character Length
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(ExpectedCSVInfo.entries()).map(
                    ([key, [description, maxLength]]) => (
                      <TableRow key={key}>
                        <TableCell component="th" scope="row">
                          {key}
                        </TableCell>
                        <TableCell>{description}</TableCell>
                        <TableCell align="center">
                          {maxLength || 'none'}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
