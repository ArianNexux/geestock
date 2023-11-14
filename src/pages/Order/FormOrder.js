import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { OrderSchema } from './schema.ts';
import api from '../../utils/api'
import { Toast } from '../../components/Toast';
import { GET_CATEGORY, GET_SUBCATEGORY, GET_PIECES } from '../../utils/endpoints';


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
    useEffect(() => {
        console.log("Ola mundo")
        const getData = async () => {
            const responsePiece = await api.get(GET_PIECES)
            setPiecesData(responsePiece.data.map(e => ({
                value: e.id,
                label: e.name
            })))
        }
        getData()
    }, [])
    const onSubmit = async (data) => {
  
        try {
            const response = await api.post("/order", {
                ...data,
                quantity: Number(data.quantity),
                pieceId: pieceId.value,

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
                Início > Encomendas > Cadastrar
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
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="pieceId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={piecesData}
                                fieldName="Peça"
                                control={control}
                                isMulti={false}
                                isRequired={false}
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Quantidade"
                                fieldNameObject="quantity"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="number"
                                placeholder="Insira a quantidade aqui"
                            />
                        </Box>

                        <Box mt={5}>
                            <Button type="submit" sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                Cadastrar
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}