import { useState } from 'react';
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input'
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ModalNumberSeries from '../modal/modalNumberSeries'

export default function TableConfirmOrder({ rows, hasPrice = false, showInput = false, errors, register, partNumber, setPartNumber, setNumberSeries }) {

    const [selectedRow, setSelectedRow] = useState({})
    const [isOpenModalNumber, setIsOpenModalNumber] = useState(false)
    const [selected, setSelected] = useState([]);

    const handleClick = (event, row) => {
        console.log(row, selected);
        const selectedIndex = selected.findIndex(obj => obj.piece.value === row.piece.value);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
            row.quantityGiven = row.quantity
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };
    return (
        <TableContainer component={Paper}>
            <Table sx={{ width: '300' }} aria-label="simple table">
                <TableHead sx={{ width: '300' }} >
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox />
                        </TableCell>
                        <TableCell>Nome da Peça</TableCell>
                        <TableCell align="center">Quantidade Encomendada</TableCell>
                        <TableCell align="center">Preço Unitário</TableCell>
                        <TableCell align="center">Localização da Peça</TableCell>
                        <TableCell align="center">Quantidade Recebida</TableCell>

                        {
                            hasPrice &&
                            <TableCell align="center">Preço</TableCell>

                        }

                    </TableRow>
                </TableHead>
                <TableBody>

                    {rows.map((row) => {
                        const selectedUser = selected.findIndex(obj => obj.piece.value === row.piece.value) !== -1;

                        return (
                            <TableRow
                                key={row.piece.value}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, row)} />
                                </TableCell>
                                <TableCell align="center" scope="row">
                                    {row.piece.label}
                                </TableCell>
                                <TableCell align="center" scope="row">
                                    {row.quantity}
                                </TableCell>
                                <TableCell align="center" scope="row">
                                    {row.price}
                                </TableCell>
                                <TableCell align="center">
                                    <Box mb={5}>
                                        <Input
                                            placeholder={"Localização da Peça"}
                                            type="text"
                                            defaultValue={row.locationInWarehouse}
                                            disabled={selectedUser}
                                            onBlur={(e) => {
                                                row.locationInWarehouse = e.target.value;
                                            }}
                                            sx={{ width: "200px", height: "80px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                        />

                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box mb={5}>
                                        <Input
                                            placeholder={"Insira a quantidade number"}
                                            type="number"
                                            disabled={selectedUser}
                                            onChange={(e) => {
                                                row.quantityGiven = Number(e.target.value)
                                            }}

                                            sx={{ width: "100px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                        />

                                    </Box>
                                </TableCell>

                                {
                                    hasPrice &&
                                    <TableCell align="center">{row.price}</TableCell>

                                }

                                {
                                    /*
                                    <TableCell>
                                         <Box ml={10}>
                                             <Button
                                                 disabled={row.quantity <= 1}
                                                 variant="outlined"
                                                 onClick={() => {
                                                     setSelectedRow(row)
                                                     setIsOpenModalNumber(true);
                                                 }}
                                             >
                                                 Nº de Série
                                             </Button>
                                         </Box>
                                     </TableCell>
                                 */
                                }
                            </TableRow>
                        )
                    }
                    )
                    }

                </TableBody>
            </Table>
        </TableContainer>
    );
}