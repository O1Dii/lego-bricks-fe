import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {Link, useNavigate} from "react-router-dom";
import viber_icon from "../../icons/viber.png";
import telegram_icon from "../../icons/telegram.png";
import whatsapp_icon from "../../icons/whatsapp.png";
import logo from "../../icons/logo.jpg";
import basket from "../../icons/basket.jpg";
import Typography from "@mui/material/Typography";
import {Badge, Menu} from "@mui/material";
import {CartContext} from "../../context/CartContext";
import {useContext} from "react";
import getSvg from '../../constants/svg';
import MenuItem from "@mui/material/MenuItem";

export default function Navigation({children}) {
  const navigate = useNavigate();
  const {items} = useContext(CartContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpenClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Toolbar sx={{backgroundColor: "white", borderBottom: "1px solid #ececec", padding: "0 !important", minHeight: "0 !important"}}>
        <Grid container sx={{width: "100%"}}>
          <Grid item xs={5}>
            <Stack direction={'row'} sx={{alignItems: "center"}}>
              <Button
                onClick={() => navigate("/catalog")}
                style={{ padding: 0, height: "100%" }}
              >
                {getSvg('logo')}
              </Button>
              <button
                style={{height: "100%", padding: "0 30px"}}
                className={"accent-button-style"}
                onClick={() => navigate("/catalog")}
              >
                <div style={{marginRight: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {getSvg('catalog', 'black')}
                </div>
                Каталог
              </button>
            </Stack>
          </Grid>
          {/*<Grid item xs={3} sx={{alignItems: "center", display: "flex"}}>*/}
          {/*  {children}*/}
          {/*</Grid>*/}
          {/*<Divider orientation="vertical" variant="middle" flexItem sx={{margin: "0 25px", border: "1px solid black"}} />*/}
          <Grid item xs={7}>
            <Stack direction={'row'} sx={{height: "100%", justifyContent: "flex-end"}}>
              <button style={{height: "100%", padding: "0 30px"}} className={"accent-button-style"} onClick={handleMenuOpenClick}>
                Связаться с нами
                <div style={{marginLeft: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {getSvg('contact', 'black')}
                </div>
              </button>
              <button
                style={{height: "100%", padding: "0 30px"}}
                className={"accent-button-style"}
                onClick={() => navigate("/conditions")}
              >
                Условия покупки
                <div style={{marginLeft: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {getSvg('conditions', 'black')}
                </div>
              </button>
              <button
                className={"cart-button"}
                onClick={() => navigate("/cart")}
              >
                Корзина
                <div style={{marginLeft: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <Badge
                    badgeContent={items.length || 0}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#FF1B15",
                        color: "#fff",
                      },
                    }}
                  >
                    {getSvg('cart', 'black')}
                  </Badge>
                </div>
              </button>
            </Stack>
          </Grid>
        </Grid>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Stack sx={{height: "100%", padding: "10px"}}>
            <Stack direction={"row"} sx={{alignItems: "center"}}>
              <img style={{height: "25px", marginRight: "8px"}} src={telegram_icon} alt="telegram_icon" />
              <Typography variant="body1">
                <a href="https://t.me/tatsiana_pr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#0088cc' }}>
                  @tatsiana_pr
                </a>
              </Typography>
            </Stack>

            <Stack direction={"row"} sx={{alignItems: "center"}}>
              <div style={{marginRight: "8px", marginTop: "10px"}}>{getSvg('mail')}</div>
              <Typography variant="body1">
                <a href="mailto:legobricks2025@gmail.com" style={{ textDecoration: 'none', color: '#0088cc' }}>
                  legobricks2025@gmail.com
                </a>
              </Typography>
            </Stack>
          </Stack>
        </Menu>
      </Toolbar>
    </>
  );
}
