/** eslint-disable */
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
    const [selectedRow, setSelectedRow] = useState({})
    const [isOpenModalNumber, setIsOpenModalNumber] = useState(false)

    useEffect(() => {
        console.log(rows)
    }, [])

    const handleOpenNumberSeries = (row, i) => {
        setIsOpenModalNumber(true);

        let newNumberSeries
        const rowQuantity = Number(rows[i].quantityGiven)

        if ((rowQuantity !== rows[i].numberSeries.length && rowQuantity > 0)) {
            newNumberSeries = rows[i].numberSeries.slice(0, rowQuantity)


            rows[i].numberSeries = newNumberSeries

            setSelectedRow({
                ...rows[i],
                quantityGiven: rows[i].quantityGiven,
                numberSeries: rows[i].numberSeries
            })
        }
    }

    const handleSetQuantity = (e, row) => {
        row.quantityGiven = e.target.value;
    }

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

                    {rows.map((row, i) => (

                        <TableRow
                            key={row.piece.value}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >

                            <TableCell sx={{ marginLeft: '10px' }} component="th" scope="row">
                                {row.piece.label}
                            </TableCell>
                            <TableCell align="center">{row.piece.location}</TableCell>
                            <TableCell align="center">{row.piece.quantity + row.quantity}</TableCell>
                            <TableCell align="center">{row.quantity}</TableCell>

                            <TableCell align="center">
                                <Box mb={5}>
                                    <Input
                                        placeholder={"Insira a quantidade number"}
                                        type="number"
                                        max={2}
                                        minRows={0}
                                        maxRows={row.quantity}
                                        onBlur={(e) => {
                                            handleSetQuantity(e, row)
                                        }}
                                        sx={{ width: "100px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                    />
                                </Box>
                            </TableCell>

                            <TableCell>
                                <Box ml={10}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedRow(row);
                                            handleOpenNumberSeries(row, i)
                                        }}
                                    >
                                        Nº de Série
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    <ModalNumberSeries
                        quantity={selectedRow.quantityGiven}
                        isOpen={isOpenModalNumber}
                        setIsOpen={setIsOpenModalNumber}
                        numberSeries={selectedRow.numberSeries}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
}