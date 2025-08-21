import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import {Button} from "@mui/material";
import {Link, MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import PaginationItem from '@mui/material/PaginationItem';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select, {SelectChangeEvent} from '@mui/material/Select';

import Pagination from '../Pagination/Pagination';
import {useContext, useEffect, useState} from "react";
import Paper from "@mui/material/Paper";
import Checkbox from '@mui/material/Checkbox';
import {CartContext} from "../../context/CartContext";
import TextField from "@mui/material/TextField";
import {SettingsContext} from "../../context/SettingsContext";

export default function CartTable({items}) {
  const [perPage, setPerPage] = useState(20);
  // end pagination

  const {addItem, removeItem, isItemInCart, reloader, changeQuantityOfItemInCart} = useContext(CartContext);
  const {rub, byn} = useContext(SettingsContext);

  const [data, setData] = useState([]);

  const handleCounterChange = (id, max) => (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 0 && value <= max) {
      changeQuantityOfItemInCart(id, value);
    }
  };

  useEffect(() => {
    const currentData = items.map((product, index) => {
      return (
        <Paper sx={{
          width: {xs: "auto"},
          height: {xs: "auto"},
          padding: {xs: "5px", md: 0},
          margin: {xs: "10px auto", md: 0},
          backgroundColor: (index % 2 === 1) ? "" : "#f2f2f2",
          boxShadow: { md: "none", xs: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)" }
        }}>
          <Grid container alignItems="center" spacing={2} sx={{marginTop: {xs: "15px", md: 'auto'}, marginBottom: "10px"}}>
            {/*<Grid xs={1} md={1}>*/}
            {/*  <Checkbox />*/}
            {/*</Grid>*/}
            <Grid sx={{display: "flex", alignItems: "center", justifyContent: {xs: "center"}}} xs={6} md={2}>
              <Box component="img" sx={{height: 90, objectFit: "contain", borderRadius: "10px", width: "80%"}} src={product.url} alt={""} />
            </Grid>
            <Grid xs={6} md={2}>
              {product.item_no}
            </Grid>
            <Grid xs={6} md={2}>
              {product.color}
            </Grid>
            <Grid xs={6} md={3}>
              {product.description}
            </Grid>
            <Grid xs={12} md={3}>
              <Stack>
                <Typography>
                  Наличие: <strong>{product.quantity}</strong>
                </Typography>
                <Typography>
                  Цена: <strong>{product.price}</strong> $<br/>
                  (~{
                    Math.round((parseFloat(product.price) * rub + Number.EPSILON) * 100) / 100
                  } RUB, {
                    Math.round((parseFloat(product.price) * byn + Number.EPSILON) * 100) / 100
                  } BYN)
                </Typography>
                <Stack direction={"row"} sx={{alignItems: "center"}}>
                  <Button
                    className={"accent-button-style"}
                    sx={{lineHeight: "normal"}}
                    style={{height: "40px"}}
                    onClick={() => removeItem(product.id)}
                  >
                    Убрать из корзины
                  </Button>
                  <TextField
                    type="number"
                    InputProps={{
                      inputProps: {
                        max: product.quantity,
                        min: 0,
                      },
                    }}
                    size="small"
                    sx={{width: "100%"}}
                    value={product.quantityInCart}
                    onChange={handleCounterChange(product.id, product.quantity)}
                    label="Количество"
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      )
    })

    if(currentData && currentData.length) {
      setData(currentData);
    } else {
      setData(
        <Box sx={{backgroundColor: "lightgrey", padding: "15px", borderRadius: "5px"}}>
          <strong>
            Нет добавленных товаров
          </strong>
        </Box>
      )
    }
  }, [items, reloader, rub, byn]);

  return (
    <div className="buyouts-table">
      <Box sx={{flexGrow: 1}}>
        {data && data.length &&
          <Grid sx={{display: {xs: "none", md: "flex"}, padding: "25px 0"}} container spacing={2}>
            <Grid xs={2}>
              <strong>
                Изображение
              </strong>
            </Grid>
            <Grid xs={2}>
              <strong>
                Номер детали
              </strong>
            </Grid>
            <Grid xs={2}>
              <strong>
                Цвет
              </strong>
            </Grid>
            <Grid xs={3}>
              <strong>
                Описание
              </strong>
            </Grid>
            <Grid xs={3}>
              <strong>
                Информация
              </strong>
            </Grid>
          </Grid>
        }
        {data}
      </Box>
      {items &&
      <Pagination urlBase="cart" itemsLen={items.length} productsOnPage={perPage} setProductsOnPage={setPerPage}/>
      }
    </div>
  );
}
