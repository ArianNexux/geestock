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
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { ShippingSchema } from './schema.ts';
import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import { Toast } from '../../components/Toast';
import api from '../../utils/api';

export default function FormShipping() {
    
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
    resolver: zodResolver(ShippingSchema),
  });
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
    const { addToast } = Toast()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
  
        try {
            const response = await api.post("/transport", {
                ...data,

            })
            if (response.status === 201) {
                addToast({
                    title: "Transporte cadastrado com sucesso",
                    status: "success"
                })
                navigate("/dashboard/transporte")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Tranportes </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Transportes > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de Transportes
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Transporte</Typography>
                </Stack>
                <form  onSubmit={handleSubmit(onSubmit)}>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Nome"
                            fieldNameObject="name"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o nome do Armazém aqui"
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
                            placeholder="Insira o código do transporte aqui"
                        />
                    </Box>
                    <Box mt={5}>
                        <Button sx={{ maxWidth: "40%", height:"40px" }} mb={5} type="submit" variant="contained">
                            Cadastrar
                        </Button>
                    </Box >
                </Container >
                </form>
            </Container >

        </>
    )

}