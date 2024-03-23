
/* eslint-disable  */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

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

import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import api from '../../utils/api'
import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { WarehouseSchemaFixed, WarehouseSchemaNonFixed } from './schema.ts';
import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import { Toast } from '../../components/Toast';

export default function FormContainer() {
    const navigate = useNavigate()
    const { userData } = useContext(AppContext)
    const [isActive, setIsActive] = useState(false)
    const [schema, setSchema] = useState(WarehouseSchemaFixed)
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
        resolver: zodResolver(schema),
    });
    const { id } = useParams()

    const typeWarehouse = watch("type")
    useEffect(() => {
        const getData = async () => {
            const url = `/warehouse/${id}`
            const response = await api.get(url)
            setValue("name", response.data.name)
            setValue("code", response.data.code)
            setValue("description", response.data.description)
            setValue("company", response.data.company)
            setValue("capacity", response.data.capacity)
            setValue("province", response.data.province)
            setValue("country", response.data.country)
            setValue("address", response.data.address)
            setValue("flag", response.data.flag)
            setValue("code", response.data.code)
            setValue("company", response.data.company)
            console.log(response)
            setValue("type", { label: response.data.type, value: response.data.type })
            setSchema(WarehouseSchemaFixed)
            setIsActive(response.data.isActive != "1")
            console.log("ID REF", id)
        }
        getData()

    }, [])
    useEffect(() => {
        setSchema(typeWarehouse?.value === "Armazém" ? WarehouseSchemaFixed : WarehouseSchemaNonFixed)
    }, [typeWarehouse])

    const { addToast } = Toast()

    const onSubmit = async (data) => {
        console.log("Ola mundo")

        try {

            let response;
            const url = id === undefined ? `warehouse` : `/warehouse/${id}`
            if (id === undefined || id === '') {
                response = await api.post(url, {
                    ...data,
                    type: typeWarehouse.value,
                    userId: userData.data.id,
                    capacity: Number(data.capacity)
                })
            } else {
                response = await api.patch(url, {
                    ...data,
                    type: typeWarehouse.value,
                    capacity: Number(data.capacity),
                    id,
                    userId: userData.data.id

                })
            }
            if (response.status === 201) {
                addToast({
                    title: "Armazém cadastrado com sucesso",
                    status: "success"
                })
                navigate("/dashboard/armazem")
            }
            if (response.status === 200) {
                addToast({
                    title: "Armazém actualizado com sucesso",
                    status: "success"
                })
                navigate("/dashboard/armazem")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Armazém </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Armazém > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/armazem`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Armazém
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Armazém</Typography>
                </Stack>
                <Container sx={{ display: 'flex', flexDirection: "column", alignContent: "space-between", backgroundColor: "white", width: "100%", padding: "40px" }} >
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                            <CustomFormControlSelect
                                errors={errors}
                                fieldNameObject="type"
                                isDisabled={id !== undefined}
                                parent={{ value: 1 }}
                                options={[{ value: "Armazém", label: "Armazém" }, { value: "Embarcação", label: "Embarcação" }]}
                                fieldName="Tipo de Armazém"
                                control={control}
                                isMulti={false}
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
                        {
                            typeWarehouse?.value === "Armazém" ? (
                                <>
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
                                            fieldNameObject="province"
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
                                </>
                            )
                                :
                                (
                                    <>
                                        <Box mb={5}>
                                            <CustomFormControlInput
                                                errors={errors}
                                                fieldName="Empresa"
                                                fieldNameObject="company"
                                                isDisabled={false}
                                                register={register}
                                                type="text"
                                                placeholder="Insira a empresa aqui"
                                            />
                                        </Box>
                                        <Box mb={5}>
                                            <CustomFormControlInput
                                                errors={errors}
                                                fieldName="Capacidade"
                                                fieldNameObject="capacity"
                                                isDisabled={false}
                                                register={register}
                                                type="number"
                                                placeholder="Insira a capacidade aqui"
                                            />
                                        </Box>
                                        <Box mb={5}>
                                            <CustomFormControlInput
                                                errors={errors}
                                                fieldName="Bandeira"
                                                fieldNameObject="flag"
                                                isDisabled={false}
                                                register={register}
                                                type="text"
                                                placeholder="Insira a bandeira aqui"
                                            />
                                        </Box>

                                    </>
                                )
                        }
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
                            <Button type="submit" disabled={isActive && id !== undefined} sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                {id !== undefined ? 'Actualizar' : 'Cadastrar'}
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}