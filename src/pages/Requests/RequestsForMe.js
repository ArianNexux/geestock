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
import { Toast } from '../../components/Toast';
import { ModalConfirmRequest } from '../../components/modal/modalConfirmRequest';
import MyRequestNote from '../../components/InvoiceReciepment/request-note'
import { InputSearchSchema } from './schema.ts';
import CustomFormControlSelect from '../../components/CustomFormControlSelect';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome da Requisição', alignRight: false },
  { id: 'pr', label: 'PR', alignRight: false },
  { id: 'company', label: 'Armazem de Destino', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: '', label: '', alignRight: false },
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

export default function RequestsForMe() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const [currentId, setCurrentId] = useState("0")

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);
  const [actualState, setActualState] = useState(false)
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { addToast } = Toast()
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

  const requestStatus = watch("search")

  const handleOpenMenu = (event, id, state) => {
    console.log(id)
    setOpen(event.currentTarget);
    setCurrentId(id)
    setActualState(state.toString().toLowerCase().includes("finalizada"))
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          let url = ""
          if (requestStatus.value === "Todos" && Number(userData.data.position) == 1) {
            url = "/request?onlyActive=1"
          } else if (requestStatus.value !== "Todos" && Number(userData.data.position) == 1) {
            url = `/request/by-state/${requestStatus.value}`
          } else if (requestStatus.value === "Todos" && Number(userData.data.position) == 2) {
            url = `/request/warehouseoutcomming/${curentWarehouse ?? curentWarehouse.id}?onlyActive=1`
          } else {
            url = `/request/by-state/${requestStatus.value}?warehouseId=${curentWarehouse ?? curentWarehouse.id}`
          }
          const response = await api.get(url)
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [requestStatus])
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
  const handleOpenDocument = async () => {
    const url = `/request/${currentId}`
    const response = await api.get(url)
    console.log("nota de requisicao", response.data)
    MyRequestNote(response.data)
  }
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
  const [data, setData] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const { userData, curentWarehouse } = useContext(AppContext)
  const getData = async () => {
    try {
      const url = `/request/warehouseoutcomming/${curentWarehouse}?onlyActive=1`;
      const response = await api.get(url)
      setData(response.data)
      console.log("LOGAR", response.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    setValue("search", { label: 'Em Curso', value: 'Em Curso' })


    getData()
  }, [])
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [search, setSearch] = useState("")
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          let url = ""
          if (requestStatus.value === "Todos" && Number(userData.data.position) == 1) {
            url = "/request?onlyActive=1"
          } else if (requestStatus.value !== "Todos" && Number(userData.data.position) == 1) {
            url = `/request/by-state/${requestStatus.value}`
          } else if (requestStatus.value === "Todos" && Number(userData.data.position) == 2) {
            url = `/request/warehouseoutcomming/${curentWarehouse ?? curentWarehouse.id}?onlyActive=1`
          } else {
            url = `/request/by-state/${requestStatus.value}?warehouseId=${curentWarehouse ?? curentWarehouse.id}`
          }
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

      const url = `/request/warehouseoutcomming/${curentWarehouse}?searchParam=${search}&onlyActive=1`;
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
           Início > Requisições > Requisições Para mim
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
          <Typography variant="h4" gutterBottom>
            Requisições para mim
          </Typography>

          {userData.data?.position === "1" && <Button variant="contained" onClick={() => { navigate("/dashboard/requisicao/cadastrar") }} startIcon={<Iconify icon="eva:plus-fill" />}>
            Enviar Requisição
          </Button>}
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
                  {
                    data.map((row) => {

                      const { id, state, name, numberPr, warehouseIncomming: { name: warehouseName } } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" >


                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{numberPr}</TableCell>
                          <TableCell align="left">{warehouseName}</TableCell>



                          <TableCell align="left">
                            <Label color={state === 'Finalizada' ? 'info' : state.toLowerCase() === 'finalizada parcialmente' ? 'warning' : state.toLowerCase() === 'rejeitada' ? 'error' : 'success'}>{sentenceCase(state)}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={(e) => { handleOpenMenu(e, id, state); }}>
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
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={"Linhas Por Página"}
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
        {!actualState ?
          (<MenuItem onClick={(e) => {
            setIsOpen(true)
          }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Aceitar
          </MenuItem>)
          :
          (<MenuItem onClick={() => { navigate(`/dashboard/requisicao/editar/${currentId}`) }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Ver mais
          </MenuItem>)
        }
        <MenuItem onClick={() => { handleOpenDocument() }}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Imprimir
        </MenuItem>
      </Popover>
      <ModalConfirmRequest
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        id={currentId}
        callBack={getData}
      />
    </>
  );
}
