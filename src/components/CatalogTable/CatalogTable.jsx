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
import {CartContext} from "../../context/CartContext";
import {ItemsContext} from "../../context/ItemsContext";
import TextField from "@mui/material/TextField";
import {SettingsContext} from "../../context/SettingsContext";

export default function CatalogTable({items, notFoundItems}) {
  const {perPage, setPerPage, pages} = useContext(ItemsContext);
  // end pagination

  const {addItem, removeItem, isItemInCart, reloader} = useContext(CartContext);
  const {rub, byn} = useContext(SettingsContext);

  const [data, setData] = useState([]);
  const [counters, setCounters] = useState({});

  useEffect(() => {
    // Инициализация значений счётчиков при загрузке items
    const initialCounters = {};
    items.forEach((product) => {
      initialCounters[product.id] = 0;
    });
    setCounters(initialCounters);
  }, [items]);

  const handleCounterChange = (id, max) => (event) => {
    console.log(id, event.target.value);
    if (event.target.value.startsWith('-')) {
      return;
    }
    const value = parseInt(event.target.value, 10);
    if (value <= max || !value) {
      setCounters((prev) => ({
        ...prev,
        [id]: isNaN(value) ? 0 : value,
      }));
    }
  };

  console.log(counters);

  // Передача количества в addItem
  const handleAddToCart = (product) => {
    const quantity = counters[product.id] || 0;
    product.quantityInCart = quantity;
    addItem(product);
  }

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
              <Box component="img" sx={{height: 90, objectFit: "cover", borderRadius: "10px"}} src={product.url} alt={""} />
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
                  Наличие: {product.quantity}
                </Typography>
                <Typography>
                  Цена: {product.price} $ ({
                    Math.round((parseFloat(product.price) * rub + Number.EPSILON) * 100) / 100
                  } RUB, {
                    Math.round((parseFloat(product.price) * byn + Number.EPSILON) * 100) / 100
                  } BYN)
                </Typography>
                {isItemInCart(product.id)
                  ? <Button className={"accent-button-style"} onClick={() => removeItem(product.id)}>Убрать из корзины</Button>
                  :
                  <>
                    <TextField
                      type="number"
                      InputProps={{
                        inputProps: {
                          max: product.quantity,
                          min: 0,
                        },
                      }}
                      value={counters[product.id] || ''}
                      onChange={handleCounterChange(product.id, product.quantity)}
                      label="Количество"
                    />
                    <Button
                      className="accent-button-style"
                      onClick={() => handleAddToCart(product)}
                      disabled={!(counters[product.id] > 0)}
                    >
                      Добавить в корзину
                    </Button>
                  </>
                }
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
  }, [items, reloader, counters]);

  return (
    <div className="buyouts-table">
      <Box sx={{flexGrow: 1}}>
        {data && data.length &&
          <Grid sx={{display: {xs: "none", md: "flex"}, padding: "25px 0"}} container spacing={2}>
            {/*<Grid xs={1}>*/}
            {/*  <Checkbox />*/}
            {/*</Grid>*/}
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
      {items && !notFoundItems &&
      <Pagination urlBase="catalog" itemsLen={items.length} amountOfPages={pages} productsOnPage={perPage} setProductsOnPage={setPerPage}/>
      }
      {notFoundItems && notFoundItems.length &&
        <>
          <Typography variant={"h6"} align="left" gutterBottom>
            <strong>Товары, которые не были найдены</strong>
          </Typography>
          <Typography align="left" gutterBottom>
            {notFoundItems.join(', ')}
          </Typography>
        </>
      }
    </div>
  );
}
