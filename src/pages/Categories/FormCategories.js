import { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
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
import { useNavigate, useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";

import { AppContext } from '../../context/context';

import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import { Toast } from '../../components/Toast'

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { CategorySchema } from './schema.ts';
import api from '../../utils/api';


export default function FormCategory() {

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
        resolver: zodResolver(CategorySchema),
    });
    const { addToast } = Toast()

    const { id } = useParams()

    const navigate = useNavigate()

    const { userData } = useContext(AppContext)

    const [isActive, setIsActive] = useState(true)
    useEffect(() => {
        const getData = async () => {
            const url = `/category/${id}`
            const response = await api.get(url)
            setValue("name", response.data.name)
            setValue("code", response.data.code)
            setIsActive(response.data.isActive)
        }
        if (id !== undefined)
            getData()
    }, [])
    const onSubmit = async (data) => {

        try {

            let response;
            const url = id === undefined ? `category` : `/category/${id}`
            if (id === undefined || id === '') {
                response = await api.post(url, {
                    ...data,
                    userId: userData.data.id,
                })
            } else {
                response = await api.patch(url, {
                    ...data,
                    id,
                    userId: userData.data.id,
                })
            }
            if (response.status === 201) {
                addToast({
                    title: "Categoria cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/categoria")
            }
            if (response.status === 200) {
                addToast({
                    title: "Categoria actualizada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/categoria")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Categorias </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Categorias > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/categoria`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Categorias
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Categorias</Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Container sx={{ display: "flex", flexDirection: "column", alignContent: "space-between", backgroundColor: "white", width: "100%", padding: "40px" }}>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Nome"
                                fieldNameObject="name"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o nome da categoria aqui"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Código"
                                fieldNameObject="code"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o codigo da categoria aqui..."
                            />
                        </Box>
                        <Box mt={5}>
                            <Button disabled={!isActive} sx={{ maxWidth: "40%", height: "40px" }} type="submit" mb={5} variant="contained">
                                Cadastrar
                            </Button>
                        </Box >
                    </Container >
                </form>
            </Container >

        </>
    )

}