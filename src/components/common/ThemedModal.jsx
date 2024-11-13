import * as React from 'react';
import {
    Button,
    IconButton,
    Typography,
    Modal,
    Box,
    Stack
} from '@mui/material';
import { Close } from '@mui/icons-material';


export default function ThemedModal(props) {
    const { open, setOpen, onClose } = props;
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (onClose) {
            onClose();
        }else{
            setOpen(false);
        }
    };


    return (
        <div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...styles.container, width: props?.width }}>
                    <Box sx={styles.header}>
                        <Typography id="title" variant='title' component={"div"} sx={styles.headerText}>
                            {props?.modalTitle}
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    <Stack sx={styles.body} >
                        {props?.children}
                    </Stack>
                    
                </Box>
            </Modal>
        </div>
    );
}



const styles = {
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'background.paper',
        border: 'none !important',
        borderRadius: '10px',
        boxShadow: 24,
        outline: 'none',
        // maxHeight: '80%'
    },
    header: {
        padding: '5px 20px',
        backgroundColor: '#F1F1F1',
        borderRadius: '10px 10px 0px 0px !important',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize : '16px'
    },
    body:{
        maxHeight : 'calc(100vh - 200px)',
    }

};
