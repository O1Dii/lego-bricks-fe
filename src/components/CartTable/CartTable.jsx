import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import {Button, useMediaQuery} from "@mui/material";
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
import decodeHtml from "../../utils/decodeHtml";

export default function CartTable({items, loading}) {
  const [perPage, setPerPage] = useState(20);
  // end pagination

  const {getCartSum, removeItem, getQuantityOfItemInCart, reloader, changeQuantityOfItemInCart} = useContext(CartContext);
  const {rub, byn, minCartPrice, multipl} = useContext(SettingsContext);

  const [data, setData] = useState([]);
  const isMobile = useMediaQuery('(max-width:700px)');

  const handleCounterChange = (item, max) => (unprocessedValue) => {
    console.log(item, unprocessedValue);
    if (
      typeof unprocessedValue === 'string' && (unprocessedValue.startsWith('-') || unprocessedValue === '')
      || typeof unprocessedValue === "number" && !isNaN(unprocessedValue) && unprocessedValue < 0
    ) {
      removeItem(item.id);
      return;
    }
    const value = parseInt(unprocessedValue, 10);
    console.log(value);
    if (value <= max || !value) {
      changeQuantityOfItemInCart(item, value)
    }
  };

  useEffect(() => {
    let currentData = null;

    // presort data
    const sortedItems = items.sort((a, b) => {
      const colorA = (a.color ?? '').toString().toLowerCase();
      const colorB = (b.color ?? '').toString().toLowerCase();

      const colorCompare = colorA.localeCompare(colorB, undefined, {
        sensitivity: 'base',
        numeric: false
      });

      if (colorCompare !== 0) {
        return colorCompare;
      }

      const itemNoA = a.item_no ?? '';
      const itemNoB = b.item_no ?? '';

      return itemNoA.toString().localeCompare(
        itemNoB.toString(),
        undefined,
        { numeric: true }
      );
    });

    if (isMobile) {
      currentData = sortedItems.map((product, index) => (
        <Grid item xs={6} key={product.id} sx={{display: "flex"}}>
          <Paper sx={{
            width: "auto",
            height: "100%",
            boxShadow: "none",
            borderRadius: 0,
            padding: "10px",
            flex: 1
          }}>
            <Grid container alignItems="center" spacing={1} sx={{
              textAlign: "left",
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "flex-start",
              margin: 0,
              height: "100%"
            }}>
              <Box>
                <Grid sx={{display: "flex", alignItems: "center", justifyContent: "center"}} xs={12}>
                  <Box
                    component="img"
                    sx={{height: 90, objectFit: "contain", borderRadius: "10px", width: "80%"}}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://storage.googleapis.com/lego-bricks-app-frontend/default.jpg";
                    }}
                    src={product.url}
                    alt={""}/>
                </Grid>
                <Grid xs={12} sx={{marginBottom: "auto"}}>
                  {decodeHtml(product.description).split('.').map((part, index, arr) => (
                    <span key={index}>
                      {part}
                      {index < arr.length - 1 && (
                        <>
                          .<br/>
                        </>
                      )}
                    </span>
                  ))}
                </Grid>
              </Box>
              <Box sx={{width: "100%"}}>
                <Grid xs={12}>
                  <Typography fontSize={12}>
                    <Stack direction={"row"} sx={{alignItems: "center"}}>
                      <div style={{backgroundColor: "#04BA2E", height: "10px", width: "10px", marginRight: "10px"}}/>
                      В наличии {product.quantity} шт.
                    </Stack>
                  </Typography>
                </Grid>
                <Grid xs={12} sx={{wordBreak: "break-all", width: "100%", paddingBottom: 0}}>
                  <Typography fontSize={12} sx={{display: "flex", justifyContent: "space-between"}}>
                    <span style={{color: "#00000080", wordBreak: "break-word"}}>Номер детали</span><span>{product.item_no}</span>
                  </Typography>
                </Grid>
                <Grid xs={12} sx={{justifyContent: "space-between", width: "100%", paddingTop: 0}}>
                  <Typography fontSize={12} sx={{display: "flex", justifyContent: "space-between"}}>
                    <span style={{color: "#00000080", wordBreak: "break-word"}}>Цвет</span><span>{product.color}</span>
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Stack>
                    <Typography fontSize={16}>
                      <strong>{Math.round((product.price * multipl + Number.EPSILON) * 100) / 100}$</strong>
                    </Typography>
                    <Typography fontSize={12} color={"#00000080"}>
                      (~{
                      Math.round((parseFloat(product.price) * multipl * rub + Number.EPSILON) * 100) / 100
                    } RUB, {
                      Math.round((parseFloat(product.price) * multipl * byn + Number.EPSILON) * 100) / 100
                    } BYN)
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack direction={"row"} sx={{alignItems: "center", justifyContent: "space-evenly", border: "1px solid #D7D7D7", padding: "5px", margin: "auto 0", width: "100%"}}>
                    <button
                      className="quantity-button"
                      style={{backgroundColor: getQuantityOfItemInCart(product.id) ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((getQuantityOfItemInCart(product.id) || 0) - 1)}
                    >-
                    </button>
                    <input
                      type="number"
                      className="plain-number"
                      min={0}
                      max={product.quantity}
                      value={getQuantityOfItemInCart(product.id)}
                      onChange={(e) => handleCounterChange(product, product.quantity)(e.target.value)}
                    />
                    <button
                      className="quantity-button"
                      style={{backgroundColor: getQuantityOfItemInCart(product.id) ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((getQuantityOfItemInCart(product.id) || 0) + 1)}
                    >+
                    </button>
                  </Stack>
                </Grid>
              </Box>
            </Grid>
          </Paper>
        </Grid>
      ))
    } else {
      currentData = sortedItems.map((product, index) => {
        return (
          <Paper sx={{
            width: {xs: "auto"},
            height: {xs: "auto"},
            padding: {xs: "5px", md: 0},
            margin: {xs: "10px auto", md: 0},
            // backgroundColor: (index % 2 === 1) ? "" : "#f2f2f2",
            boxShadow: {
              md: "none",
              xs: "0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)"
            }
          }}>
            <Grid container alignItems="center" spacing={2} sx={{
              marginTop: {xs: "15px", md: 'auto'},
              marginBottom: "10px",
              textAlign: "left",
              borderBottom: "1px solid #D7D7D7"
            }}>
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
                  alt={""}/>
              </Grid>
              <Grid xs={6} md={2} sx={{wordBreak: "break-all"}}>
                {product.item_no}
              </Grid>
              <Grid xs={6} md={1}>
                {product.color}
              </Grid>
              <Grid xs={6} md={3}>
                {decodeHtml(product.description).split('.').map((part, index, arr) => (
                  <span key={index}>
                    {part}
                    {index < arr.length - 1 && (
                      <>
                        .<br/>
                      </>
                    )}
                  </span>
                ))}
              </Grid>
              <Grid xs={12} md={4}>
                <Stack direction={"row"} sx={{justifyContent: "space-between"}}>
                  <Stack>
                    <Typography fontSize={20}>
                      <strong>{Math.round((product.price * multipl + Number.EPSILON) * 100) / 100}$</strong>
                    </Typography>
                    <Typography fontSize={14} color={"#00000080"}>
                      (~{
                      Math.round((parseFloat(product.price) * multipl * rub + Number.EPSILON) * 100) / 100
                    } RUB, {
                      Math.round((parseFloat(product.price) * multipl * byn + Number.EPSILON) * 100) / 100
                    } BYN)
                    </Typography>
                    <Typography fontSize={14}>
                      <Stack direction={"row"} sx={{alignItems: "center"}}>
                        <div style={{backgroundColor: "#04BA2E", height: "10px", width: "10px", marginRight: "10px"}}/>
                        В наличии {product.quantity} шт.
                      </Stack>
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} sx={{alignItems: "center", border: "1px solid #D7D7D7", margin: "auto 0"}}>
                    <button
                      className="quantity-button"
                      style={{backgroundColor: getQuantityOfItemInCart(product.id) ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((getQuantityOfItemInCart(product.id) || 0) - 1)}
                    >-
                    </button>
                    <input
                      type="number"
                      className="plain-number"
                      min={0}
                      max={product.quantity}
                      value={getQuantityOfItemInCart(product.id)}
                      onChange={(e) => handleCounterChange(product, product.quantity)(e.target.value)}
                    />
                    <button
                      className="quantity-button"
                      style={{backgroundColor: getQuantityOfItemInCart(product.id) ? "#FF1B15" : ""}}
                      onClick={() => handleCounterChange(product, product.quantity)((getQuantityOfItemInCart(product.id) || 0) + 1)}
                    >+
                    </button>
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        )
      })
    }

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
  }, [items, reloader, rub, byn]);

  return (
    <div className="buyouts-table" style={{position: "relative"}}>
      <Box sx={{flexGrow: 1}}>
        {data && data.length &&
          <Grid sx={{display: {xs: "none", md: "flex"}, padding: "10px 0", textAlign: "left", borderBottom: "1px solid #D7D7D7", marginBottom: "10px"}} container spacing={2}>
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
        {isMobile ?
          <Grid container alignItems="stretch" spacing={2} sx={{marginBottom: "10px"}}>
            {data}
          </Grid>
          :
          <>
            {data}
          </>
        }
      </Box>
      <Stack direction={"row"} sx={{justifyContent: "space-between", width: "100%", marginTop: "20px"}}>
        <Typography fontSize={20}>
          Товаров на сумму
        </Typography>
        <Stack sx={{alignItems: "flex-end"}}>
          <Typography fontSize={isMobile ? 20 : 24}>
            <strong>
              {getCartSum(multipl)}$
            </strong>
            (~{
              Math.round((getCartSum(multipl) * rub + Number.EPSILON) * 100) / 100
            } RUB, {
              Math.round((getCartSum(multipl) * byn + Number.EPSILON) * 100) / 100
            } BYN)
          </Typography>
          <span style={{visibility: getCartSum(multipl) < minCartPrice ? '' : 'hidden', color: "#FF1B15"}}>Минимальная стоимость корзины - <strong>{minCartPrice}</strong> $ </span>
        </Stack>
      </Stack>

      {loading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "all", // блокирует клики сквозь
        }}>
        </div>
      )}
    </div>
  );
}
