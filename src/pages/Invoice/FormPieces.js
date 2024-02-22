import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
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
import { AppContext } from '../../context/context';

import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { UserSchema } from './schema';
import api from '../../utils/api'
import { Toast } from '../../components/Toast';
import { GET_CATEGORY, GET_SUBCATEGORY, GET_SUPPLIER, GET_TRANSPORT } from '../../utils/endpoints';
import { AppContext } from '../../context/context';


export default function FormPieces() {
    const { userData } = useContext(AppContext)

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
        resolver: zodResolver(UserSchema),
    });
    const { addToast } = Toast()

    const transportId = watch("transportId")
    const categoryId = watch("categoryId")
    const supplierId = watch("supplierId")
    const subCategoryId = watch("subCategoryId")
    const state = watch("state")
    const [categoryData, setCategoryData] = useState([])
    const [subCategoryData, setSubCategoryData] = useState([])
    const [transportData, setTransportData] = useState([])
    const [supplierData, setSupplierData] = useState([])
    useEffect(() => {

        const getData = async () => {
            const responseCategories = await api.get(GET_CATEGORY)
            const responseSubcategories = await api.get(GET_SUBCATEGORY)
            const responseTransports = await api.get(GET_TRANSPORT)
            const responseSuppliers = await api.get(GET_SUPPLIER)

            setCategoryData(responseCategories.data.map(e => ({
                value: e.id,
                label: e.name
            })))
            setSubCategoryData(responseSubcategories.data.map(e => ({
                value: e.id,
                label: e.name
            })))
            setTransportData(responseTransports.data.map(e => ({
                value: e.id,
                label: e.name
            })))
            setSupplierData(responseSuppliers.data.map(e => ({
                value: e.id,
                label: e.name
            })))
        }
        getData()
    }, [])
    const onSubmit = async (data) => {
        console.log(userData)
        console.log(data)
        try {
            const response = await api.post("/piece", {
                ...data,
                price: Number(data.price),
                quantity: Number(data.quantity),
                target: Number(data.target),
                min: Number(data.min),
                warehouseId: userData.data.warehouse?.id,
                supplierId: supplierId.value,
                transportId: transportId.value,
                categoryId: categoryId.value,
                subCategoryId: subCategoryId.value,
                state: state.value

            })
            if (response.status === 201) {
                addToast({
                    title: "Peça cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/peca")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Peças </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Peças > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/notas-entrega`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Peças
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Peças</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Localização da Peça no armazém"
                                fieldNameObject="locationInWarehouse"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                placeholder="Breve descrição da Localização da Peça"
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
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Marca"
                                fieldNameObject="brand_name"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira o nome da marca da peça"
                            />

                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="supplierId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={supplierData}
                                fieldName="Fornecedor da Peça"
                                control={control}
                                isMulti={false}
                                isRequired={false}

                            />
                        </Box>


                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="categoryId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={categoryData}
                                fieldName="Categoria"
                                control={control}
                                isMulti={false}
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="subCategoryId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={subCategoryData}

                                fieldName="Sub-Categoria"
                                control={control}
                                isMulti={false}
                            />
                        </Box>

                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="transportId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={transportData}
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
                                parent={{ value: 1 }}
                                options={[{ value: "Encomendada", label: "Encomendada" }, { value: "Disponivel", label: "Disponível" }]}
                                fieldName="Estado"
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
                                isRequired={false}
                                type="text"
                                placeholder="Insira a quantidade de peças"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Target"
                                fieldNameObject="target"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira a target de peças"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Quantidade Mínima"
                                fieldNameObject="min"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira a quantidade minima de peças"
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