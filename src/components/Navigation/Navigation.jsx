import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {Link} from "react-router-dom";
import Divider from "@mui/material/Divider";

export default function Navigation({children}) {
  console.log('header render')

  return (
    <>
      <Toolbar sx={{backgroundColor: "lightgrey", boxShadow: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)"}}>
        <Grid container sx={{width: "100%"}} >
          <Grid item xs={9}>
            {children}
          </Grid>
          {/*<Divider orientation="vertical" variant="middle" flexItem sx={{margin: "0 25px", border: "1px solid black"}} />*/}
          <Grid item xs={3}>
            <Stack direction={'row'}>
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
