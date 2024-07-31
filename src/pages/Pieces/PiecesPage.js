import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/Toast'

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
  Box,
  Modal,
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
// ----------------------------------------------------------------------
import axios from 'axios'
const TABLE_HEAD = [
  { id: 'name', label: 'Nome', alignRight: false },
  { id: 'partNumber', label: 'PN', alignRight: false },
  { id: 'quantity', label: 'Quantidade', alignRight: false },
  { id: 'price', label: 'Preço Médio', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
  { id: '' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

export default function PiecesPage() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate()
  const [page, setPage] = useState(0);
  const { userData, curentWarehouse } = useContext(AppContext)
  const [file, setFile] = useState(null);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');
  const [status, setStatus] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [actualId, setActualId] = useState(0);
  const [pieceWarehouseId, setPieceWarehouseId] = useState(0);
  const [locationInWarehouseData, setLocationInWarehouseData] = useState("");
  const [openUpload, setOpenUpload] = useState(false);
  const { addToast } = Toast()

  const handleOpen = () => setOpenUpload(true);
  const handleClose = () => setOpenUpload(false);
  const handleOpenMenu = (event, id, isActive, pieceWarehouseId, locationInWarehouse) => {
    setActualId(id)
    setOpen(event.currentTarget);
    setStatus(isActive);
    setPieceWarehouseId(pieceWarehouseId)
    setLocationInWarehouseData(locationInWarehouse)
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleDownloadFiles = async () => {
    const res = await api.get('/piece/download-excel/' + curentWarehouse)
    if (res.status === 200) {
      console.log(res.data.output)
      window.open("http://192.168.1.5:3001/piece-data.xlsx")
    }
  }

  const handleDownloadModel = () => {
    window.open(process.env.FILES_URL + '/pieces.xlsx')
  }

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
  const filteredUsers = applySortFilter(data, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;

  const handleSubmitFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const resp = await api.post('/piece/insert-excell', formData, {
      headers: {
        "content-type": "multipart/form-data",
      },

    });
    if (resp.status === 201) {
      addToast({
        title: "Ficheiro carregado com sucesso",
        status: "success"
      })
      getData()
    }
    setOpenUpload(false)

  };

  const getData = async () => {

    try {
      const url = Number(userData.data?.position) > 1 ? `/piece/warehouse/${curentWarehouse}?onlyActive=${userData.data.position === "1" ? "0" : "1"}` : `/piece?onlyActive=${userData.data.position === "1" ? "0" : "1"}`;
      const response = await api.get(url)
      setData(response.data)
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const [search, setSearch] = useState("")
  useEffect(() => {
    const getData = async () => {
      try {
        if (search.length <= 1) {
          const url = Number(userData.data?.position) > 1 ? `/piece/warehouse/${curentWarehouse}?onlyActive=${userData.data.position === "1" ? "0" : "1"}` : `/piece?onlyActive=${userData.data.position === "1" ? "0" : "1"}`;
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

      const url = `/piece?searchParam=${search}&onlyActive=${userData.data.position === "1" ? "0" : "1"}`;
      const response = await api.get(url)
      setData(response.data)
      console.log(response.data)

    } catch (e) {
      console.log(e)
    }
  }
  const handleChangeStatus = async (e) => {
    try {

      const url = `piece/change-status/${actualId}?status=${status ? 0 : 1}`;
      await api.get(url)
      const response = await api.get('/piece')
      setData(response.data)

      setOpen(false);

    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <Helmet>
        <title> Peças </title>
      </Helmet>

      <Container>
        <Typography variant="p" sx={{ borderBottom: "1px solid black", marginBottom: "10px" }} gutterBottom>
           Início > Peças
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3} mb={5}>
          <Typography variant="h4" gutterBottom>
            Gestão de Peças
          </Typography>
          <Box>

            {userData.data.position !== "2" && <Button variant="contained" onClick={() => { navigate("/dashboard/peca/cadastrar") }} startIcon={<Iconify icon="eva:plus-fill" />}>
              Cadastrar Peça
            </Button>}
            <Button style={{ marginLeft: '10px' }} variant="contained" onClick={handleOpen} startIcon={<Iconify icon="eva:upload-fill" />}>
              Carregar Peças
            </Button>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ justifyContent: "flex-end", alignContent: "center", marginBottom: "50px" }} >
          <TextField variant="standard" onChange={(e) => { setSearch(e.target.value); }} label="Pesquisar pelo Part Number ou Nome da Peça" type="email" sx={{ minWidth: "50%" }} />
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, name, description, quantity, price, partNumber, isActive, Piece, locationInWarehouse } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        { /*           <TableCell padding="checkbox">
                          <Checkbox checked={selectedUsEr} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */
                        }

                        <TableCell align="left" component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap style={{ textIndent: '20px' }}>
                              {name}
                              <p>{description}</p>
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{partNumber}</TableCell>

                        <TableCell align="left">{quantity}</TableCell>

                        <TableCell align="left">{price}</TableCell>

                        <TableCell align="left">
                          {

                            userData.data.position === "1" ?
                              <Label color={isActive ? 'success' : 'error'}>{isActive ? 'Activo' : 'Inactivo'}</Label>
                              :
                              <Label color={Piece.isActive ? 'success' : 'error'}>{Piece.isActive ? 'Activo' : 'Inactivo'}</Label>
                          }</TableCell>
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => { handleOpenMenu(e, userData.data.position === "1" ? id : Piece.id, isActive, id, locationInWarehouse) }}>
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
          <MenuItem onClick={() => { navigate(`/dashboard/peca/editar/${actualId}?pieceWarehouseId=${pieceWarehouseId}&locationInWarehouse=${locationInWarehouseData}`) }}>
            <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
            {userData.data.position === "1" ? 'Editar' : 'Visualizar'}
          </MenuItem>

          {userData.data.position === "1" && <MenuItem onClick={() => { handleChangeStatus() }} >
            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
            {!status ? 'Activar' : 'Desactivar'}
          </MenuItem>}
        </Popover>
        <Button style={{ marginTop: '30px' }} variant="contained" onClick={() => { handleDownloadModel() }} startIcon={<Iconify icon="eva:download-fill" />}>
          Baixar Template
        </Button>
        <Button style={{ marginTop: '30px', marginLeft: '10px' }} variant="contained" onClick={() => { handleDownloadFiles() }} startIcon={<Iconify icon="eva:download-fill" />}>
          Baixar dados
        </Button>
      </Container >
      <Modal
        open={openUpload}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography>Carregar Ficheiro(.xlsx)</Typography>
          <input type='file' onChange={(e) => setFile(e.target.files[0])} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />

          <Button style={{ marginTop: '30px' }} variant="contained" onClick={() => { handleSubmitFile() }} startIcon={<Iconify icon="eva:download-fill" />}>
            Submeter
          </Button>
        </Box>
      </Modal>
    </>
  );
}
