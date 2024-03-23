import * as React from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Input from '@mui/material/Input'

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Toast } from '../Toast';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '5px',
    p: 4,
};

const styleChildBox = {
    display: 'flex',
    flexDirection: 'column',
    gap: "30px",
    margin: '20px 0 40px 0'
};

const buttonStyle = {
    backgroundColor: 'primary',
    marginRight: '10px',
};

function InputsSeriesNumber({ quantity, numberSeries }) {
    const indents = [];
    const [newValue, setNewValue] = React.useState()
    console.log("QUANTIDADE QUE CHEA AO INPUT", quantity)
    for (let i = 0; i < quantity; i++) {
        indents.push(
            <Input
                placeholder={"Insira o numero de série"}
                type="number"
                key={i}
                defaultValue={numberSeries[i]}
                onBlur={(e) => { numberSeries.splice(i, 1, e.target.value) }}
                sx={{ width: "70%", height: "40px", border: "1.5px solid grey", borderRadius: "4px", marginBottom: '20px', textIndent: "5px", marginTop: "15px" }}
            />
        );
    }
    return indents;
}
export default function ModalNumberSeries({ isOpen, setIsOpen, quantity, numberSeries }) {

    const { addToast } = Toast()

    const navigate = useNavigate()
    const [rows, setRows] = React.useState([])



    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        INSERIR NUMEROS DE SÉRIES
                    </Typography>
                    {
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '60vh',
                            overflowY: 'scroll'
                        }}>
                            <InputsSeriesNumber
                                quantity={quantity}
                                numberSeries={numberSeries}
                            />
                        </Box>

                    }

                    <Box>
                        <Button variant="contained" sx={buttonStyle} onClick={(e) => { handleClose() }}>
                            Confirmar
                        </Button>
                        <Button variant="contained" sx={buttonStyle} onClick={(e) => { handleClose() }}>
                            Voltar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}