import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import viber_icon from "../../icons/viber.png";
import telegram_icon from "../../icons/telegram.png";
import whatsapp_icon from "../../icons/whatsapp.png";
import logo from "../../icons/logo.jpg";
import basket from "../../icons/basket.jpg";
import Typography from "@mui/material/Typography";
import {Badge} from "@mui/material";
import {CartContext} from "../../context/CartContext";
import {useContext} from "react";

export default function Navigation({children}) {
  const {items} = useContext(CartContext);
  console.log('header render')

  return (
    <>
      <Toolbar sx={{backgroundColor: "lightgrey", boxShadow: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)"}}>
        <Grid container sx={{width: "100%"}} >
          <Grid item xs={5}>
            <Stack direction={'row'} sx={{alignItems: "center"}}>
              <Button component={Link} to={'/catalog'}>
                <img style={{height: "50px", marginRight: "10px"}} src={logo} alt="logo" />
              </Button>
              <Stack sx={{height: "100%"}}>
                <Stack direction={"row"} sx={{alignItems: "center"}}>
                  {/*<img style={{height: "20px"}} src={viber_icon} alt="viber_icon" />*/}
                  <Typography align="left">
                    email: <a href="mailto:legobricks2025@gmail.com" style={{textDecoration: "none", color: "black"}}>legobricks2025@gmail.com</a>
                  </Typography>
                </Stack>
                <Stack direction={"row"} sx={{alignItems: "center"}}>
                  <img style={{height: "20px"}} src={telegram_icon} alt="viber_icon" />
                  <Typography align="left">
                    <a href="https://t.me/tatsiana_pr" style={{textDecoration: "none", color: "black"}} target="_blank">@tatsiana_pr</a>
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={3} sx={{alignItems: "center", display: "flex"}}>
            {children}
          </Grid>
          {/*<Divider orientation="vertical" variant="middle" flexItem sx={{margin: "0 25px", border: "1px solid black"}} />*/}
          <Grid item xs={4}>
            <Stack direction={'row'} sx={{height: "100%"}}>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/conditions'}>Условия покупки</Button>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/catalog'}>Каталог</Button>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/cart'}>Корзина
                <Badge badgeContent={items.length || 0} color={"primary"}>
                  <img style={{height: "30px"}} src={basket} alt="basket" />
                </Badge>
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
    </>
  );
}
