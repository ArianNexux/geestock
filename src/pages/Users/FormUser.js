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

export default function FormUser() {
    
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
                <title> Cadastrar Utilizadores </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Utilizadores > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de utilizadores
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar utilizadores</Typography>
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
                            placeholder="Insira o nome do utilzador aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Email"
                            fieldNameObject="email"
                            isDisabled={false}
                            register={register}
                            type="email"
                            placeholder="Insira o email do utilizador aqui(exemplo@exemplo.com)"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Função"
                            fieldNameObject="functionOf"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o função do utilizador aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Empresa"
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
                            fieldName="Senha"
                            fieldNameObject="password"
                            isDisabled={false}
                            register={register}
                            type="password"
                            placeholder="Insira a senha aqui"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Confirmar senha"
                            fieldNameObject="password"
                            isDisabled={false}
                            register={register}
                            type="password"
                            placeholder="Insira a senha aqui"
                        />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="typeDocument"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Permissões"
                         control={control}
                       
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