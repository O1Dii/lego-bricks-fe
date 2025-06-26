import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import CartTable from "../CartTable/CartTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CircularProgress} from "@mui/material";
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
import {ORDERS_POST_ORDER} from "../../constants/links";
import Stack from "@mui/material/Stack";


export default function Cart() {
  const {items} = useContext(CartContext);
  const [open, setOpen] = useState(false);
  // 0 - are you sure?, 1 - success, 2 - failure
  const [dialogStatus, setDialogStatus] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [validation, setValidation] = useState({
    tel: false,
    email: false
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
    const telMatch = tel.match(/^\+[1-9]{1}[0-9]{3,14}$/g);
    const emailMatch = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    console.log({tel: !telMatch, email: !emailMatch})
    setValidation({
      tel: !telMatch,
      email: !emailMatch
    });

    return telMatch && emailMatch
  }

  const onDialogConfirm = () => {
    setLoading(true);
    axios
      .post(ORDERS_POST_ORDER(), {
        items: items,
        tel: tel,
        email: email
      })
      .then(response => {
        setLoading(false);
        setDialogStatus(1);
      })
      .catch(error => {
        setLoading(false);
        setDialogStatus(2);
      })
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(validate());
    if (validate()) {
      openDialog()
    }
  }

  return (
    <>
      <Navigation>
      </Navigation>
      <Box className={"main-page-content"}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={10} sx={{padding: "20px"}}>
            <Typography variant="h4" align="left" gutterBottom>
              <strong>
                Корзина
              </strong>
            </Typography>
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
              <Box component="form" onSubmit={onFormSubmit} sx={{width: "100%"}} display="flex">
                <Stack sx={{padding: "15px", width: "100%"}}>
                  <TextField id="tel" error={validation['tel']} sx={{width: "100%", margin: "5px auto"}} label="Номер телефона" variant={"outlined"} value={tel} onChange={e => setTel(e.target.value)}/>
                  <TextField id="email" error={validation['email']} sx={{width: "100%", margin: "5px auto"}} label="Email" variant={"outlined"} value={email} onChange={e => setEmail(e.target.value)}/>
                  <Button className={"accent-button-style"} sx={{width: "100%", margin: "5px auto"}} disabled={!items.length} type="submit">
                    Отправить
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
              Отправить заказ?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                При отправке заказа произошла ошибка, повторите попытку позже
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
