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
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { UserSchema } from './schema.ts';
import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';

export default function FormContainer() {
    
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
    return (
        <>
            <Helmet>
                <title> Cadastrar Armazém </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Armazém > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de Armazém
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Armazém</Typography>
                </Stack>
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
                        <CustomFormControlTextArea 
                            errors={errors}
                            fieldName="Descrição"
                            fieldNameObject="description"
                            isDisabled={false}
                            register={register}
                            placeholder="Descrição"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="País"
                            fieldNameObject="country"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o país aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Província"
                            fieldNameObject="company"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o nome da empresa aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Endereço"
                            fieldNameObject="address"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o endereço aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Codigo"
                            fieldNameObject="code"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o codigo aqui"
                        />
                    </Box>
                    <Box mt={5}>
                        <Button sx={{ maxWidth: "40%", height:"40px" }} mb={5} variant="contained">
                            Cadastrar
                        </Button>
                    </Box >
                </Container >
            </Container >

        </>
    )

}