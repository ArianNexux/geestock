import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
const MyDocument = (data) => {
    const docDefinition = {
        content: [
            {
                layout: 'lightHorizontalLines', // optional
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    function(currentPage, pageCount, pageSize) {
                        // you can apply any logic and return any valid pdfmake element

                        return [
                            { text: 'simple text', alignment: (currentPage % 2) ? 'left' : 'right' },
                            { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
                        ]
                    },
                    headerRows: 1,
                    widths: ['*', 'auto', 100, '*', '*'],

                    body: [
                        ['Nome da Peça', 'Descrição', 'Part Number', 'Quantidade', 'Preço'],
                        [...data.map(e => {
                            return ([
                                e.pieceName,
                                e.description,
                                e.partNumber,
                                e.quantity,
                                e.price,

                            ])
                        }),
                        ]
                    ],
                    styles: {
                        header: {
                            fontSize: 16,
                            lineHeight: '1',
                            alignment: 'center',
                            border: '1px solid red',
                        },
                        anotherStyle: {
                            fontSize: 11,
                            alignment: 'left',
                            color: 'white',
                        },
                        cellStyle: {
                            fontSize: 9,
                            alignment: 'left',
                        },
                        anotherHeader: {
                            color: '#000',
                            fontSize: 11,
                            alignment: 'left',
                        },
                    },
                }
            }
        ]
    };

    return (
        pdfMake.createPdf(docDefinition).open()
    )
};

export default MyDocument