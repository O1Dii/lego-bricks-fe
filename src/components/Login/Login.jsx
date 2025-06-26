import React, {Suspense, useContext, useEffect, useState} from "react";
import {Link, Outlet, useNavigate} from 'react-router-dom';

import TextField from "@mui/material/TextField";
import {UserContext} from "../../context/UserContext";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function LoggedInLayout() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {authenticate, user} = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.accessToken) {
      navigate("/my-items")
    }
  }, [user, user.accessToken]);

  return (
    <div className="login">
      <Grid container sx={{height: "100vh"}}>
        <Grid item md={9} sx={{ display: { xs: 'none', md: 'block' }}}>
          <Box component="img" sx={{height: "100%", width: "100%", objectFit: "cover"}} src={'https://images8.alphacoders.com/890/890090.jpg'} alt={"Картинка тут)"} />
        </Grid>
        <Grid item sx={{backgroundColor: "white"}} xs={12} md={3}>
          <Stack spacing={2} sx={{height: "100%", display: "flex", alignItems: "center", justifyContent: "center", margin: "50px"}}>
            <TextField id="login" sx={{width: "100%"}} label="Номер телефона" variant={"outlined"} value={login} onChange={e => setLogin(e.target.value)}/>
            <TextField id="password" sx={{width: "100%"}} label="Пароль" variant={"outlined"} value={password} onChange={e => setPassword(e.target.value)}/>
            <Button className={"accent-button-style"} onClick={() => {
              authenticate(login, password);
            }}>
              Войти
            </Button>
            {/*<Button className={"button-style"} component={Link} to={"https://t.me/test_buyout_bot"}>Telegram Регистрация</Button>*/}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

export default LoggedInLayout;
