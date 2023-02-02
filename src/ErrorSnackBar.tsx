import React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { setAppErrorTypeAC } from './state/app-reducer'
import { useDispatch } from 'react-redux'


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

type ErrorType = {
    error: null | string
}

const ErrorSnackbar = ({error}: ErrorType) => {
    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return 
        }
        dispatch(setAppErrorTypeAC(null))
    }
    const isOpen = error !== null
    console.log(isOpen)
    return (
        <Snackbar open={ isOpen } autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity='error' sx={{width: '100%'}}>
                <span>{error}</span>
            </Alert>
        </Snackbar>
    )
}

export default ErrorSnackbar;
