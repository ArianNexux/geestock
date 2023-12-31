import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
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
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import { Toast } from '../../components/Toast';
import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { SubcategorySchema } from './schema.ts';
import { GET_CATEGORY } from '../../utils/endpoints';
import api from '../../utils/api';

export default function FormSubcategory() {
    
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
    resolver: zodResolver(SubcategorySchema),
  });

    const category = watch("category")
    const [categoryData, setCategoryData] = useState([])

    const { addToast } = Toast()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
  
        try {
            const response = await api.post("/subcategory", {
                ...data,
                categoryId: category.value
            })
            if (response.status === 201) {
                addToast({
                    title: "Subcategoria cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/subcategoria")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    useEffect(() => {

        const getData = async () => {
            const responseCategories = await api.get(GET_CATEGORY)

            setCategoryData(responseCategories.data.map(e => ({
                value: e.id,
                label: e.name
            })))
        }
        getData()
    }, [])
    return (
        <>
            <Helmet>
                <title> Sub-Categoria Peças </title>
            </Helmet>
            
            <Container>
                    <Typography variant="p" sx={{borderBottom: "1px solid black", marginBottom:"10px"}} gutterBottom>
                Início > Sub-Categoria > Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                       Gestão de Sub-Categoria
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Sub-Categoria</Typography>
                </Stack>
                <form  onSubmit={handleSubmit(onSubmit)}>

                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <Box mb={5}>
                        <CustomFormControlInput 
                            errors={errors}
                            fieldName="Nome"
                            fieldNameObject="name"
                            isDisabled={false}
                            register={register}
                            type="text"
                            placeholder="Insira o nome da subcategoria aqui"
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
                            placeholder="Insira o codigo aqui..."
                        />
                    </Box>
                    <Box mb={5}>
                       <CustomFormControlSelect 
                         errors={errors}
                         fieldNameObject="category"
                         isDisabled={false}
                         parent={{value: 1}}
                         options={categoryData}
                         fieldName="Categoria"
                         control={control}
                         isMulti={false}
                       />
                    </Box>
                    <Box mt={5}>
                        <Button sx={{ maxWidth: "40%", height:"40px" }} mb={5} type="submit" variant="contained">
                            Cadastrar
                        </Button>
                    </Box >
                </Container >
                </form>
            </Container >

        </>
    )

}