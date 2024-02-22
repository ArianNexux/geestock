import { useState, useEffect } from 'react';
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

export default function TableRequestForMe({ rows, hasPrice = false, showInput = false, errors, register, partNumber, setPartNumber, setNumberSeries }) {
    useEffect(() => {
        console.log(rows)
    }, [])
    const [selectedRow, setSelectedRow] = useState({})
    const [isOpenModalNumber, setIsOpenModalNumber] = useState(false)
    return (
        <TableContainer component={Paper}>
            <Table sx={{ width: '300' }} aria-label="simple table">
                <TableHead>
                    <TableRow>

                        <TableCell>Nome da Peça</TableCell>
                        <TableCell align="center">Local da Peça    </TableCell>
                        <TableCell align="center">Quantidade Em Stock    </TableCell>
                        <TableCell align="center">Quantidade Requisitada    </TableCell>
                        <TableCell align="center">Quantidade Fornecida</TableCell>

                        {
                            hasPrice &&
                            <TableCell align="center">Preço</TableCell>

                        }
                        <TableCell align="center">Ação</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>

                    {rows.map((row) => (

                        <TableRow
                            key={row.piece.value}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >

                            <TableCell component="th" scope="row">
                                {row.piece.label}
                            </TableCell>
                            <TableCell align="center">{row.piece.location}</TableCell>
                            <TableCell align="center">{row.piece.quantity}</TableCell>
                            <TableCell align="center">{row.quantity}</TableCell>

                            <TableCell align="center">
                                <Box mb={5}>
                                    <Input
                                        placeholder={"Insira a quantidade number"}
                                        type="number"
                                        minRows={0}
                                        maxRows={row.quantity}
                                        onBlur={(e) => {
                                            row.quantityGiven = []
                                            row.quantityGiven.push(e.target.value);
                                        }}
                                        sx={{ width: "100px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                    />

                                </Box>
                            </TableCell>

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
                        </TableRow>
                    ))}
                    <ModalNumberSeries
                        quantity={selectedRow.quantity}
                        isOpen={isOpenModalNumber}
                        setIsOpen={setIsOpenModalNumber}
                        numberSeries={selectedRow.numberSeries}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
}