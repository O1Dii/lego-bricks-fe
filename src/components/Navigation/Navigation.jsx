import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import viber_icon from "../../icons/viber.png";
import telegram_icon from "../../icons/telegram.png";
import whatsapp_icon from "../../icons/whatsapp.png";
import Typography from "@mui/material/Typography";

export default function Navigation({children}) {
  console.log('header render')

  return (
    <>
      <Toolbar sx={{backgroundColor: "lightgrey", boxShadow: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)"}}>
        <Grid container sx={{width: "100%"}} >
          <Grid item xs={6} sx={{alignItems: "center", display: "flex"}}>
            {children}
          </Grid>
          {/*<Divider orientation="vertical" variant="middle" flexItem sx={{margin: "0 25px", border: "1px solid black"}} />*/}
          <Grid item xs={6}>
            <Stack direction={'row'}>
              <Stack sx={{height: "100%"}}>
                <Stack direction={"row"} sx={{alignItems: "center"}}>
                  <img style={{height: "20px"}} src={viber_icon} alt="viber_icon" />
                  <Typography>
                    +375(29)630-08-68
                  </Typography>
                </Stack>
                <Stack direction={"row"} sx={{alignItems: "center"}}>
                  <img style={{height: "20px"}} src={telegram_icon} alt="viber_icon" />
                  <Typography>
                    @tatsiana_pr
                  </Typography>
                </Stack>
              </Stack>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/catalog'}>Каталог</Button>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/cart'}>Корзина</Button>
              <Button sx={{margin: "auto"}} className={"accent-button-style"} component={Link} to={'/conditions'}>Условия покупки</Button>
            </Stack>
          </Grid>
        </Grid>
      </Toolbar>
    </>
  );
}
