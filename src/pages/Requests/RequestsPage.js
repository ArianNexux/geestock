import { Box } from '@chakra-ui/react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField
} from '@mui/material';
// components
import Label from '../../components/label/Label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';
import api from '../../utils/api';
import { AppContext } from '../../context/context';
import MyRequestNote from '../../components/InvoiceReciepment/request-note'
import { InputSearchSchema } from './schema.ts';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
import { Toast } from '../../components/Toast';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome da Requisição', alignRight: false },
  { id: 'pr', label: 'PR', alignRight: false },
  { id: 'company', label: 'Armazém de Origem', alignRight: false },
  { id: 'company', label: 'Armazém de Destino', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: '' },
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

export default function RequestsPage() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');
  const { addToast } = Toast()

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [actualId, setActualId] = useState(0);
  const [actualState, setActualState] = useState("");
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
    resolver: zodResolver(InputSearchSchema),
  });
  const handleOpenDocument = async () => {
    const url = `/request/${actualId}`
    const response = await api.get(url)
    console.log("nota de requisicao", response.data)

    MyRequestNote(response.data)
  }
  const handleOpenMenu = (event, id, state) => {
    setActualId(id)
    setActualState(state)
    setOpen(event.currentTarget);
  };

  const getData = async () => {
    try {
      const url = Number(userData.data.position) <= 1 ? `/request?onlyActive=1` : `/request/warehouseoutcomming/${curentWarehouse}?onlyActive=1`;
      const response = await api.get(url)
      setData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  const handleRejectRequest = async (e) => {
    const url = `/request/revert-request/${actualId}`
    const response = await api.put(url)
    setValue("search", { label: "Todos", value: "Todos" })
    if (response.status === 200 || response.status === 201) {
      addToast({
        title: "Requisição rejeitada com sucesso!",
        status: "success"
      })
      getData()

    }
  }
  const requestStatus = watch("search")

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
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = requestStatus.value !== "Todos" ? `/request/by-state/${requestStatus.value}` : Number(userData.data.position) <= 1 ? `/request?onlyActive=1` : `/request/warehouseoutcomming/${curentWarehouse}?onlyActive=1`;
          const response = await api.get(url)
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [requestStatus])

  const [data, setData] = useState([])
  const { userData, curentWarehouse } = useContext(AppContext)

  useEffect(() => {
    setValue("search", { label: 'Em Curso', value: 'Em Curso' })

    getData()
  }, [])

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [search, setSearch] = useState("")
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = Number(userData.data.position) <= 1 ? `/request/?searchParam=${search}&onlyActive=1` : `/request/warehouseoutcomming/${curentWarehouse}?onlyActive=1`;;
          const response = await api.get(url)
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [search, curentWarehouse])
  const handleSearch = async () => {
    try {

      const url = userData.data.position === "1" ? `/request/?searchParam=${search}&onlyActive=1` : `/request/warehouseoutcomming?searchParam=${search}&onlyActive=1`;
      const response = await api.get(url)
      setData(response.data)
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <Helmet>
        <title> Requisições </title>
      </Helmet>

      <Container>
        <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
           Início > Requisições
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestão de Requisições
          </Typography>
          <Box sx={{ width: "20%", display: "flex", justifyContent: "space-between" }}>
            {userData.data.position !== "1" && <><Button variant="contained" onClick={() => { navigate("/dashboard/requisicao/minhas") }} startIcon={<Iconify icon="eva:eye-fill" />}>
              Requisições Para mim
            </Button></>}
            {userData.data.position === "1" && <> <Button variant="contained" onClick={() => { navigate("/dashboard/requisicao/cadastrar") }} startIcon={<Iconify icon="eva:plus-fill" />}>
              Criar Requisição
            </Button></>}
          </Box>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "50px" }} >
          <Box sx={{ m: 1, minWidth: '40%', marginRight: '50px' }}>
            <CustomFormControlSelect
              errors={errors}
              control={control}
              label="Estado"
              isDisabled={false}
              fieldNameObject="search"
              fieldName="Estado"
              isMulti={false}
              parent={{ value: 1 }}
              options={
                [
                  { label: 'Todos', value: 'Todos' },
                  { label: 'Em Curso', value: 'Em Curso' },
                  { label: 'Finalizada', value: 'Finalizada' },
                  { label: 'Finalizada Parcialmente', value: 'Finalizada Parcialmente' },
                  { label: 'Rejeitada', value: 'Rejeitada' }
                ]
              }
              isSearchable
            />
          </Box>
          <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo nome ou Número PR" type="email" sx={{ minWidth: "50%" }} />
          <Button variant="contained" onClick={() => { handleSearch() }} startIcon={<Iconify icon="eva:search-fill" />} sx={{ maxHeight: "35px" }}>
            Pesquisar
          </Button>
        </Stack>

        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {data.map((row) => {
                    const { id, name, quantity, state, warehouseIncomming: { name: warehouseName }, warehouseOutcomming: { name: warehouseOriginName }, numberPr } = row;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" >

                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" style={{ textIndent: '20px' }} noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>


                        <TableCell align="left">{numberPr}</TableCell>

                        <TableCell align="left">{warehouseOriginName}</TableCell>

                        <TableCell align="left">{warehouseName}</TableCell>

                        <TableCell align="left">
                          <Label color={state === 'Finalizada' ? 'info' : state.toLowerCase() === 'finalizada parcialmente' ? 'warning' : state.toLowerCase() === 'rejeitada' ? 'error' : 'success'}>{sentenceCase(state)}</Label>
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => { handleOpenMenu(e, id, state) }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
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
            count={data.length}
            labelRowsPerPage={"Linhas por página"}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container >

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={() => { navigate(`/dashboard/requisicao/editar/${actualId}`) }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Ver mais
        </MenuItem>
        <MenuItem onClick={() => { handleOpenDocument() }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Imprimir
        </MenuItem>
        {actualState === "Em Curso" && (<MenuItem onClick={() => { handleRejectRequest() }} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Rejeitar
        </MenuItem>)}
      </Popover>
    </>
  );
}
