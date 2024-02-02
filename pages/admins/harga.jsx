import React, { useState, useEffect } from "react";
import { Grid, Paper } from "@mui/material";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Header from "@/components/Header";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import theme from "@/config/theme";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { HargaService } from "@/services/hargaService";

export default function Harga() {
  const [harga, setHarga] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [hargaEdit, setHargaEdit] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const fetchData = async () => {
    try {
      const response = await HargaService.getAll();
      const data = response.data.data.map((item, index) => {
        return {
          ...item,
          id: index + 1,
          formattedHarga: formatCurrency(item.harga),
        };
      });
      setHarga(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await HargaService.update(hargaEdit.id, hargaEdit);
      SweatAlertTimer("Berhasil", "Data berhasil diupdate", "success");
      setOpenEdit(false);
      fetchData();
    } catch (error) {
      SweatAlertTimer("Gagal", "Data gagal diupdate", "error");
      console.log(error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "jenis", headerName: "Jenis", width: 250 },
    { field: "formattedHarga", headerName: "Harga", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => {
              setOpenEdit(true);
              setHargaEdit(params.row);
            }}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Menu Katering dan Harga" />
        <Box
          component="main"
          sx={{
            backgroundColor: "greyCool.main",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            padding: 2,
          }}
        >
          <Toolbar />

          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
              }}
            >
              <DataGrid rows={harga} columns={columns} pageSize={10} />
              <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <h2>Edit Harga</h2>
                  <Container>
                    <TextField
                      id="outlined-basic"
                      label="Harga"
                      variant="outlined"
                      fullWidth
                      type="number"
                      value={hargaEdit?.harga}
                      onChange={(e) => {
                        setHargaEdit({ ...hargaEdit, harga: e.target.value });
                      }}
                      sx={{ marginBottom: 2 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<SaveIcon />}
                      fullWidth
                      onClick={handleUpdate}
                    >
                      Update
                    </Button>
                  </Container>
                </Box>
              </Modal>
            </Paper>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
