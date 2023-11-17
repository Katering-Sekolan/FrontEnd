import React, { useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import Header from "@/components/Header";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/config/theme";

function Pelanggan() {
    const [pelangganList, setPelangganList] = useState([]);
    const [namaPelanggan, setNamaPelanggan] = useState('');
    const [nomorHP, setNomorHP] = useState('');

    const handleTambahPelanggan = () => {
        // Validasi form
        if (!namaPelanggan || !nomorHP) {
            alert("Nama dan Nomor HP pelanggan harus diisi.");
            return;
        }

        // Logic untuk menambah pelanggan
        const newPelanggan = {
            id: pelangganList.length + 1,
            nama: namaPelanggan,
            nomorHP: nomorHP
        };

        setPelangganList([...pelangganList, newPelanggan]);
        // Reset nilai namaPelanggan dan nomorHP setelah menambah pelanggan
        setNamaPelanggan('');
        setNomorHP('');
    };

    const handleHapusPelanggan = (id) => {
        // Logic untuk menghapus pelanggan berdasarkan id
        const filteredPelanggan = pelangganList.filter((pelanggan) => pelanggan.id !== id);
        setPelangganList(filteredPelanggan);
    };

    return (
        <>
          <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Header navName="Pelanggan Katering Qita" />
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" component="h2" mb={2}>
                    Daftar Pelanggan
                </Typography>
                <TableContainer  component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nama Pelanggan</TableCell>
                                <TableCell>Nomor HP</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pelangganList.map((pelanggan) => (
                                <TableRow key={pelanggan.id}>
                                    <TableCell>{pelanggan.id}</TableCell>
                                    <TableCell>{pelanggan.nama}</TableCell>
                                    <TableCell>{pelanggan.nomorHP}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="secondary" onClick={() => handleHapusPelanggan(pelanggan.id)}>
                                            Hapus
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant="h6" component="h2" mt={2}>
                    Tambah Pelanggan
                </Typography>
                <TextField
                    label="Nama Pelanggan"
                    variant="outlined"
                    value={namaPelanggan}
                    onChange={(event) => setNamaPelanggan(event.target.value)}
                    margin="normal"
                    fullWidth
                />
                <TextField
                    label="Nomor HP"
                    variant="outlined"
                    value={nomorHP}
                    onChange={(event) => setNomorHP(event.target.value)}
                    margin="normal"
                    fullWidth
                />
                <Button variant="contained" color="secondary" onClick={handleTambahPelanggan} mt={2}>
                    Tambah Pelanggan
                </Button>
            </Box>
            </Box>
            </ThemeProvider>
        </>
    );
}

export default Pelanggan;
