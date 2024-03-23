/* eslint-disable */
import { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import ReactPDF from '@react-pdf/renderer';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@mui/material/Modal';
import { AppContext } from '../../context/context';
import api from '../../utils/api';
import { Toast } from '../Toast';
import TableRequestForMe from '../TableRequestForMe';
import { OrderSchema } from './schema.ts';
import CustomFormControlInput from '../CustomFormControlInput';
import MyDocument from '../InvoiceReciepment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 900,
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
export function ModalConfirmRequest({ isOpen, setIsOpen, id }) {
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
        resolver: zodResolver(OrderSchema),
    });
    const [partNumber, setPartNumber] = useState([{}])

    const { addToast } = Toast()

    const navigate = useNavigate()
    const quantity = watch("quantity")
    const price = watch("price")
    const [rows, setRows] = useState([{
        quantityGiven: []
    }])
    const [numberSeries, setNumberSeries] = useState("0")

    const { userData } = useContext(AppContext)

    const handleAcceptRequest = async () => {

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].quantity < rows[i]?.quantityGiven[rows[i]?.quantityGiven?.length - 1] || rows[i]?.quantityGiven?.length <= 0) {
                addToast({
                    title: `A quantidade fornecida é obrigatória e não pode ser  maior que a quantidade requisitada para a peça "${rows[i].piece.label}"`,
                    status: "warning"
                })
                return;
            }
        }

        const requestData = rows.map(row => ({
            number_series: row.numberSeries,
            pieceId: row.piece.value,
            quantityGiven: row.quantityGiven[0]
        }))

        const url = `/request/accept-request/${id}`;
        const response = await api.post(url, {
            pieceData: requestData,
            userId: userData.data.id
        })
        if (response.status === 201) {
            addToast({
                title: "Requisição aceite com sucesso",
                status: "success"
            })
            MyDocument(response.data)
            setIsOpen(false)

        }

        window.location.reload()

    }


    useEffect(() => {
        const getData = async () => {
            const response = await api.get(`request/${id}`)
            if (response.status !== 200) {
                console.log(response)
            }
            setRows(response.data?.RequestsPieces?.map(row => ({
                piece: {
                    value: row.pieceId,
                    label: row.piece.name,
                    location: row.piece.locationInWarehouse,
                    quantity: row.piece.quantity,
                },
                quantity: row.quantity,
                price: row.piece.price,
                numberSeries: [],
                quantityGiven: []
            })))

        }
        getData()
    }, [id])

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
                        CONFIRMAÇÃO DE REQUISIÇÃO
                    </Typography>
                    <TableRequestForMe
                        rows={rows}
                        hasPrice={false}
                        register={register}
                        errors={errors}
                        showInput
                        partNumber={partNumber}
                        setPartNumber={setPartNumber}
                        setNumberSeries={setNumberSeries}
                    />
                    <Box>
                        <Button onClick={handleAcceptRequest} variant="contained" sx={buttonStyle}>
                            Confirmar
                        </Button>
                        <Button onClick={handleClose} variant="contained" sx={buttonStyle}>
                            Voltar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}