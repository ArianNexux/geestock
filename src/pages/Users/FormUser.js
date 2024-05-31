import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { AppContext } from '../../context/context';

import { GET_CATEGORY, GET_WAREHOUSE } from '../../utils/endpoints';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';

import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { UserPasswordSchema, UserSchema } from './schema.ts';
import { Toast } from '../../components/Toast';
import api from '../../utils/api';

export default function FormUser() {
    const { type, id } = useParams()

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
        resolver: zodResolver(type !== undefined ? UserPasswordSchema : UserSchema),
    });


    const usersTypes = [
        { label: "Administrador", value: "1" },
        { label: "Gestor de Armazem", value: "2" },
        { label: "Funcionário", value: "3" },
    ]


    const [warehouseData, setWarehouseData] = useState([])
    const warehouse = watch("warehouseId")
    const position = watch("position")


    useEffect(() => {
        console.log(position)
        const getData = async () => {
            const responseWarehouse = await api.get(`${GET_WAREHOUSE}?onlyActive=1`)
            if (id !== undefined) {
                const response = await api.get(`users/${id}`)
                console.log("USER TYPE", usersTypes)
                console.log("NOVA DATA", response)
                setValue("name", response.data.name)
                setValue("email", response.data.email)
                setValue("position", usersTypes[Number(response.data.position) - 1])

                setValue("company", response.data.company)
                setValue("warehouseId", response.data.warehouse.map(e => ({
                    value: e.Warehouse.id,
                    label: e.Warehouse.name,
                })))
            }
            setWarehouseData(responseWarehouse.data.map(e => ({
                value: e.id,
                label: e.name
            })))

            console.log(warehouse)
        }
        getData()
    }, [])

    const password = watch("password")
    const confirmPassword = watch("confirmPassword")
    const { addToast } = Toast()
    const navigate = useNavigate()
    const onSubmit = async (data) => {

        let response
        console.log("WAREHOUSE ID:", data.warehouseId)
        const warehouseId = data.warehouseId?.map(e => e.value)

        try {
            if (password !== confirmPassword) {
                addToast({
                    title: "As senhas devem ser iguais",
                    status: "warning"
                })
            } else {
                const url = id === undefined ? `users` : `/users/${id}`
                if (id === undefined) {
                    delete data.warehouseId

                    response = await api.post(url, {
                        ...data,
                        warehouse: warehouseId,
                        position: position.value
                    })
                } else {
                    delete data.warehouseId
                    response = await api.patch(url, {
                        ...data,
                        warehouse: warehouseId,
                        position: position.value,
                        userId: id
                    })
                }
                if (response.status === 201 || response.status === 200) {

                    if (type !== undefined) {
                        addToast({
                            title: "Senha actualizada com sucesso",
                            status: "success"
                        })
                        navigate("/dashboard/app")

                    } else {

                        addToast({
                            title: "Utilizador cadastrado com sucesso",
                            status: "success"
                        })
                        navigate("/dashboard/usuario")
                    }
                } else {
                    addToast({
                        title: "Ocorreu um erro ao cadastrar o usuario",
                        status: "warning"
                    })
                }
            }
        } catch (e) {
            console.log("Erro", e)
        }

    }
    return (
        <>
            <Helmet>
                <title> {type !== undefined ? 'Minha conta' : 'Cadastrar Utilizadores'} </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                    {type !== undefined ? ' Início > Minha Conta' : ' Início > Utilizadores > Cadastrar'}
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/usuario`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        {type !== undefined ? 'Minha Conta' : ' Gestão de utilizadores'}
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom> {type !== undefined ? 'Minha conta' : 'Cadastrar Utilizadores'}</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Nome"
                                fieldNameObject="name"
                                isDisabled={type !== undefined}
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
                                isDisabled={type !== undefined}
                                register={register}
                                type="email"
                                placeholder="Insira o email do utilizador aqui(exemplo@exemplo.com)"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName="Tipo de Utilizador"
                                fieldNameObject="position"
                                isDisabled={type !== undefined}
                                parent={{ value: 1 }}
                                options={usersTypes}
                                control={control}
                                isMulti={false}
                            />
                        </Box>

                        {position?.label !== 'Administrador' && <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName="Armazém"
                                fieldNameObject="warehouseId"
                                isDisabled={type !== undefined}
                                parent={{ value: 1 }}
                                options={warehouseData}
                                control={control}
                                isMulti
                            />
                        </Box>}
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Empresa"
                                fieldNameObject="company"
                                isDisabled={type !== undefined}
                                register={register}
                                type="text"
                                placeholder="Insira o nome da empresa aqui"
                            />
                        </Box>
                        {type !== undefined && <>

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
                                    fieldNameObject="confirmPassword"
                                    isDisabled={false}
                                    register={register}
                                    type="password"
                                    placeholder="Insira novamente a senha aqui"
                                />
                            </Box>
                        </>
                        }

                        <Box mt={5}>
                            <Button sx={{ maxWidth: "40%", height: "40px" }} mb={5} type="submit" onClick={() => { console.log("ERRORS", errors) }} variant="contained">
                                {type !== undefined || id !== undefined ? 'Actualizar' : 'Cadastrar'}
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}