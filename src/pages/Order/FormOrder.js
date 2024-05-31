/** eslint-disabled */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    TableBody,
    TableCell,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Input } from '@chakra-ui/react'
import { zodResolver } from "@hookform/resolvers/zod";

import CustomFormControlTextArea from '../../components/CustomFormControlTextArea';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import Scrollbar from '../../components/scrollbar';

import { ModalInsertPiece } from '../../components/modal/modalInsertPiece';
import { AppContext } from '../../context/context';
import CustomFormControlInput from '../../components/CustomFormControlInput';
// components
import Iconify from '../../components/iconify';
import { OrderSchema } from './schema.ts';
import api from '../../utils/api'
import { Toast } from '../../components/Toast';
import { GET_CATEGORY, GET_SUBCATEGORY, GET_PIECES } from '../../utils/endpoints';
import TableRequest from '../../components/TableRequest';

import USERLIST from '../../_mock/user';
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';

const TABLE_HEAD = [
    { id: 'name', label: 'Nome', alignRight: false },
    { id: 'partNumber', label: 'PN', alignRight: false },
    { id: 'quantity', label: 'Quantidade em stock', alignRight: false },
    { id: 'quantityRequested', label: 'Quantidade', alignRight: false },
    { id: 'price', label: 'Preço', alignRight: false },

];

const TABLE_HEAD_UPDATE = [
    { id: 'name', label: 'Nome', alignRight: false },
    { id: 'partNumber', label: 'PN', alignRight: false },
    { id: 'quantityRequested', label: 'Quantidade', alignRight: false },
    { id: 'quantityReceived', label: 'Quantidade Recebida', alignRight: false },
    { id: 'quantityMiss', label: 'Quantidade em falta', alignRight: false },
    { id: 'price', label: 'Preço Unitário', alignRight: false },
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
    const stabilizedThis = array?.map((el, index) => [el, index]);
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
export default function FormOrder() {

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
        resolver: zodResolver(OrderSchema),
    });
    const { addToast } = Toast()

    const pieceId = watch("pieceId")
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [actualId, setActualId] = useState(0);
    const [isFinished, setIsFinished] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [rows, setRows] = useState([])
    const { userData } = useContext(AppContext)
    const [dataPieces, setDataPieces] = useState([])
    const { id } = useParams()
    const [search, setSearch] = useState("")
    const filteredUsers = applySortFilter(id === undefined || id === '' ? dataPieces : rows, getComparator(order, orderBy), filterName);
    const isNotFound = !filteredUsers.length && !!filterName;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;
    const [Open, setOpen] = useState(false)

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
    }

    const handleChangePrice = (event, row) => {
        const selectedIndex = selected.findIndex(obj => obj.id === row.id);
        selected[selectedIndex].price = event.target.value;
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
    const handleSearch = async () => {
        try {

            const url = `/piece?searchParam=${search}`;
            const response = await api.get(url)
            setDataPieces(response.data)
            console.log(response.data)

        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const getData = async () => {
            const url = Number(userData.data?.position) > 2 ? `/piece/warehouse/${userData.data.warehouse.id}` : `/piece`;
            const responsePiece = await api.get(url)
            setDataPieces([...responsePiece.data])
        }
        const fullFillFormData = async (data) => {
            const url = `/order/${id}`
            const response = await api.get(url)
            setIsFinished(response.data.state === 'Finalizada')
            setValue("description", response.data.description)
            setValue("reference", response.data.reference)
            setValue("imbl_awb", response.data.imbl_awb)
            setValue("number_order", response.data.number_order)
            setDataPieces(response.data.OrdersPiece)
            setRows(
                response.data.OrdersPiece.map((e) => ({
                    quantity: Number(e.quantity),
                    quantityGiven: Number(e.quantityGiven),
                    piece: e.Piece.name,
                    name: e.Piece.name,
                    partNumber: e.Piece.partNumber,
                    description: e.Piece.description,
                    price: Number(e.price),
                    warehouse: e.warehouse
                })))
        }
        if (id !== undefined) {
            fullFillFormData()
        }
        getData()
    }, [])

    const onSubmit = async (data) => {
        if (selected.length <= 0) {
            addToast({
                title: "Selecione pelo menos uma peça para prosseguir a encomenda",
                status: "warning"
            })
            return;
        }


        try {

            let response;
            const url = id === undefined ? `order` : `/order/${id}`


            if (id === undefined || id === '') {
                response = await api.post(url, {
                    ...data,
                    request: selected.map(row => ({
                        pieceId: row.id,
                        quantity: Number(row.quantityRequested),
                        price: row.price
                    })),
                    userId: userData.data.id
                })
            } else {
                response = await api.patch(url, {
                    ...data,
                    id,
                    request: rows.map(r => ({
                        pieceId: r.piece.value,
                        quantity: r.quantity,
                        price: r.price
                    })),
                    userId: userData.data.id

                })
            }


            if (response.status === 201) {
                addToast({
                    title: "Encomenda cadastrada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/encomenda")
            }
            if (response.status === 200) {
                addToast({
                    title: "Encomenda actualizada com sucesso",
                    status: "success"
                })
                navigate("/dashboard/encomenda")
            }
        } catch (e) {
            console.log("Erro", e)
        }
    }
    return (
        <>
            <Helmet>
                <title> Cadastrar Encomendas </title>
            </Helmet>

            <Container>
                <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
                    Início {'>'} Encomendas {'>'} Cadastrar
                </Typography>
                <Stack direction="column" mt={3} mb={5}>
                    <Button onClick={() => { navigate(`/dashboard/encomenda`) }} sx={{ maxWidth: "10%" }} mb={5} variant="contained" startIcon={<Iconify icon="eva:arrow-back-fill" />}>
                        Voltar
                    </Button>
                    <Typography variant="h4" mt={3} gutterBottom>
                        Gestão de Encomendas
                    </Typography>

                </Stack>
                <Stack>
                    <Typography variant="body2" gutterBottom>Cadastrar Encomendas</Typography>
                </Stack>
                <Container sx={{ backgroundColor: "white", width: "100%", padding: "40px" }} display="flex" flexDirection="column" alignContent="space-between">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box mb={5}>
                            <CustomFormControlTextArea
                                errors={errors}
                                fieldName="Nome da Encomenda"
                                fieldNameObject="description"
                                isDisabled={isFinished}
                                register={register}
                                isRequired={false}
                                placeholder="Nome da Encomenda"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="BL/AWB"
                                fieldNameObject="imbl_awb"
                                isDisabled={isFinished}
                                register={register}
                                isRequired={false}
                                placeholder="IMBL/AWB"
                            />
                        </Box>
                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Nº da Encomenda"
                                fieldNameObject="number_order"
                                isDisabled={isFinished}
                                register={register}
                                isRequired={false}
                                placeholder="Nº da Encomenda"
                            />
                        </Box>

                        <Box mb={5}>
                            <CustomFormControlInput
                                errors={errors}
                                fieldName="Referencia"
                                fieldNameObject="reference"
                                isDisabled={isFinished}
                                register={register}
                                isRequired={false}
                                type="text"
                                placeholder="Insira a referência aqui"
                            />
                        </Box>
                        <Card>

                            <Scrollbar>
                                {id !== undefined || id !== '' && <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "10px" }} >
                                    <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo Part Number ou Nome da Peça" type="text" sx={{ minWidth: "50%" }} />
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
                                                const { id, name, description, quantity, partNumber, price, quantityGiven } = row;
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
                                                                id !== undefined ? (
                                                                    <>
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
                                                                        <TableCell align="left">
                                                                            <Box mb={5}>
                                                                                <Input
                                                                                    placeholder={"Insira o preço"}
                                                                                    type="number"
                                                                                    disabled={!selectedUser}
                                                                                    minRows={0}
                                                                                    onBlur={(e) => {
                                                                                        handleChangePrice(e, row)
                                                                                    }}
                                                                                    sx={{ width: "100px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                                                                />

                                                                            </Box>
                                                                        </TableCell>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <TableCell align="left">{quantityGiven}</TableCell>
                                                                        <TableCell align="left">{quantity - quantityGiven}</TableCell>
                                                                        <TableCell align="left">{price}</TableCell>
                                                                    </>

                                                                )


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

                        <Box mt={5}>
                            {id === undefined && <Button type="submit" sx={{ maxWidth: "40%", height: "40px" }} mb={5} variant="contained">
                                Cadastrar
                            </Button>}
                        </Box >
                    </form>
                </Container >
            </Container >

        </>
    )

}