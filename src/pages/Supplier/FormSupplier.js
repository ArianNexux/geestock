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
import { SupplierSchema } from './schema.ts';
import api from '../../utils/api'
import { Toast } from '../../components/Toast';


export default function FormSupplier() {

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
        resolver: zodResolver(SupplierSchema),
    });
    const { addToast } = Toast()

    const onSubmit = async (data) => {

        try {
            const response = await api.post("/supplier", {
                ...data

            })
            if (response.status === 201) {
                addToast({
                    title: "Fornecedor cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/fornecedor")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Fornecedores </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Fornecedores > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Fornecedores
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Encomendas</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Nome"
                                fieldNameObject="name"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                placeholder="Insira o nome do fornecedor aqui..."
                            />
                        </Box>

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Código"
                                fieldNameObject="code"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
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