import { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@mui/material/Modal';
import api from '../../utils/api';
import { AppContext } from '../../context/context';

import { Toast } from '../Toast';
import TableRequest from '../TableRequest';
import { OrderSchema } from './schema.ts';
import CustomFormControlInput from '../CustomFormControlInput';
import TableConfirmOrder from '../TableConfirmOrder';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    overflowY: 'scroll',
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
export function ModalConfirmOrder({ isOpen, setIsOpen, id }) {
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
    const { addToast } = Toast()

    const navigate = useNavigate()
    const quantity = watch("quantity")
    const price = watch("price")
    const [rows, setRows] = useState([])
    const [numberSeries, setNumberSeries] = useState("0")
    const { userData } = useContext(AppContext)
    useEffect(() => {
        const getData = async () => {
            const response = await api.get(`order/${id}`)
            if (response.status !== 200) {
                console.log(response)
            }
            setRows(response.data.OrdersPiece.map(row => ({
                piece: {
                    value: row.pieceId,
                    label: row.piece.name
                },
                quantity: row.quantity,
                price: row.price,
                numberSeries: [],
                quantityGiven: 0,
                priceBought: []
            })))

        }
        getData()
    }, [id])
    const [selected, setSelected] = useState([]);

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };
    const handleOnClick = async () => {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].quantity < rows[i]?.quantityGiven || rows[i]?.quantityGiven?.length <= 0) {
                addToast({
                    title: `A quantidade recebida é obrigatória e não pode ser  maior que a quantidade requisitada para a peça "${rows[i].piece.label}"`,
                    status: "warning"
                })
                return;
            }
        }
        try {
            console.log(rows)

            const pieceData = rows.map(row => ({
                pieceId: row.piece.value,
                quantity: row.quantityGiven,
                locationInWarehouse: row.locationInWarehouse
            }))

            console.log(pieceData)

            const response = await api.post(`/order/confirm-order/${id}`, {
                pieceData,
                userId: userData.data.id,
            })

            if (response.status === 200 || response.status === 201) {
                addToast({
                    title: "Encomenda confirmada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/encomenda")
            }

            setIsOpen(false)
        } catch (e) {
            console.log(e)
        }


    }
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);
    return (
        <div style={{ overflowY: 'scroll' }}>
            <Modal
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"

                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        CONFIRMAÇÃO DE ENCOMENDA
                    </Typography>
                    <TableConfirmOrder
                        rows={rows}
                    />
                    <Box>
                        <Button onClick={handleOnClick} variant="contained" sx={buttonStyle}>
                            Confirmar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}