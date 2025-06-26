import React from "react";
import {BrowserRouter as Router, Route, Navigate, Routes} from 'react-router-dom';

import MainLayout from "./components/MainLayout/MainLayout";

import CssBaseline from "@mui/material/CssBaseline";

import "./styles/index.scss";
import {StylesProvider} from "@mui/styles";
import Catalog from "./components/Catalog/Catalog";
import Cart from "./components/Cart/Cart";
import Conditions from "./components/Conditions/Conditions";

// const theme = createTheme({
//   palette: {
//     secondary: {
//       main: '#E33E7F'
//     }
//   }
// });

function App() {
  return (
    <div className="App">
      <CssBaseline/>

      {/*<MuiThemeProvider theme={theme}>*/}
      <StylesProvider injectFirst>
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
      </StylesProvider>
      {/*</MuiThemeProvider>*/}
    </div>
  );
}

export default App;
