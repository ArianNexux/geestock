import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom'
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
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
import { ModalInsertPiece } from '../../components/modal/modalInsertPiece';

// components
import Iconify from '../../components/iconify';
import { UserSchema } from './schema.ts';
import api from '../../utils/api';
import { AppContext } from '../../context/context';
import { Toast } from '../../components/Toast';
import TableRequest from '../../components/TableRequest';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import CustomFormControlInput from '../../components/CustomFormControlInput';

function createData(piece, quantity) {
    return { piece, quantity };
}
export default function FormRequests() {

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
        resolver: zodResolver(UserSchema),
    });
    const { addToast } = Toast()
    const navigate = useNavigate()

    const warehouse = watch("container")
    const name = watch("name")
    const numberPr = watch("numberPr")
    const [data, setData] = useState([])
    const [dataPieces, setDataPieces] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const { userData } = useContext(AppContext)

    const [rows, setRows] = useState([])
    const { id } = useParams()
    useEffect(() => {
        const getData = async () => {
            try {
                const url = `/warehouse`;
                const response = await api.get(url)
                setData(response.data.filter(e => e.id !== userData.data.warehouse.id).map(e => ({
                    value: e.id,
                    label: e.name
                })))
                const urlPieces = `/piece/warehouse/${response.data[0].id}`;
                const responsePieces = await api.get(urlPieces)
                setDataPieces(responsePieces.data.map(e => ({
                    value: e.id,
                    label: e.name
                })))
                console.log("LOGAR", response.data)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [])

    useEffect(() => {
        const getData = async () => {
            try {
                const urlPieces = `/piece/warehouse/${warehouse.value}`;
                const responsePieces = await api.get(urlPieces)
                setDataPieces(responsePieces.data.map(e => ({
                    value: e.id,
                    label: e.name
                })))
            } catch (e) {
                console.log(e)
            }
        }
        setValue("piece", null)
        getData()
    }, [warehouse])
    useEffect(() => {
        const getData = async (data) => {
            const url = `/request/${id}`
            const response = await api.get(url)
            console.log("FINAL RESPONSE", response.data)
            setValue("name", response.data.name)
            setValue("numberPr", response.data.numberPr)
            setValue("container", { label: response.data.warehouseIncomming.name, value: response.data.warehouseIdIncomming })
            setRows(
                response.data.RequestsPieces.map((e) => ({
                    quantity: Number(e.quantity),
                    piece: { label: e.piece.name, value: e.pieceId },
                    price: Number(e.piece.price)
                })))
        }

        getData()
    }, [])
    const onSubmit = async (data) => {
        console.log(errors)
        console.log(data)
        try {
            const data = {
                name,
                request: rows.map(row => ({
                    pieceId: row.piece.value,
                    quantity: Number(row.quantity)
                })),
                warehouseIdOutcomming: userData.data.warehouse.id,
                warehouseIdIncomming: warehouse.value,
                numberPr,
                userId: userData.data.id
            }

            let response;
            const url = id === undefined ? `request` : `/request/${id}`
            if (id === undefined || id === '') {
                response = await api.post(url, {
                    ...data,
                    state: "Em analise"

                })
            } else {
                response = await api.patch(url, {
                    ...data,
                    id
                })
            }
            if (response.status === 201) {
                addToast({
                    title: "Requisição feita com sucesso, O Armazem receberá para análise!",
                    status: "success"
                })
                navigate("/dashboard/requisicao")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Requisições </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Requisições > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Requisições
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Requisição</Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName={`Nome da Requisição`}
                                fieldNameObject="name"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o nome da requisição..."
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName={`Número da PR`}
                                fieldNameObject="numberPr"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o número da PR da requisição..."
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="container"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={data}
                                fieldName="Armazém"
                                control={control}
                                isMulti={false}

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
                            rows={rows}
                        />

                        <Box mt={5}>
                            <Button sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained" onClick={() => { console.log(errors) }} type="submit">
                                Cadastrar
                            </Button>
                        </Box >
                    </Container >
                </form >
            </Container >
            <ModalInsertPiece
                rows={rows}
                setRows={setRows}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                dataPieces={dataPieces}
            />
        </>
    )

}