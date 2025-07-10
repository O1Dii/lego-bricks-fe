import React from "react";
import {Outlet} from 'react-router-dom';
import Box from "@mui/material/Box";
import ItemsContextProvider from "../../context/ItemsContext";
import CartContextProvider from "../../context/CartContext";
import SettingsContextProvider from "../../context/SettingsContext";

function MainLayout() {
  return (
    <div className="App">
        <ItemsContextProvider>
          <CartContextProvider>
          <SettingsContextProvider>
            <Box sx={{display: 'flex'}}>
              <Box sx={{width: "100%"}}>
                <Outlet />
              </Box>
            </Box>
          </SettingsContextProvider>
          </CartContextProvider>
        </ItemsContextProvider>
    </div>
  );
}

export default MainLayout;
