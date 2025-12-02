import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {Link, useNavigate} from "react-router-dom";
import {Badge, Divider, Drawer, Menu, Tooltip, Typography, useMediaQuery} from "@mui/material";
import {CartContext} from "../../context/CartContext";
import {useContext, useState} from "react";
import getSvg from '../../constants/svg';
import telegram_icon from "../../icons/telegram.png";
import CatalogSearch from "../CatalogSearch/CatalogSearch";
import Skeleton from "@mui/material/Skeleton";
import CategoriesMenu from "../CategoriesMenu/CategoriesMenu";
import Paper from "@mui/material/Paper";

export default function Navigation({onMobileCatalogClick, searchComponent, drawerOpen, setDrawerOpen}) {
  const navigate = useNavigate();
  const {items} = useContext(CartContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:700px)');

  const handleMenuOpenClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  return (
    <>
      <Toolbar sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #ececec",
        padding: "0 !important",
        minHeight: "0 !important"
      }}>
        {!isMobile ? (
          // ======= DESKTOP =======
          <Grid container sx={{width: "100%"}}>
            <Grid item xs={5}>
              <Stack direction={'row'} sx={{alignItems: "center"}}>
                <Button onClick={() => navigate("/catalog")} style={{padding: 0, height: "100%"}}>
                  {getSvg('logo')}
                </Button>
                <button
                  style={{height: "100%", padding: "0 30px"}}
                  className={"accent-button-style"}
                  onClick={() => navigate("/catalog")}
                >
                  <div style={{marginRight: "10px", display: "flex", alignItems: "center"}}>
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
              <Stack direction={'row'} sx={{justifyContent: "flex-end", height: "100%"}}>
                <button className={"accent-button-style"} style={{height: "100%", padding: "0 30px"}} onClick={handleMenuOpenClick}>
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
        ) : (
          // ======= MOBILE =======
          <Stack sx={{width: "100%"}}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{paddingRight: "10px", width: "100%"}}>
              <Button onClick={() => {setDrawerOpen(false); navigate("/catalog")}} style={{padding: 0}}>
                {getSvg('logo')}
              </Button>
              <button
                style={{display: "flex", alignItems: "center", flexGrow: "1", paddingLeft: "10px", justifyContent: "flex-start", gap: "5px"}}
                className={"accent-button-style"}
                onClick={() => {
                  setDrawerOpen(false);
                  if (onMobileCatalogClick) {
                    onMobileCatalogClick()
                  } else {
                    navigate("/catalog")
                  }
                }}
              >
                {getSvg('catalog', 'black')} Каталог
              </button>
              <button onClick={() => {setDrawerOpen(false); navigate("/cart")}} className={"accent-button-style"} style={{padding: "5px 10px", height: "60px", marginRight: "5px"}}>
                <Badge
                  badgeContent={items.length || 0}
                  sx={{
                    alignItems: "center",
                    "& .MuiBadge-badge": {
                      backgroundColor: "#FF1B15",
                      color: "#fff",
                    },
                  }}
                >
                  Корзина <span style={{marginLeft: "5px", display: "flex", alignItems: "center"}}>{getSvg('cart', 'black')}</span>
                </Badge>
              </button>
              <Stack direction="row" alignItems="center" gap={1}>
                <button onClick={toggleDrawer(!drawerOpen)} className="accent-button-style">
                  {getSvg('menu', 'black')}
                </button>
              </Stack>
            </Stack>
            {searchComponent}
          </Stack>
        )}
      </Toolbar>

      {/* Контактное меню */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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

      {drawerOpen &&
        <Paper
          sx={{
            backgroundColor: "#ECECEC",
            borderRadius: 0,
            minHeight: "calc(100vh - 60px)",
            padding: "20px",
            zIndex: "100",
            position: "relative"
          }}
        >
          <Stack sx={{width: "100%"}}>
            <button className="drawer-button" style={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "15px",
              fontWeight: "500",
              borderBottom: "1px solid #D7D7D7"
            }} onClick={() => {navigate("/conditions"); setDrawerOpen(false);}}>
              <span>Условия покупки</span> {getSvg('conditions', 'black')}
            </button>
            <button className="drawer-button" style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "15px 0",
              fontWeight: "500",
              borderBottom: "1px solid #D7D7D7"
            }} onClick={handleMenuOpenClick}>
              <span>Связаться с нами</span> {getSvg('contact', 'black')}
            </button>
          </Stack>
        </Paper>
      }
    </>
  );
}
