import * as React from 'react';
import Box from '@mui/material/Box'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input'


export default function TableRequest({ rows, hasPrice = false, showInput = false, errors, register, partNumber, setPartNumber }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ width: '300' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nome da Peça</TableCell>
                        <TableCell align="right">Quantidade</TableCell>
                        {
                            showInput && <TableCell align="right">PartNumber</TableCell>

                        }
                        {
                            hasPrice &&
                            <TableCell align="right">Preço</TableCell>

                        }
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
                            <TableCell align="right">{row.quantity}</TableCell>
                            {showInput && <TableCell align="right">
                                <Box mb={5}>
                                    <Input
                                        placeholder={"Insira o part number"}
                                        type="text"
                                        onBlur={(e) => {
                                            setPartNumber([
                                                ...partNumber,
                                                {
                                                    key: row.piece.value,
                                                    value: e.target.value
                                                }
                                            ])
                                        }}
                                        sx={{ width: "50px", height: "40px", border: "1.5px solid grey", borderRadius: "4px", textIndent: "5px", marginTop: "15px" }}
                                    />

                                </Box>
                            </TableCell>
                            }
                            {
                                hasPrice &&
                                <TableCell align="right">{row.price}</TableCell>

                            }

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}