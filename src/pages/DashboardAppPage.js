import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';
// @mui
import { useTheme } from '@mui/material/styles';
// components
// sections
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
  Grid,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  TableContainer,
  TablePagination,
  TextField
} from '@mui/material';
import api from '../utils/api'
import Scrollbar from '../components/scrollbar';
import SvgColor from '../components/svg-color';
import Iconify from '../components/iconify';

import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { AppContext, AuthContext } from '../context/context';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'partNumber', label: 'PN', alignRight: false },
  { id: 'description', label: 'Descrição', alignRight: false },
  { id: 'quantity', label: 'Quantidade', alignRight: false },
];

const TABLE_HEAD_ALL = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'partNumber', label: 'PN', alignRight: false },
  { id: 'warehouse', label: 'Armazém', alignRight: false },
  { id: 'description', label: 'Descrição', alignRight: false },
  { id: 'quantity', label: 'Quantidade', alignRight: false },
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

export default function DashboardAppPage() {
  const theme = useTheme();
  const iconPng = (name) => <SvgColor src={`/assets/icons/navbar/${name}.png`} sx={{ width: 1, height: 1 }} />;
  const { userData } = useContext(AppContext)
  const [dashboard, setDashboard] = useState({})
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('Todos')

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [warehouseData, setDataWarehouse] = useState([]);
  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [actualId, setActualId] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState(0);
  const handleOpenMenu = (event, id) => {
    setOpen(event.currentTarget);
    setActualId(id)

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

  const [data, setData] = useState([])
  const [search, setSearch] = useState("")
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => {
    const getData = async () => {
      const response = await api.get('/dashboard')
      setDashboard(response.data)
      try {
        const url = filter !== "Todos" ? `/piece/warehouse/${filter}` : `/piece`;
        const response = await api.get(url)
        const responseWarehouse = await api.get("/warehouse")
        setData(response.data)
        setDataWarehouse(responseWarehouse.data)
        console.log("WAREHOUSE DATA", response.data)
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [])

  const handleSearch = async () => {
    try {

      const url = filter !== "Todos" ? `/piece/warehouse/${filter}?searchParam=${search}` : `/piece?searchParam=${search}`;
      const response = await api.get(url)
      setData(response.data)
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
  const handleChange = async (e) => {
    setFilter(e.target.value)
    try {
      const url = e.target.value !== "Todos" ? `/piece/warehouse/${e.target.value}` : `/piece?searchParam=${search}`
      const response = await api.get(url)
      setData(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = filter !== "Todos" ? `/piece/warehouse/${filter}` : `/piece`;
          const response = await api.get(url)
          setData(response.data)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getData()
  }, [search])
  console.log("Vendo o user data aqui:", userData)
  return (
    <>
      <Helmet>
        <title> Dashboard | GESSTOCK </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Bem-Vindo de Volta
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Requisições" total={dashboard?.request} icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Armazéns" total={dashboard?.warehouse} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Encomendas" total={dashboard?.order} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Peças" total={dashboard?.piece} color="error" icon={'ant-design:bug-filled'} />
          </Grid>

          <Grid item xs={12} md={6} lg={12}>
            <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "10px" }} >
              <FormControl variant="standard" sx={{ m: 1, minWidth: '40%', marginRight: '50px' }}>
                <InputLabel id="demo-simple-select-standard-label">Armazém</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filter}
                  label="Armazém"
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={'Todos'}>Todos</MenuItem>
                  {
                    warehouseData.length > 0 && warehouseData.map(e => (
                      <MenuItem value={e.id}>{e.name}</MenuItem>

                    ))
                  }
                </Select>
              </FormControl>
              <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo Part Number ou Nome da Peça" type="email" sx={{ minWidth: "40%" }} />
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
                      headLabel={filter === "Todos" ? TABLE_HEAD_ALL : TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                        row.warehouse = filter === "Todos" ? row.warehouse : { name: '' }
                        const { id, name, description, quantity, partNumber, warehouse: { name: warehouseName } } = row;
                        const selectedUser = selected.indexOf(description) !== -1;

                        return (

                          <>

                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>

                              <TableCell component="th" scope="row" padding="none">
                                <Typography variant="subtitle2" style={{ textIndent: '20px' }}>
                                  {name}
                                </Typography>
                              </TableCell>
                              <TableCell align="left">{partNumber}</TableCell>

                              {filter === "Todos" && <TableCell align="left">{warehouseName}</TableCell>}

                              <TableCell align="left">{description}</TableCell>

                              <TableCell align="left">{quantity}</TableCell>



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
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
