import * as React from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PDFViewer } from '@react-pdf/renderer';
import Modal from '@mui/material/Modal';
import api from '../../utils/api';
import { Toast } from '../Toast';
import MyDocument from '../InvoiceReciepment/index'
import { OrderSchema } from './schema.ts';
import CustomFormControlInput from '../CustomFormControlInput';
import CustomFormControlSelect from '../CustomFormControlSelect';

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
};
export function ModalInsertPiece({ isOpen, setIsOpen, id, dataPieces, setRows, rows, hasPrice = false }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setError,
        getValues,
        setValue,
        clearErrors,
    } = useForm({
        resolver: zodResolver(),
    });
    const { addToast } = Toast()

    const navigate = useNavigate()
    const quantity = watch("quantity")
    const piece = watch("piece")
    const price = watch("price")

    const handleOnClick = async () => {
        console.log(quantity, piece)
        setRows([
            ...rows,
            {
                quantity: Number(quantity),
                piece,
                price: Number(price),
            }
        ])

        setIsOpen(false)
    }
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
                        INSERIR PEÇA PARA REQUIÇÃO
                    </Typography>
                    <Box mb={5}>
                        <CustomFormControlSelect
                            errors={errors}
                            fieldNameObject="piece"
                            isDisabled={false}
                            parent={{ value: 1 }}
                            options={dataPieces}
                            fieldName="Peça"
                            control={control}
                            isMulti={false}
                        />
                    </Box>
                    {

                        hasPrice && (<Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName={`Preço Médio`}
                                fieldNameObject="price"
                                isDisabled={false}
                                register={register}
                                type="number"
                                placeholder="Insira o preço médio da peça aqui..."
                            />
                        </Box>)
                    }

                    <Box mb={5}>
                        <CustomFormControlInput
                            errors={errors}
                            fieldName={`Quantidade`}
                            fieldNameObject="quantity"
                            isDisabled={false}
                            register={register}
                            type="number"
                            placeholder="Insira a quantidade de peças aqui..."
                        />
                    </Box>

                    <Box>
                        <Button onClick={handleOnClick} variant="contained" sx={buttonStyle}>
                            Adicionar
                        </Button>
                    </Box>


                </Box>

            </Modal>
        </div>
    );
}