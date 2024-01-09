import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import theme from "@/config/theme";

export default function HeaderPembayaran() {
  return (
    <AppBar position="static">
      <Toolbar sx={{bgcolor: theme.palette.secondary.main }}>
        <Typography variant="h6">Pembayaran Tagihan Katering Qita</Typography>
      </Toolbar>
    </AppBar>
  );
}
