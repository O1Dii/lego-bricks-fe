import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Navigate, Routes} from 'react-router-dom';

import MainLayout from "./components/MainLayout/MainLayout";

import CssBaseline from "@mui/material/CssBaseline";

import "./styles/index.scss";
import {ThemeProvider} from "@mui/material/styles";
import Catalog from "./components/Catalog/Catalog";
import Cart from "./components/Cart/Cart";
import Conditions from "./components/Conditions/Conditions";
import Typography from "@mui/material/Typography";
import {createTheme} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Montserrat, Helvetica, Arial, sans-serif",
  },
});

const USERNAME = "lego_bricks_test";
const PASSWORD = "very_secure_lego_bricks_password";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      onLogin(true);
    } else {
      alert("Неверный логин или пароль");
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "white"
    }}>
      <form onSubmit={handleSubmit} style={{
        padding: "20px", border: "1px solid #ccc", borderRadius: "10px",
        background: "#ECECEC", minWidth: "300px"
      }}>
        <Typography fontSize={20} style={{marginBottom: "10px"}}>
          Авторизация
        </Typography>
        <div className={"input-holder"} style={{padding: "0 10px"}}>
          <input
            className={"input-style"}
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={"input-holder"} style={{margin: "10px 0", padding: "0 10px"}}>
          <input
            className={"input-style"}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={"filled-normal-button"} style={{width: "100%"}}>Войти</button>
      </form>
    </div>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("username") === USERNAME && localStorage.getItem("password") === PASSWORD) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {authenticated ? (
        <div className="App">
          <CssBaseline/>

          {/*<MuiThemeProvider theme={theme}>*/}
          <Router>
            <Routes>
                <Route element={<MainLayout />}>
                  <Route exact path="/" element={<Navigate to="/catalog" replace/>}/>
                  <Route path="/catalog" element={<Catalog/>}/>
                  <Route path="/cart" element={<Cart/>}/>
                  <Route path="/conditions" element={<Conditions/>}/>
                </Route>
            </Routes>
          </Router>
          {/*</MuiThemeProvider>*/}
        </div>
        ) : <Login onLogin={setAuthenticated} />
      }
    </ThemeProvider>
  );
}

export default App;
