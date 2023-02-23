import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useAccount, useBalance } from "wagmi";
import { ConnectKitButton } from 'connectkit'

function Header() {
  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
    formatUnits: 'ether',
    watch: true
  });

  return (
    <AppBar position="fixed" sx={{ background: "#fff" }} elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "green",
              textDecoration: "none"
            }}
          >
            <span style={{ fontSize: "35px" }}>Swap</span>Lab
          </Typography>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "green",
              textDecoration: "none"
            }}
          >
            <span style={{ fontSize: "35px" }}>Swap</span>Lab
          </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "space-around", alignItems: 'center' }}>
            <Typography variant="body1" sx={{color: 'green', fontWeight: 'bolder'}}>{`${data?.formatted? data.formatted : '0.00'} $Celo`}</Typography>
            <ConnectKitButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
