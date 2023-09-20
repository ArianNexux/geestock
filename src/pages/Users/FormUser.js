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
import { Input } from '@chakra-ui/react'
// components
import Iconify from '../../components/iconify';

export default function FormUser() {
    return (
        <>
            <Helmet>
                <title> Cadastrar Utilizadores </title>
            </Helmet>

            <Container>
                <Stack direction="column" mb={5}>
                    <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Pagina de gestao de utilizadores
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar utilizadores</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <Box mb={5}>
                        <Input placeholder='Basic usage' sx={{ width: "70%", height: "40px", borderRadius: "5px", border: "1px solid grey" }} />
                    </Box>
                    <Box mb={5}>
                        <TextField variant="outlined" label="Email" type="email" sx={{ width: "70%" }} />
                    </Box>
                    <Box mb={5}>
                        <TextField variant="outlined" label="Email" type="email" sx={{ width: "70%" }} />
                    </Box>
                    <Box mb={5}>
                        <TextField variant="outlined" label="Email" type="email" sx={{ width: "70%" }} />
                    </Box>
                    <Box mt={5}>
                        <Button sx={{ maxWidth: "10%" }} mb={5} variant="contained">
                            Cadastrar
                        </Button>
                    </Box >
                </Container >
            </Container >

        </>
    )

}