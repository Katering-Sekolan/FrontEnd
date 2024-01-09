import React from "react";
import { styled } from "@mui/system";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FaWhatsapp } from "react-icons/fa";

const FooterContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.primary.contrastText,
  width: "100%",
  height: "18vh",
  padding: "10px",
  flexGrow: 0,
}));

const ButtonContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "10px",
  flexShrink: 0,
});
const TextContainer = styled("div")({
  flexDirection: "column",
  alignItems: "center",
  marginRight: "10px",
});

const Footer = () => {
  const handleContactUs = () => {
   
    const href =
      "https://wa.me/6281234567890?text=Halo%20saya%20ingin%20bertanya%20tentang%20pembayaran%20di%20website%20Anda";
    console.log("Contact Us button clicked");
    window.open(href, "_blank"); 
  };

  return (
    <FooterContainer>
      <TextContainer>
        <Typography variant="h5">Butuh Bantuan?</Typography>
        <Typography variant="h7">
          Jika anda mengalmai kendala pembayaran, silahkan hubungi kami.
        </Typography>
      </TextContainer>
      <ButtonContainer>
        <Button
          startIcon={<FaWhatsapp />}
          variant="contained"
          security="large"
          color="green"
          onClick={handleContactUs}
          sx={{ borderRadius: 4, height: "60px" }}
        >
          Hubungi Kami
        </Button>
      </ButtonContainer>
    </FooterContainer>
  );
};

export default Footer;
