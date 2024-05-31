import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Select, FormControl, MenuItem, InputLabel } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import { AppContext, AuthContext } from '../../../context/context';
import api from '../../../utils/api'; // ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const { userData, setCurentWarehouse, curentWarehouse } = useContext(AppContext)
  const [stateOrder, setStateOrder] = useState({})
  const [data, setData] = useState([])
  const [warehouseData, setDataWarehouse] = useState([]);

  const [search, setSearch] = useState("")
  const getData = async () => {
    if (userData.data.position !== "1") {
      setCurentWarehouse(userData.data.warehouse[0]?.id)
    } else {
      const responseWarehouse = await api.get("/warehouse?onlyActive=1")
      setDataWarehouse(responseWarehouse.data)
      setCurentWarehouse("Todos")
    }
    setStateOrder("Todos")
  }
  useEffect(() => {
    getData()
  }, [])
  const handleChange = async (e) => {
    setStateOrder(e.target.value)
    setCurentWarehouse(e.target.value ?? curentWarehouse)
  }

  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />

        <Box sx={{ flexGrow: 1 }} />
        {userData.data?.position !== "3" && <Box sx={{ width: '400px' }}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: '100%', marginRight: '20px' }}>
            <InputLabel id="demo-simple-select-standard-label">Armazem Selecionado</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stateOrder}
              label="Armazem Selecionado"
              onChange={handleChange}
            >
              {userData.data?.position === "1" && <MenuItem value="Todos">Todos</MenuItem>}
              {
                userData.data?.position !== "1" ?
                  userData.data.warehouse.map(e => (
                    <MenuItem value={e.id}>{e.name}</MenuItem>
                  ))
                  :
                  warehouseData.map(e => (
                    <MenuItem value={e.id}>{e.name}</MenuItem>
                  ))
              }

            </Select>
          </FormControl>
        </Box>}
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {
            // <LanguagePopover />
          }
          {userData.data?.position === "1" && <NotificationsPopover />}
          <AccountPopover />
        </Stack>

      </StyledToolbar>

    </StyledRoot >
  );
}
