import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom'

import { useState, useEffect, useContext } from 'react';
// @mui
import {
    Card,
    Stack,
    Button,
    Container,
    Typography,
    TextField,
    Box,
    Paper,
    Table,
    Checkbox,
    TableContainer,
    TablePagination,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,

} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalInsertPiece } from '../../components/modal/modalInsertPiece';

// components
import Scrollbar from '../../components/scrollbar';

import Iconify from '../../components/iconify';
import { UserSchema } from './schema.ts';
import api from '../../utils/api';
import { AppContext } from '../../context/context';
import { Toast } from '../../components/Toast';
import TableRequest from '../../components/TableRequest';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import CustomFormControlInput from '../../components/CustomFormControlInput';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';

const TABLE_HEAD = [
    { id: 'name', label: 'Nome', alignRight: false },
    { id: 'partNumber', label: 'PN', alignRight: false },
    { id: 'quantity', label: 'Quantidade em stock', alignRight: false },
    { id: 'quantityRequested', label: 'Quantidade Requerida', alignRight: false },
];

const TABLE_HEAD_UPDATE = [
    { id: 'name', label: 'Nome', alignRight: false },
    { id: 'partNumber', label: 'PN', alignRight: false },
    { id: 'quantityRequested', label: 'Quantidade Requerida', alignRight: false },
];
// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
function createData(piece, quantity) {
    return { piece, quantity };
}
export default function FormRequests() {
    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = USERLIST.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        const selectedIndex = selected.findIndex(obj => obj.id === row.id);

        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
        console.log(newSelected)
    };
    const handleChangeQuantity = (event, row) => {
        const selectedIndex = selected.findIndex(obj => obj.id === row.id);
        selected[selectedIndex].quantityRequested = event.target.value;
        console.log(selected)
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };
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

    const navigate = useNavigate()
    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');
    const [actualId, setActualId] = useState(0);

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

    const warehouse = watch("container")
    const warehouseDestiny = watch("containerDestiny")
    const name = watch("name")
    const numberPr = watch("numberPr")
    const [data, setData] = useState([])
    const [dataPieces, setDataPieces] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [Open, setOpen] = useState(false)
    const { userData } = useContext(AppContext)
    const { id } = useParams()
    const [rows, setRows] = useState([])
    const [search, setSearch] = useState("")
    const filteredUsers = applySortFilter(id === undefined || id === '' ? dataPieces : rows, getComparator(order, orderBy), filterName);
    const isNotFound = !filteredUsers.length && !!filterName;
    useEffect(() => {
        const getData = async () => {
            try {
                const url = `/warehouse`;
                const response = await api.get(url)
                setData(response.data.filter(e => e.id !== userData.data.warehouse.id).map(e => ({
                    value: e.id,
                    label: e.name
                })))
                const urlPieces = `/piece/warehouse/${response.data[0].id}`;
                const responsePieces = await api.get(urlPieces)
                setDataPieces([...responsePieces.data])
                console.log("LOGAR", response.data)
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [])

    useEffect(() => {
        const getData = async () => {
            try {
                const urlPieces = `/piece/warehouse/${warehouse.value}`;
                const responsePieces = await api.get(urlPieces)
                setDataPieces([...responsePieces.data])
            } catch (e) {
                console.log(e)
            }
        }
        setValue("piece", null)
        getData()
    }, [warehouse])
    useEffect(() => {
        const getData = async (data) => {
            const url = `/request/${id}`
            const response = await api.get(url)
            console.log("FINAL RESPONSE", response.data)
            setValue("name", response.data.name)
            setValue("numberPr", response.data.numberPr)
            setValue("container", { label: response.data.warehouseIncomming.name, value: response.data.warehouseIdIncomming })
            setValue("containerDestiny", { label: response.data.warehouseOutcomming.name, value: response.data.warehouseIdOutcomming })
            console.log(response.data.RequestsPieces)
            setRows(
                response.data.RequestsPieces.map((e) => ({
                    quantity: Number(e.quantity),
                    piece: e.piece.name,
                    name: e.piece.name,
                    partNumber: e.piece.partNumber,
                    description: e.piece.description,
                    price: Number(e.piece.price)
                })))

            setDataPieces(response.data.RequestsPieces.map((e) => ({
                quantity: Number(e.quantity),
                piece: { label: e.piece.name, value: e.pieceId },
                price: Number(e.piece.price)
            })))
        }

        getData()
    }, [])

    const handleSearch = async () => {
        try {

            const url = `/piece/warehouse/${warehouse.value}?searchParam=${search}`;
            const response = await api.get(url)
            setDataPieces(response.data)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const getData = async () => {
            try {
                if (search.length <= 1) {
                    const url = `/piece/warehouse/${warehouse.value}`;
                    const response = await api.get(url)
                    setDataPieces(response.data)
                }
            } catch (e) {
                console.log(e)
            }
        }
        getData()
    }, [search])

    const onSubmit = async (data) => {
        console.log(errors)
        console.log(data)
        try {
            const data = {
                name,
                request: selected.map(row => ({
                    pieceId: row.id,
                    quantity: Number(row.quantityRequested)
                })),
                warehouseIdOutcomming: warehouseDestiny.value,
                warehouseIdIncomming: warehouse.value,
                numberPr,
                userId: userData.data.id
            }

            let response;
            const url = id === undefined ? `request` : `/request/${id}`
            if (id === undefined || id === '') {
                response = await api.post(url, {
                    ...data,
                    state: "Em Curso"

                })
            } else {
                response = await api.patch(url, {
                    ...data,
                    id
                })
            }
            if (response.status === 201) {
                addToast({
                    title: "Requisição feita com sucesso, O Armazem receberá para análise!",
                    status: "success"
                })
                navigate("/dashboard/requisicao")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Requisições </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
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
                <form onSubmit={handleSubmit(onSubmit)}>

                    <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName={`Nome da Requisição`}
                                fieldNameObject="name"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o nome da requisição..."
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName={`Número da PR`}
                                fieldNameObject="numberPr"
                                isDisabled={false}
                                register={register}
                                type="text"
                                placeholder="Insira o número da PR da requisição..."
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName={`Armazém Destino`}
                                fieldNameObject="containerDestiny"
                                isDisabled={id !== undefined}
                                parent={{ value: 1 }}
                                options={data}
                                control={control}
                                isMulti={false}

                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlSelect
                                errors={errors}
                                fieldName={`Armazém Origem`}
                                fieldNameObject="container"
                                isDisabled={id !== undefined}
                                parent={{ value: 1 }}
                                options={data}
                                control={control}
                                isMulti={false}

                            />
                        </Box>




                        <Card>

                            <Scrollbar>
                                {id !== undefined || id !== '' && <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "10px" }} >
                                    <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo Part Number ou Nome da Peça" type="email" sx={{ minWidth: "50%" }} />
                                    <Button variant="contained" onClick={() => { handleSearch() }} startIcon={<Iconify icon="eva:search-fill" />} sx={{ maxHeight: "35px" }}>
                                        Pesquisar
                                    </Button>
                                </Stack>}
                                <TableContainer sx={{ minWidth: 900 }}>
                                    <Table>
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={id !== undefined ? TABLE_HEAD_UPDATE : TABLE_HEAD}
                                            rowCount={USERLIST.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                            showColumnCheckbox
                                        />
                                        <TableBody>
                                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, name, description, quantity, partNumber } = row;
                                                const selectedUser = selected.findIndex(obj => obj.id === id) !== -1;

                                                return (

                                                    <>

                                                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                            <TableCell padding="checkbox">
                                                                <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row)} />
                                                            </TableCell>
                                                            <TableCell component="th" scope="row" padding="none">
                                                                <Typography variant="subtitle2" style={{ textIndent: '20px' }}>
                                                                    {name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left">{partNumber}</TableCell>



                                                            <TableCell align="left">{quantity}</TableCell>
                                                            {
                                                                id !== undefined &&
                                                                <TableCell align="left">
                                                                    <Box mb={5}>
                                                                        <Input
                                                                            placeholder={"Insira a quantidade number"}
                                                                            type="number"
                                                                            disabled={!selectedUser}
                                                                            minRows={0}
                                                                            onBlur={(e) => {
                                                                                handleChangeQuantity(e, row)
                                                                            }}
                                                                            sx={{ width: "100px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                                                        />

                                                                    </Box>
                                                                </TableCell>


                                                            }

                                                        </TableRow>
                                                    </>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>

                                        {isNotFound && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                        <Paper
                                                            sx={{
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <Typography variant="h6" paragraph>
                                                                Not found
                                                            </Typography>

                                                            <Typography variant="body2">
                                                                No results found for &nbsp;
                                                                <strong>&quot;{filterName}&quot;</strong>.
                                                                <br /> Try checking for typos or using complete words.
                                                            </Typography>
                                                        </Paper>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>

                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={USERLIST.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Card>
                        { /*  <TableRequest
                            rows={rows}
    />   */ }

                        <Box mt={5}>
                            <Button sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained" onClick={() => { console.log(errors) }} type="submit">
                                Cadastrar
                            </Button>
                        </Box >
                    </Container >
                </form >
            </Container >

        </>
    )

}