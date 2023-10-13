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
                <title> Cadastrar Requisições </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
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
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="piece"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Peça"
                         control={control}
                         isMulti={false}
                       
                       />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Quantidade"
                            fieldNameObject="quantity"
                            isDisabled={false}
                            register={register}
                            type="number"
                            placeholder="Insira a quantidade de peças aqui..."
                        />
                    </Box>
      
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="container"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Armazém"
                         control={control}
                         isMulti={false}
                       
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