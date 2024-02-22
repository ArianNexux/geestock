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
import { UserSchema } from './schema.ts';
import { Toast } from '../../components/Toast';
import api from '../../utils/api';

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
    const [warehouseData, setWarehouseData] = useState([])
    const warehouse = watch("warehouseId")
    const position = watch("position")
    const { id } = useParams()

    const roles = [
        { label: "Armazéns", value: "1" },
        { label: "Peças", value: "2" },
        { label: "Requisições", value: "3" },
        { label: "Ultilizadores", value: "4" },
        { label: "Categorias", value: "5" },
        { label: "Alertas", value: "6" },
        { label: "Transporte", value: "7" },
        { label: "Nota de Entrega", value: "8" },
    ]

    const usersTypes = [
        { label: "Administrador", value: "1" },
        { label: "Gestor de Armazem", value: "2" },
        { label: "Funcionário", value: "3" },
    ]

    useEffect(() => {

        const getData = async () => {
            const responseWarehouse = await api.get(`${GET_WAREHOUSE}?searchParam= `)
            if (id !== undefined) {
                const response = await api.get(`users/${id}`)
                console.log("NOVA DATA", response)
                setValue("name", response.data.name)
                setValue("email", response.data.email)
                setValue("company", response.data.company)
                setValue("position", usersTypes[Number(response.data.position) - 1])
                setValue("warehouseId", { label: response.data.warehouse?.name, value: response.data.warehouse?.id })
            }
            setWarehouseData(responseWarehouse.data.map(e => ({
                value: e.id,
                label: e.name
            })))
        }
        getData()
    }, [])

    const password = watch("password")
    const confirmPassword = watch("confirmPassword")
    const { addToast } = Toast()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        let response
        try {
            if (password !== confirmPassword) {
                addToast({
                    title: "As senhas devem ser iguais",
                    status: "warning"
                })
            } else {
                const url = id === undefined ? `users` : `/users/${id}`
                if (id === undefined) {
                    response = await api.post(url, {
                        ...data,
                        warehouseId: warehouse.value,
                        position: position.value
                    })
                } else {
                    response = await api.patch(url, {
                        ...data,
                        warehouseId: warehouse.value,
                        position: position.value,
                        userId: id
                    })
                }
                console.log()
                if (response.status === 201 || response.status === 200) {
                    addToast({
                        title: "Usuário cadastrado com sucesso",
                        status: "success"
                    })
                    navigate("/dashboard/usuario")
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
                <title> Cadastrar Utilizadores </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                Início > Utilizadores > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/usuario`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
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
                    <form onSubmit={handleSubmit(onSubmit)}>

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
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName="Tipo de Usuário"
                                fieldNameObject="position"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={usersTypes}
                                control={control}
                                isMulti={false}
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName="Armazém"
                                fieldNameObject="warehouseId"
                                isDisabled={false}
                                parent={{ value: 1 }}
                                options={warehouseData}
                                control={control}
                                isMulti={false}
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
                                fieldNameObject="confirmPassword"
                                isDisabled={false}
                                register={register}
                                type="password"
                                placeholder="Insira novamente a senha aqui"
                            />
                        </Box>

                        <Box mt={5}>
                            <Button sx={{ maxWidth: "40%", height: "40px" }} mb={5} type="submit" variant="contained">
                                Cadastrar
                            </Button>
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}