import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const { id } = useParams()

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
        const fullFillFormData = async (data) => {
            const url = `/piece/${id}`
            const response = await api.get(url)
            console.log("FINAL RESPONSE", response.data)
            setValue("name", response.data.name)
            setValue("description", response.data.description)
            setValue("locationInWarehouse", response.data.locationInWarehouse ?? "")
            setValue("partNumber", response.data.partNumber)
            setValue("price", response.data.price.toString())
            setValue("brand_name", response.data.brand_name)
            setValue("supplierId", { value: response.data.supplier.id, label: response.data.supplier.name })
            setValue("categoryId", { value: response.data.category.id, label: response.data.category.name })
            setValue("subCategoryId", { value: response.data.subcategory.id, label: response.data.subcategory.name })
            setValue("quantity", response.data.quantity.toString())
            setValue("target", response.data.target.toString())
            setValue("min", response.data.min.toString())
        }

        fullFillFormData()
        getData()
    }, [])



    const onSubmit = async (data) => {
        console.log(errors)
        try {
            console.log(id)
            let response;
            const url = id === undefined ? `piece` : `/piece/${id}`

            const dataRequest = {
                ...data,

                price: Number(data.price),
                quantity: Number(data.quantity),
                target: Number(data.target),
                min: Number(data.min),
                warehouseId: userData.data.warehouse?.id,
                supplierId: supplierId.value,
                categoryId: categoryId.value,
                subCategoryId: subCategoryId.value,
                state: state.value,
                userId: userData.data.id,
            }

            if (id === undefined || id === '') {
                response = await api.post(url, dataRequest)
            } else {
                response = await api.patch(url, { ...dataRequest, id })
            }

            if (response.status === 201) {
                addToast({
                    title: "Peça cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/peca")
            }

            if (response.status === 200) {
                addToast({
                    title: "Peça actualizada com sucesso",
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
                    <Button onClick={() => { navigate(`/dashboard/peca`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
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
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Part Number"
                                fieldNameObject="partNumber"
                                isDisabled={false}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira o Part Number"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Localização da Peça no armazém"
                                fieldNameObject="locationInWarehouse"
                                isDisabled={userData.data.position === "1"}
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
                                isDisabled={id !== undefined}
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
                                fieldNameObject="state"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={[{ value: "Disponivel", label: "Disponível" }, { value: "Removido", label: "Removido" }]}
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
                                isDisabled={id !== undefined}
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


                        <Box mt={5}>
                            <Button type="submit" onClick={() => { console.log(errors) }} sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                Cadastrar
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}