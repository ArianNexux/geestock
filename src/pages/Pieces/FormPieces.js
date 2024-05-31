import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { GET_CATEGORY, GET_SUBCATEGORY, GET_SUPPLIER, GET_TRANSPORT, GET_WAREHOUSE } from '../../utils/endpoints';
import { AppContext } from '../../context/context';


export default function FormPieces() {
    const { userData, curentWarehouse } = useContext(AppContext)

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

    const locationToUpdate = watch("location")
    const warehouseId = watch("warehouseId")
    const transportId = watch("transportId")
    const categoryId = watch("categoryId")
    const supplierId = watch("supplierId")
    const subCategoryId = watch("subCategoryId")
    const state = watch("state")
    const [categoryData, setCategoryData] = useState([])
    const [subCategoryData, setSubCategoryData] = useState([])
    const [transportData, setTransportData] = useState([])
    const [supplierData, setSupplierData] = useState([])
    const [warehouseData, setWarehouseData] = useState([])
    const [isActive, setIsActive] = useState(true)
    const { id } = useParams()
    const [params, setParams] = useSearchParams()

    useEffect(() => {

        if (userData.data.position === "2") {
            console.log("Location", params.get("locationInWarehouse"))
            setValue("location", params.get("locationInWarehouse"))
        }
        const getData = async () => {
            const responseCategories = await api.get(GET_CATEGORY)
            const responseSubcategories = await api.get(GET_SUBCATEGORY)
            const responseTransports = await api.get(GET_TRANSPORT)
            const responseSuppliers = await api.get(GET_SUPPLIER)
            const responseWarehouse = await api.get(`${GET_WAREHOUSE}?onlyActive=1`)
            setWarehouseData(responseWarehouse.data.map(e => ({
                value: e.id,
                label: e.name
            })))
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

            if (Number(userData.data.position) > 1) {
                const foundWarehouse = userData.data.warehouse.filter(warehouse => warehouse.id === curentWarehouse)
                setValue("warehouseId", { label: foundWarehouse[0].name, value: foundWarehouse[0].id })
            }
        }
        const fullFillFormData = async (data) => {
            const url = `/piece/${id}`
            // eslint-ignore-nextline
            const newData = await api.get(`/piece/${id}`)
            console.log("FINAL RESPONSE 01", newData)
            setValue("name", newData.data.name)
            setValue("description", newData.data.description)
            setValue("locationInWarehouse", newData.data.locationInWarehouse ?? "")
            setValue("partNumber", newData.data.partNumber)
            setValue("price", newData.data.price?.toString())
            setValue("brand_name", newData.data.brand_name)
            setValue("supplierId", { value: newData.data.supplier.id, label: newData.data.supplier.name })
            setValue("categoryId", { value: newData.data.category.id, label: newData.data.category.name })
            //setValue("warehouseId", { value: newData.data?.warehouse.id, label: newData.data?.warehouse.name })
            setValue("subCategoryId", { value: newData.data.subcategory.id, label: newData.data.subcategory.name })
            //setValue("quantity", newData.data.quantity.toString())
            setValue("target", newData.data.target.toString())
            setValue("min", newData.data.min.toString())
            setIsActive(newData.data.isActive)
        }

        fullFillFormData()
        getData()
    }, [])



    const onSubmit = async (data) => {
        console.log(errors)

        try {

            if (userData.data.position === "2") {
                let response = await api.put(`/piece/update-location/${params.get("pieceWarehouseId")} `, {
                    location: locationToUpdate
                })
                addToast({
                    title: "Localização da peça actualizada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/peca")
                return;
            }
            console.log(id)
            let response;
            const url = id === undefined ? `piece` : `/piece/${id} `

            const dataRequest = {
                ...data,
                quantity: Number(data.quantity),
                target: Number(data.target),
                min: Number(data.min),
                supplierId: supplierId.value,
                categoryId: categoryId.value,
                subCategoryId: subCategoryId.value,
                state: 'Disponivel',
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
                    <Button onClick={() => { navigate(`/ dashboard / peca`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
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
                                isDisabled={userData.data.position === "2"}
                                register={register}
                                type="text"
                                placeholder="Insira o nome da Peça"
                            />
                        </Box>
                        {userData.data.position === "2" && <Box mb={5}>
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Localização da Peça"
                                fieldNameObject="location"
                                register={register}
                                isRequired={false}
                                placeholder="Localização da Peça"
                            />
                        </Box>}
                        <Box mb={5}>
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Descrição"
                                fieldNameObject="description"
                                isDisabled={userData.data.position === "2"}
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
                                isDisabled={userData.data.position === "2"}
                                register={register}
                                isRequired
                                type="text"
                                placeholder="Insira o Part Number"
                            />
                        </Box>
                        {
                            id !== undefined &&
                            (<Box mb={5}>
                                <CustomFormControlInput
                                    errors={errors}
                                    fieldName="Preço Médio"
                                    fieldNameObject="price"
                                    isDisabled={true}
                                    defaultValue={0}
                                    register={register}
                                    isRequired={false}
                                    type="number"
                                    placeholder="Insira o preço aqui"
                                />
                            </Box>)
                        }
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Marca"
                                fieldNameObject="brand_name"
                                isDisabled={userData.data.position === "2"}
                                register={register}
                                isRequired={false}
                                defaultValue={""}

                                type="text"
                                placeholder="Insira o nome da marca da peça"
                            />

                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="supplierId"
                                isDisabled={userData.data.position === "2"}
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
                                isDisabled={userData.data.position === "2"}
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
                                isDisabled={userData.data.position === "2"}
                                parent={{ value: 1 }}
                                options={subCategoryData}

                                fieldName="Sub-Categoria"
                                control={control}
                                isMulti={false}
                            />
                        </Box>

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Target"
                                fieldNameObject="target"
                                isDisabled={userData.data.position === "2"}
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
                                isDisabled={userData.data.position === "2"}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira a quantidade minima de peças"
                            />
                        </Box>


                        <Box mt={5}>
                            <Button disabled={!isActive} type="submit" onClick={() => { console.log(errors) }} sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                {id !== undefined ? 'Actualizar' : 'Cadastrar'}
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}