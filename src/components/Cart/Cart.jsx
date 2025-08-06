import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import CartTable from "../CartTable/CartTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert, CircularProgress, FormControlLabel, Snackbar} from "@mui/material";
import Navigation from "../Navigation/Navigation";
import {CartContext} from "../../context/CartContext";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios";
import {CART_PDF_SAVE, ORDERS_POST_ORDER, WANTED_LIST_SAVE} from "../../constants/links";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import {SettingsContext} from "../../context/SettingsContext";


export default function Cart() {
  const {items, getCartSum, clearCart} = useContext(CartContext);
  const {minCartPrice, rub, byn} = useContext(SettingsContext);
  const [open, setOpen] = useState(false);
  // 0 - are you sure?, 1 - success, 2 - failure
  const [dialogStatus, setDialogStatus] = useState(0);
  const [dialogMessage, setDialogMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);
  const [tel, setTel] = useState('');
  const [name, setName] = useState('');
  const [shippingRequired, setShippingRequired] = useState(false);
  const [validation, setValidation] = useState({
    tel: false,
    name: false
  });

  const openDialog = () => {
    setDialogStatus(0);
    setOpen(true);
  }

  const closeDialog = () => {
    if (!loading) {
      setOpen(false);
    }
  }

  const validate = () => {
    const telMatch = tel.match(/^\+[1-9]\d{0,2}[\s\-]?\(?\d{1,4}\)?([\s\-]?\d{2,4}){2,5}$/g);
    // const emailMatch = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    // console.log({tel: !telMatch, email: !emailMatch})
    setValidation({
      tel: !telMatch,
      // email: !emailMatch
    });

    // return telMatch && emailMatch
    return telMatch
  }

  const onDialogConfirm = () => {
    setLoading(true);
    axios
      .post(ORDERS_POST_ORDER(), {
        items: items.map(item => ({id: item.id, quantity: item.quantityInCart})),
        customer_telephone: tel,
        customer_name: name,
        dostavka: shippingRequired
      })
      .then(response => {
        setLoading(false);
        clearCart();
        setDialogStatus(1);
      })
      .catch(error => {
        setDialogMessage('');
        setLoading(false);
        setDialogStatus(2);
        if (error.response && error.response.status === 409) {
          setDialogMessage(error.response.data?.error);
        }
      })
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(validate());
    if (validate()) {
      openDialog()
    }
  }

  const saveAsWantedList = () => {
    axios
      .post(WANTED_LIST_SAVE(), {items}, {
        responseType: 'blob'
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/xml' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'wanted_list.xml';
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        setFailureSnackbarOpen(true);
      })
  }

  const saveAsPdf = () => {
    axios
      .post(CART_PDF_SAVE(), {items}, {
        responseType: 'blob'
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'order_details.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(() => {
        setFailureSnackbarOpen(true);
      })
  }

  return (
    <>
      <Navigation>
      </Navigation>
      <Snackbar
        open={failureSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setFailureSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setFailureSnackbarOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Произошла ошибка!
        </Alert>
      </Snackbar>
      <Box className={"main-page-content"}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={10} sx={{padding: "20px"}}>
            <Stack direction={'row'} sx={{width: "100%", justifyContent: "space-between", alignItems: "center"}}>
              <Typography variant="h4" align="left" gutterBottom>
                <strong>
                  Корзина
                </strong>
              </Typography>
              <Typography align="right" gutterBottom>
                <span style={{color: getCartSum() < minCartPrice ? 'red' : 'black'}}>Минимальная стоимость корзины - <strong>{minCartPrice}</strong> $ </span><br/>
                Текущая стоимость корзины - <strong>{getCartSum()}</strong> $ (~{
                  Math.round((getCartSum() * rub + Number.EPSILON) * 100) / 100
                } RUB, {
                  Math.round((getCartSum() * byn + Number.EPSILON) * 100) / 100
                } BYN)
              </Typography>
            </Stack>
            <CartTable items={items}/>
          </Grid>
          <Grid item xs={12} md={2}>
            <Paper sx={{
              backgroundColor: "#f2f2f2",
              width: "100%",
              borderRadius: "0",
              height: "100%",
              minHeight: "95vh"
            }}>
              <Typography sx={{fontSize: "10px", padding: "15px 15px 0 15px"}} align="left">
                Заполните контактные данные, чтобы закончить оформление
              </Typography>
              <Box component="form" onSubmit={onFormSubmit} sx={{width: "100%"}} display="flex">
                <Stack sx={{padding: "15px", width: "100%"}}>

    {/*items_data = data.get('items')*/}
    {/*customer_name = data.get('customer_name')*/}
    {/*customer_telephone = data.get('customer_telephone')*/}
    {/*dostavka = data.get('dostavka', False)*/}
    {/*# TODO: change*/}
    {/*total_price = data.get('total_price')*/}
                  <TextField id="tel" error={validation['tel']} sx={{width: "100%", margin: "5px auto"}} label="Номер телефона" variant={"outlined"} value={tel} onChange={e => setTel(e.target.value)}/>
                  <TextField id="name" error={validation['name']} sx={{width: "100%", margin: "5px auto"}} label="Имя" variant={"outlined"} value={name} onChange={e => setName(e.target.value)}/>
                  <FormControlLabel control={<Checkbox checked={shippingRequired} onClick={() => setShippingRequired(!shippingRequired)} />} label="Мне нужна доставка" />
                  <Button className={"accent-button-style"} sx={{width: "100%", margin: "5px auto"}} disabled={!items.length || getCartSum() < minCartPrice || !name || !tel} type="submit">
                    Отправить
                  </Button>
                  <Button className={"accent-button-style"} sx={{width: "100%", margin: "5px auto"}} onClick={saveAsWantedList} disabled={!items.length}>
                    Скачать (как wanted list)
                  </Button>
                  <Button className={"accent-button-style"} sx={{width: "100%", margin: "5px auto"}} onClick={saveAsPdf} disabled={!items.length}>
                    Скачать (как pdf)
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {loading ?
          <>
            <DialogTitle id="alert-dialog-title">
              Отправить заказ?
            </DialogTitle>
            <DialogContent>
              <CircularProgress />
            </DialogContent>
          </>
          : dialogStatus === 0 ?
          <>
            <DialogTitle id="alert-dialog-title">
              Отправить заказ?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                После подтверждения заказ попадёт к администратору, после чего с Вами свяжутся с помощью контактных данных, которые Вы оставили
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Нет</Button>
              <Button onClick={onDialogConfirm} autoFocus>
                Да
              </Button>
            </DialogActions>
          </>
          : dialogStatus === 1 ?
          <>
            <DialogTitle id="alert-dialog-title">
              Отправить заказ?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Заказ отправлен успешно
              </DialogContentText>
            </DialogContent>
          </>
          :
          <>
            <DialogTitle id="alert-dialog-title">
              Ошибка
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                При отправке заказа произошла ошибка, повторите попытку позже. {dialogMessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog}>Ок</Button>
            </DialogActions>
          </>
        }
      </Dialog>
    </>
  );
}
