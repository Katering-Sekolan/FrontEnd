import React from "react";
import {
  Box,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const RincianTagihan = ({
  nama,
  nomor_hp,
  kelas,
  formattedBulanTagihan,
  status_pembayaran,
  columns,
  rows,
}) => {
  return (
    <Box sx={{ marginBottom: 2 }}>
      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">Detail Pengguna</Typography>
        <Typography>Nama: {nama}</Typography>
        <Typography>No HP: {nomor_hp}</Typography>
        <Typography>Kelas: {kelas}</Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          padding: 2,
          borderRadius: 4,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6">Detail Tagihan</Typography>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 1,
            marginBottom: 1,
            borderRadius: 2,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
            Tagihan Bulan:
          </Typography>
          <Typography fontWeight="bold" color="#ff9a3c" variant="subtitle1">
            {formattedBulanTagihan}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 1,
            marginBottom: 1,
            borderRadius: 2,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
            Status Pembayaran:
          </Typography>
          <Chip
            label={status_pembayaran}
            color={
              status_pembayaran === "LUNAS"
                ? "success"
                : status_pembayaran === "PENDING"
                ? "warning"
                : "error"
            }
          />
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      fontWeight: row.isBold ? "bold" : "normal",
                    }}
                  >
                    {row.nama}
                  </TableCell>
                  <TableCell>{row.jumlah}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: row.isBold ? "bold" : "normal",
                      color: row.isBold ? "#ff9a3c" : "#000",
                    }}
                  >
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default RincianTagihan;
