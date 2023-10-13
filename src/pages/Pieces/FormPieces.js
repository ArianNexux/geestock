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
import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { UserSchema } from './schema.ts';

export default function FormPieces() {
    
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
                <title> Cadastrar Peças </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Peças > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de Peças
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Peças</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Peça"
                            fieldNameObject="name"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o nome da Peça"
                        />
                   </Box>
                   
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
                            fieldName="Preço"
                            fieldNameObject="price"
                            isDisabled={false}
                            register={register}
                            isRequired={false}
                            type="number"
                            placeholder="Insira o preço aqui"
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
                         isRequired={false}

                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="typeOf"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Marca"
                         control={control}
                         isMulti={false}
                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="category"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Categoria"
                         control={control}
                         isMulti={false}
                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="subcategory"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Sub-Categoria"
                         control={control}
                         isMulti={false}
                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="shipping"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="embarcação"
                         control={control}
                         isRequired={false}

                         isMulti={false}
                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="transport"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Transporte"
                         control={control}
                         isMulti={false}
                         isRequired={false}

                       />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="state"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={roles}
                         fieldName="Estado"
                         control={control}
                         isMulti={false}
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
                            placeholder="Insira o codigo da peça"
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
                            type="text"
                            placeholder="Insira a quantidade de peças"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Nº Peça"
                            fieldNameObject="number_piece"
                            isDisabled={false}
                            register={register}
                            isRequired={false}
                            type="text"
                            placeholder="Insira o numero da peça"
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="IMPA"
                            fieldNameObject="number_maritm"
                            isDisabled={false}
                            register={register}
                            isRequired={false}
                            type="text"
                            placeholder="Insira o numero marítimo aqui..."
                        />
                    </Box>
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="BL"
                            fieldNameObject="invoice_number"
                            isDisabled={false}
                            register={register}
                            type="text"
                            isRequired={false}
                            placeholder="Insira o numero da factura aqui..."
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