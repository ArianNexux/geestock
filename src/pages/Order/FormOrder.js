import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
    Card,
    Stack,
    Button,
    Container,
    Typography,
    TextField,
    Box
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import { ModalInsertPiece } from '../../components/modal/modalInsertPiece';
import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { OrderSchema } from './schema.ts';
import api from '../../utils/api'
import { Toast } from '../../components/Toast';
import { GET_CATEGORY, GET_SUBCATEGORY, GET_PIECES } from '../../utils/endpoints';
import TableRequest from '../../components/TableRequest';
import { AppContext } from '../../context/context';


export default function FormOrder() {

    const navigate = useNavigate()
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

    const pieceId = watch("pieceId")

    const [piecesData, setPiecesData] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [rows, setRows] = useState([])
    const { userData } = useContext(AppContext)

    useEffect(() => {
        const getData = async () => {
            const url = userData.data?.position === "2" ? `/piece/warehouse/${userData.data.warehouse.id}` : `/piece`;
            const responsePiece = await api.get(url)
            setPiecesData(responsePiece.data.map(e => ({
                value: e.id,
                label: e.name
            })))
        }
        getData()
    }, [])
    const onSubmit = async (data) => {
        console.log(
            rows.map(r => ({
                pieceId: r.piece.value,
                quantity: r.quantity,
                price: r.price
            }))
        )
        try {
            const response = await api.post("/order", {
                ...data,
                request: rows.map(r => ({
                    pieceId: r.piece.value,
                    quantity: r.quantity,
                    price: r.price
                }))

            })
            if (response.status === 201) {
                addToast({
                    title: "Encomenda cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/encomenda")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Encomendas </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                    Início {'>'} Encomendas {'>'} Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Encomendas
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Encomendas</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box mb={5}>
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Descrição"
                                fieldNameObject="description"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                placeholder="Descrição"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="IMBL/AWB"
                                fieldNameObject="imbl_awb"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                placeholder="IMBL/AWB"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Nº da Encomenda"
                                fieldNameObject="number_order"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                placeholder="Nº da Encomenda"
                            />
                        </Box>

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Referencia"
                                fieldNameObject="reference"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira a referência aqui"
                            />
                        </Box>
                        <Button
                            sx={{ maxWidth: "40%", height: "40px" }}
                            mb={10}
                            variant="contained"
                            onClick={() => { setIsOpen(true) }}
                            type="button"
                        >
                            Adicionar Peça
                        </Button>
                        <TableRequest
                            hasPrice
                            rows={rows}
                        />

                        <Box mt={5}>
                            <Button type="submit" sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                Cadastrar
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >
            <ModalInsertPiece
                rows={rows}
                setRows={setRows}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hasPrice
                dataPieces={piecesData}
            />
        </>
    )

}