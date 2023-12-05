import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import theme from "@/config/theme";
import Header from "@/components/Header";
import SweatAlertTimer from "@/config/SweatAlert/timer";
import { Grid } from "@mui/material";
import { DepositService } from "@/services/depositService";

export default function DepositManagement() {
  const [deposits, setDeposits] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [jumlahDeposit, setJumlahDeposit] = useState("");
  const [tanggalDeposit, setTanggalDeposit] = useState("");
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const columns = [
    { field: "index", headerName: "ID", width: 100 },
    { field: "jumlah_deposit", headerName: "Jumlah Deposit", width: 200 },
    { field: "tanggal_deposit", headerName: "Tanggal Deposit", width: 200 },
    { field: "nama", headerName: "Nama", width: 200 },
    { field: "nomor_hp", headerName: "Nomor HP", width: 250 },
    { field: "kelas", headerName: "Kelas", width: 150 },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const response = await DepositService.getAll();

      const depositsWithId = response.data.data.map((deposit, index) => ({
        id: deposit.id,
        index: index + 1,
        jumlah_deposit: deposit.jumlah_deposit,
        tanggal_deposit: deposit.f_tanggal_deposit,
        nama: deposit.user.nama,
        kelas: deposit.user.kelas,
        nomor_hp: deposit.user.nomor_hp,
      }));

      setDeposits(depositsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    search();
  }, [searchInput, deposits]);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setJumlahDeposit(row.jumlah_deposit);
    setTanggalDeposit(
      new Date(row.tanggal_deposit).toISOString().split("T")[0]
    );
    setOpenModal(true);
  };

  const handleSaveDeposit = async () => {
    try {
      let data = {
        tanggal_deposit: tanggalDeposit,
        jumlah_deposit: jumlahDeposit,
      };

      const response = await DepositService.update(selectedRow.id, data);

      handleCloseModal();
      fetchData();
      SweatAlertTimer("Success!", response.data.message, "success");
    } catch (error) {
      setOpenModal(false);
      console.error("Error updating deposit:", error);
      SweatAlertTimer("Error!", error.response.data.message, "error");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const search = () => {
    const filteredData = deposits.filter(
      (deposit) =>
        deposit.nama.toLowerCase().includes(searchInput.toLowerCase()) ||
        deposit.nomor_hp.toString().includes(searchInput) ||
        deposit.kelas.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredDeposits(filteredData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header navName="Atur Deposit Pelanggan" />
        <Box
          sx={{
            marginTop: 8,
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Grid
            container
            justifyContent="flex-end"
            style={{ marginBottom: "8px" }}
          >
            <TextField
              label="cari Nama, Nomor HP, atau Kelas"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              variant="outlined"
              size="small"
              style={{ width: "300px" }}
            />
          </Grid>
          <DataGrid
            rows={filteredDeposits.length > 0 ? filteredDeposits : deposits}
            columns={columns}
            pageSize={10}
          />
          <Modal open={openModal} onClose={handleCloseModal}>
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
              <h2>Edit Deposit</h2>
              <div>
                {selectedRow && (
                  <>
                    <TextField
                      label="Jumlah Deposit"
                      type="number"
                      value={jumlahDeposit}
                      onChange={(e) => setJumlahDeposit(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Tanggal Deposit"
                      type="date"
                      value={tanggalDeposit}
                      onChange={(e) => setTanggalDeposit(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <Button variant="contained" onClick={handleSaveDeposit}>
                      Save Deposit
                    </Button>
                  </>
                )}
              </div>
            </Box>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
