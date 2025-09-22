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

  const {removeItem, changeQuantityOfItemInCart, reloader, items: cartItems} = useContext(CartContext);
  const {rub, byn} = useContext(SettingsContext);

  const [data, setData] = useState([]);
  const [counters, setCounters] = useState({});

  useEffect(() => {
    if (!items || !cartItems) return;

    const syncedCounters = {};
    items.forEach((product) => {
      const cartItem = cartItems.find((ci) => ci.id === product.id);
      syncedCounters[product.id] = cartItem ? cartItem.quantityInCart : 0;
    });

    setCounters(syncedCounters);
  }, [items, cartItems.length]);

  const handleCounterChange = (item, max) => (unprocessedValue) => {
    console.log(item, unprocessedValue);
    if (
      typeof unprocessedValue === 'string' && (unprocessedValue.startsWith('-') || unprocessedValue === '')
      || typeof unprocessedValue === "number" && !isNaN(unprocessedValue) && unprocessedValue < 0
    ) {
      setCounters((prev) => ({
        ...prev,
        [item.id]: 0,
      }));
      removeItem(item.id);
      return;
    }
    const value = parseInt(unprocessedValue, 10);
    console.log(value);
    if (value <= max || !value) {
      setCounters((prev) => ({
        ...prev,
        [item.id]: isNaN(value) ? 0 : value,
      }));
      changeQuantityOfItemInCart(item, value)
    }
  };

  console.log(counters);

  // Передача количества в addItem
  // const handleAddToCart = (product) => {
  //   const quantity = counters[product.id] || 0;
  //   product.quantityInCart = quantity;
  //   addItem(product);
  // }

  useEffect(() => {
    const currentData = items.map((product, index) => {
      return (
        <Paper sx={{
          width: {xs: "auto"},
          height: {xs: "auto"},
          padding: {xs: "5px", md: 0},
          margin: {xs: "10px auto", md: 0},
          // backgroundColor: (index % 2 === 1) ? "" : "#f2f2f2",
          boxShadow: { md: "none", xs: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)" }
        }}>
          <Grid container alignItems="center" spacing={2} sx={{marginTop: {xs: "15px", md: 'auto'}, marginBottom: "10px", textAlign: "left", borderBottom: "1px solid #D7D7D7"}}>
            {/*<Grid xs={1} md={1}>*/}
            {/*  <Checkbox />*/}
            {/*</Grid>*/}
            <Grid sx={{display: "flex", alignItems: "center", justifyContent: {xs: "center"}}} xs={6} md={2}>
              <Box
                component="img"
                sx={{height: 90, objectFit: "contain", borderRadius: "10px", width: "80%"}}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://storage.googleapis.com/lego-bricks-app-frontend/default.jpg";
                }}
                src={product.url}
                alt={""} />
            </Grid>
            <Grid xs={6} md={2} sx={{wordBreak: "break-all"}}>
              {product.item_no}
            </Grid>
            <Grid xs={6} md={1}>
              {product.color}
            </Grid>
            <Grid xs={6} md={3}>
              {product.description.split('.').map((part, index, arr) => (
                <span key={index}>
                  {part}
                  {index < arr.length - 1 && (
                    <>
                      .<br />
                    </>
                  )}
                </span>
              ))}
            </Grid>
            <Grid xs={12} md={4}>
              <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                <Stack>
                  <Typography fontSize={20}>
                    <strong>{product.price}$</strong>
                  </Typography>
                  <Typography fontSize={14} color={"#00000080"}>
                    (~{
                      Math.round((parseFloat(product.price) * rub + Number.EPSILON) * 100) / 100
                    } RUB, {
                      Math.round((parseFloat(product.price) * byn + Number.EPSILON) * 100) / 100
                    } BYN)
                  </Typography>
                  <Typography fontSize={14}>
                    <Stack direction={"row"} sx={{alignItems: "center"}}>
                      <div style={{backgroundColor: product.quantity > 0 ? "#04BA2E" : "#BDBDBD", height: "10px", width: "10px", marginRight: "10px"}}/>
                      {product.quantity > 0 ? `В наличии ${product.quantity} шт.` : 'Нет в наличии'}
                    </Stack>
                  </Typography>
                </Stack>
                {/*{isItemInCart(product.id)*/}
                {/*  ? <button className={"accent-button-style"} onClick={() => removeItem(product.id)}>Убрать из корзины</button>*/}
                {/*  :*/}
                  <Stack direction={"row"} sx={{alignItems: "center", border: "1px solid #D7D7D7", margin: "auto 0"}}>
                    {/*<button*/}
                    {/*  className="accent-button-style"*/}
                    {/*  onClick={() => handleAddToCart(product)}*/}
                    {/*  disabled={!(counters[product.id] > 0)}*/}
                    {/*  sx={{lineHeight: "normal"}}*/}
                    {/*  style={{height: "40px"}}*/}
                    {/*>*/}
                    {/*  Добавить в корзину*/}
                    {/*</button>*/}
                    <button
                      className="quantity-button"
                      style={{backgroundColor: counters[product.id] ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((counters[product.id] || 0) - 1)}
                    >-</button>
                    <input
                      type="number"
                      className="plain-number"
                      min={0}
                      max={product.quantity}
                      value={counters[product.id] || 0}
                      onChange={(e) => handleCounterChange(product, product.quantity)(e.target.value)}
                    />
                    <button
                      className="quantity-button"
                      style={{backgroundColor: counters[product.id] ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((counters[product.id] || 0) + 1)}
                    >+</button>
                  </Stack>
                {/*}*/}
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
        <Box sx={{backgroundColor: "#ECECEC", padding: "15px"}}>
          <strong>
            Нет товаров
          </strong>
        </Box>
      )
    }
  }, [items, reloader, counters]);

  return (
    <div className="buyouts-table">
      <Box sx={{flexGrow: 1}}>
        {data && data.length &&
          <Grid sx={{display: {xs: "none", md: "flex"}, padding: "10px 0", textAlign: "left", borderBottom: "1px solid #D7D7D7", marginBottom: "10px"}} container spacing={2}>
            {/*<Grid xs={1}>*/}
            {/*  <Checkbox />*/}
            {/*</Grid>*/}
            <Grid xs={2}>
              <Typography fontSize={14} color={"#00000080"}>
                Фото
              </Typography>
            </Grid>
            <Grid xs={2}>
              <Typography fontSize={14} color={"#00000080"}>
                Номер детали
              </Typography>
            </Grid>
            <Grid xs={1}>
              <Typography fontSize={14} color={"#00000080"}>
                Цвет
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Typography fontSize={14} color={"#00000080"}>
                Описание
              </Typography>
            </Grid>
            <Grid xs={4}>
              <Typography fontSize={14} color={"#00000080"}>
                Цена
              </Typography>
            </Grid>
          </Grid>
        }
        {data}
      </Box>
      {items && !notFoundItems &&
      <Pagination urlBase="catalog" itemsLen={items.length} amountOfPages={pages} productsOnPage={perPage} setProductsOnPage={setPerPage}/>
      }
      {notFoundItems && notFoundItems.length ?
        <>
          <Typography variant={"h6"} align="left" gutterBottom>
            <strong>Товары, которые не были найдены</strong>
          </Typography>
          <Typography align="left" gutterBottom>
            {notFoundItems.join(', ')}
          </Typography>
        </>
        :
        <></>
      }
    </div>
  );
}
