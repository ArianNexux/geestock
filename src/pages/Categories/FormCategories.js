import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";
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
    const roles = [
        {label:"Armazéns", value:1},
        {label:"Peças", value:2},
        {label:"Requisições", value:3},
        {label:"Ultilizadores", value:4},
        {label:"Categorias", value:5},
        {label:"Alertas", value:6},
        {label:"Transporte", value:7},
        {label:"Nota de Entrega", value:8},
    ]
    const navigate = useNavigate()
    const onSubmit = async (data) => {
  
        try {
            const response = await api.post("/category", {
                ...data,

            })
            if (response.status === 201) {
                addToast({
                    title: "Categoria cadastrada com sucesso",
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
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Categorias > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de Categorias
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Peças</Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Nome"
                            fieldNameObject="name"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o nome do utilzador aqui"
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
                        <Button sx={{ maxWidth: "40%", height:"40px" }} type="submit" mb={5} variant="contained">
                            Cadastrar
                        </Button>
                    </Box >
                </Container >
                    </form>
            </Container >

        </>
    )

}