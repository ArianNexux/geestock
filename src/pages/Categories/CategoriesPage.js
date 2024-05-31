import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { AppContext } from '../../context/context';
import Label from '../../components/label/Label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';
import api from '../../utils/api';
import { GET_CATEGORY } from '../../utils/endpoints';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'company', label: 'Código', alignRight: false },
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

export default function CategoryPage() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const { userData } = useContext(AppContext)
  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [status, setStatus] = useState(false);

  const [data, setData] = useState([])
  const [actualId, setActualId] = useState(0);


  useEffect(() => {

    const getData = async () => {
      const responseCategories = await api.get(GET_CATEGORY)
      setData(responseCategories.data)
    }
    getData()
  }, [])
  const handleOpenMenu = (event, id, isActive) => {
    setActualId(id)
    setStatus(isActive)
    setOpen(event.currentTarget);
  };

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

  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  const [search, setSearch] = useState("")
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = `/category?onlyActive=${userData.data.position === "1" ? "0" : "1"}`;
          const response = await api.get(url)
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [search])
  const handleSearch = async () => {
    try {

      const url = `/category?searchParam=${search}&onlyActive=${userData.data.position === "1" ? "0" : "1"}`;
      const response = await api.get(url)
      setData(response.data)
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
  const handleChangeStatus = async (e) => {
    try {

      const url = `category/change-status/${actualId}?status=${status ? 0 : 1}`;
      await api.get(url)
      const response = await api.get('/category')
      setData(response.data)

      setOpen(false);

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <Helmet>
        <title> Categorias </title>
      </Helmet>

      <Container>
        <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
           Início > Categorias
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestão de Categorias
          </Typography>
          <Button variant="contained" onClick={() => { navigate("/dashboard/categoria/cadastrar") }} startIcon={<Iconify icon="eva:plus-fill" />}>
            Cadastrar Categoria
          </Button>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "50px" }} >
          <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo nome ou codigo da categoria" type="email" sx={{ minWidth: "50%" }} />
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
                  {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, code, isActive } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>


                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {name}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{code}</TableCell>

                        <TableCell align="left">
                          <Label color={isActive ? 'success' : 'error'}>{isActive ? 'Activo' : 'Inactivo'}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => { handleOpenMenu(e, id, isActive) }}>
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
            rowsPerPage={rowsPerPage}
            labelRowsPerPage={"Linhas por página"}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
          <MenuItem onClick={() => { navigate(`/dashboard/categoria/editar/${actualId}`) }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            Editar
          </MenuItem>

          <MenuItem onClick={() => { handleChangeStatus() }} >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            {!status ? 'Activar' : 'Desactivar'}
          </MenuItem>
        </Popover>
      </Container >


    </>
  );
}
