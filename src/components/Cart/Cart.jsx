import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Skeleton from "@mui/material/Skeleton";
import CartTable from "../CartTable/CartTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Alert, CircularProgress, Snackbar, useMediaQuery} from "@mui/material";
import Navigation from "../Navigation/Navigation";
import {CartContext} from "../../context/CartContext";
import Paper from "@mui/material/Paper";
import axios from "axios";
import {CART_PDF_SAVE, ORDERS_POST_ORDER, WANTED_LIST_SAVE} from "../../constants/links";
import Stack from "@mui/material/Stack";
import {SettingsContext} from "../../context/SettingsContext";
import getSvg from "../../constants/svg";


// Helper function to convert image URL to base64
const imageToBase64 = async (url) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Failed to convert image to base64: ${url}`, error);
    return null; // Return null if image can't be loaded, backend will use URL fallback
  }
};

// Helper to prepare items with base64 images for PDF
const prepareItemsWithImages = async (items) => {
  const itemsWithImages = await Promise.all(
    items.map(async (item) => {
      const base64Image = await imageToBase64(item.url);
      return {
        id: item.id,
        quantity: item.quantityInCart,
        description: item.description,
        lot_id: item.lot_id,
        item_no: item.item_no,
        price: item.price,
        url: item.url,
        image_base64: base64Image // Include base64 image data
      };
    })
  );
  return itemsWithImages;
};

export default function Cart() {
  const isMobile = useMediaQuery('(max-width:700px)');

  const {items, getCartSum, getQuantitiesSum, clearCart} = useContext(CartContext);
  const {minCartPrice, multipl} = useContext(SettingsContext);
  // 0 - are you sure?, 1 - success, 2 - failure
  const [dialogStatus, setDialogStatus] = useState(0);
  const [dialogMessage, setDialogMessage] = useState('');
  const [mobileSecondPageOpen, setMobileSecondPageOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);
  const [tel, setTel] = useState('');
  const [name, setName] = useState('');
  const [shippingRequired, setShippingRequired] = useState(false);
  const [validation, setValidation] = useState({
    tel: false,
    name: false
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const validate = () => {
    const telMatch = tel.match(/^\+[1-9]\d{0,2}[\s\-]?\(?\d{1,4}\)?([\s\-]?\d{2,4}){2,5}$/g);
    const nameMatch = name.match(/^[A-Za-zА-Яа-яЁё]+(?:[-\s][A-Za-zА-Яа-яЁё]+)*$/g);
    // const emailMatch = email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    setValidation({
      tel: !telMatch,
      name: !nameMatch
    });

    return telMatch && nameMatch
  }

  const onDialogConfirm = async () => {
    setLoading(true);
    try {
      // Prepare items with base64 images for faster PDF generation on backend
      const itemsWithImages = await prepareItemsWithImages(items);
      
      const response = await axios.post(ORDERS_POST_ORDER(), {
        items: itemsWithImages,
        customer_telephone: tel,
        customer_name: name,
        dostavka: shippingRequired
      });
      
      setLoading(false);
      setDialogStatus(1);
    } catch (error) {
      setDialogMessage('');
      setLoading(false);
      setDialogStatus(2);
      if (error.response && error.response.status === 409) {
        setDialogMessage(error.response.data?.error);
      }
    }
  }

  const onFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onDialogConfirm()
    }
  }

  const saveAsWantedList = () => {
    setLoading(true);
    axios
      .post(WANTED_LIST_SAVE(), {items: items.map(item => ({
          id: item.id,
          quantity: item.quantityInCart,
          description: item.description,
          lot_id: item.lot_id,
          item_no: item.item_no
        }))}, {
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
        setLoading(false);
      })
      .catch(() => {
        setFailureSnackbarOpen(true);
        setLoading(false);
      })
  }

  const saveAsPdf = async () => {
    setLoading(true);
    try {
      // Prepare items with base64 images to avoid backend image fetching
      const itemsWithImages = await prepareItemsWithImages(items);
      
      const response = await axios.post(CART_PDF_SAVE(), {
        items: itemsWithImages
      }, {
        responseType: 'blob',
        timeout: 60000 // 60 second timeout as fallback
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'order_details.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setLoading(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
      setFailureSnackbarOpen(true);
      setLoading(false);
    }
  }

  const resetDialogStatus = () => {
    setDialogStatus(0);
    setDialogMessage('');
  }

  const clearAll = () => {
    clearCart();
    resetDialogStatus();
  }

  return (
    <>
      <Navigation drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}>
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
          {!isMobile &&
            <>
              <Grid item xs={12} md={9} sx={{padding: "20px"}}>
                <Stack direction={'row'} sx={{width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                  <Typography fontSize={28} align="left">
                    <strong>
                      Корзина
                    </strong>
                  </Typography>

                  <button
                    className="filled-normal-button"
                    style={{width: "260px"}}
                    disabled={!items.length}
                    onClick={() => clearCart()}
                  >Очистить</button>
                </Stack>
                <CartTable items={items} loading={loading || dialogStatus > 0}/>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{
                  backgroundColor: "#ECECEC",
                  width: "100%",
                  borderRadius: "0",
                  height: "100%",
                  minHeight: "95vh",
                  padding: "20px"
                }}>
                  {loading ?
                    <CircularProgress sx={{color: "#FF1B15"}}/>
                    : dialogStatus === 1 ?
                      <Box>
                        {getSvg('success', '')}
                        <Typography fontSize={20} sx={{marginBottom: "10px"}}>
                          <strong>
                            Заказ оформлен
                          </strong>
                        </Typography>
                        <Typography fontSize={18} style={{margin: "10px 0"}}>
                          Ваш заказ оформлен, мы свяжемся с вами для уточнения деталей.
                        </Typography>
                        <button type={"button"} style={{width: "100%"}} className={"filled-normal-button filled-normal-button__secondary"} onClick={() => clearAll()}>
                          Готово
                        </button>
                      </Box>
                    : dialogStatus === 2 ?
                      <Box>
                        <Typography fontSize={20}>
                          <strong>
                            Произошла ошибка
                          </strong>
                        </Typography>
                        <Typography fontSize={18} style={{margin: "10px 0"}}>
                          При отправке заказа произошла ошибка, повторите попытку позже. {dialogMessage}
                        </Typography>
                        <button type={"button"} style={{width: "100%"}} className={"filled-normal-button filled-normal-button__secondary"} onClick={() => resetDialogStatus()}>
                          Вернуться к оформлению заказа
                        </button>
                      </Box>
                    :
                    <Box component="form" onSubmit={onFormSubmit} sx={{width: "100%", display: "flex"}}>
                      <Stack sx={{width: "100%"}}>
                        <Typography fontSize={20} align={"start"} sx={{marginBottom: "10px"}}>
                          <strong>
                            Оформление заказа
                          </strong>
                        </Typography>
                        <Stack direction={'row'} sx={{justifyContent: "space-between", borderBottom: "1px solid #CCCCCC", paddingTop: "10px", paddingBottom: "10px"}}>
                          <Typography fontSize={18}>
                            Товаров
                          </Typography>
                          <Typography fontSize={20}>
                            <strong>
                              {getQuantitiesSum()}
                            </strong>
                          </Typography>
                        </Stack>
                        <Stack direction={'row'} sx={{justifyContent: "space-between", margin: "10px 0"}}>
                          <Typography fontSize={18}>
                            Сумма заказа
                          </Typography>
                          <Typography fontSize={20}>
                            <strong>
                              {getCartSum(multipl)}$
                            </strong>
                          </Typography>
                        </Stack>
                        <div className={"input-holder"} style={{padding: "10px"}}>
                          <input id="tel" className={"input-style"} placeholder="Номер телефона" value={tel} onChange={e => setTel(e.target.value)}/>
                        </div>
                        {validation["tel"] && <span className="error-text">Пример корректного номера: +375291234567</span>}
                        <div className={"input-holder"} style={{marginTop: "10px", padding: "10px"}}>
                          <input id="name" className={"input-style"} placeholder="Имя" value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                        {validation["name"] && <span className="error-text">Имя может содержать только русские или английские буквы</span>}
                        <label className="custom-checkbox" style={{margin: "10px 0"}}>
                          <input type="checkbox" checked={shippingRequired} onClick={() => setShippingRequired(!shippingRequired)}/>
                          <span className="checkmark"></span>
                          Нужна доставка
                        </label>
                        <button className={"filled-normal-button"} disabled={!items.length || getCartSum(multipl) < minCartPrice || !name || !tel} type="submit">
                          Отправить
                        </button>
                        <button type={"button"} className={"filled-normal-button filled-normal-button__secondary"} style={{margin: "10px 0"}} onClick={saveAsWantedList} disabled={!items.length}>
                          Скачать (как wanted list)
                        </button>
                        <button type={"button"} className={"filled-normal-button filled-normal-button__secondary"} onClick={saveAsPdf} disabled={!items.length}>
                          Скачать (как pdf)
                        </button>
                      </Stack>
                    </Box>
                  }
                </Paper>
              </Grid>
            </>
          }

          {isMobile &&
            <>
            {!mobileSecondPageOpen ?
              <Grid item xs={12} md={9} sx={{padding: "20px", backgroundColor: "#ECECEC", minHeight: "calc(100vh - 120px)"}}>
                <Stack direction={'row'} sx={{width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                  <Typography fontSize={22} sx={{ mb: 2 }} align="left">
                    <strong>
                      Корзина
                    </strong>
                  </Typography>

                  <Stack style={{margin: "0 0 16px"}}>
                    <button
                      className="filled-normal-button"
                      style={{padding: "0 16px"}}
                      onClick={() => clearCart()}
                      disabled={!items.length}
                    >Очистить</button>
                  </Stack>
                </Stack>
                <CartTable items={items} loading={loading || dialogStatus > 0}/>
                <button onClick={() => setMobileSecondPageOpen(true)} style={{
                  padding: "5px 10px",
                  height: "60px",
                  color: "white",
                  backgroundColor: "#FF1B15",
                  position: "fixed",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  zIndex: "1"
                }}>Перейти к оформлению</button>
              </Grid>
              :
              <Grid item xs={12} md={3}>
                <Paper sx={{
                  backgroundColor: "#ECECEC",
                  width: "100%",
                  borderRadius: "0",
                  height: "100%",
                  minHeight: "95vh",
                  padding: "20px"
                }}>
                  {loading ?
                    <CircularProgress sx={{color: "#FF1B15"}}/>
                    : dialogStatus === 1 ?
                      <Box>
                        {getSvg('success', '')}
                        <Typography fontSize={20} sx={{marginBottom: "10px"}}>
                          <strong>
                            Заказ оформлен
                          </strong>
                        </Typography>
                        <Typography fontSize={18} style={{margin: "10px 0"}}>
                          Ваш заказ оформлен, мы свяжемся с вами для уточнения деталей.
                        </Typography>
                        <button type={"button"} style={{width: "100%"}} className={"filled-normal-button filled-normal-button__secondary"} onClick={() => clearAll()}>
                          Готово
                        </button>
                      </Box>
                    : dialogStatus === 2 ?
                      <Box>
                        <Typography fontSize={20}>
                          <strong>
                            Произошла ошибка
                          </strong>
                        </Typography>
                        <Typography fontSize={18} style={{margin: "10px 0"}}>
                          При отправке заказа произошла ошибка, повторите попытку позже. {dialogMessage}
                        </Typography>
                        <button type={"button"} style={{width: "100%"}} className={"filled-normal-button filled-normal-button__secondary"} onClick={() => resetDialogStatus()}>
                          Вернуться к оформлению заказа
                        </button>
                      </Box>
                    :
                    <Box component="form" onSubmit={onFormSubmit} sx={{width: "100%", display: "flex"}}>
                      <Stack sx={{width: "100%"}}>
                        <button onClick={() => setMobileSecondPageOpen(false)} className="accent-button-style" style={{textAlign: "left", justifyContent: "flex-start", width: "100%"}}>
                          {`<  Назад`}
                        </button>
                        <Typography fontSize={20} align={"start"} sx={{marginBottom: "10px"}}>
                          <strong>
                            Оформление заказа
                          </strong>
                        </Typography>
                        <Stack direction={'row'} sx={{justifyContent: "space-between", borderBottom: "1px solid #CCCCCC", paddingTop: "10px", paddingBottom: "10px"}}>
                          <Typography fontSize={18}>
                            Товаров
                          </Typography>
                          <Typography fontSize={20}>
                            <strong>
                              {getQuantitiesSum()}
                            </strong>
                          </Typography>
                        </Stack>
                        <Stack direction={'row'} sx={{justifyContent: "space-between", margin: "10px 0"}}>
                          <Typography fontSize={18}>
                            Сумма заказа
                          </Typography>
                          <Typography fontSize={20}>
                            <strong>
                              {getCartSum(multipl)}$
                            </strong>
                          </Typography>
                        </Stack>
                        <div className={"input-holder"} style={{padding: "10px"}}>
                          <input id="tel" className={"input-style"} placeholder="Номер телефона" value={tel} onChange={e => setTel(e.target.value)}/>
                        </div>
                        {validation["tel"] && <span className="error-text">Пример корректного номера: +375291234567</span>}
                        <div className={"input-holder"} style={{marginTop: "10px", padding: "10px"}}>
                          <input id="name" className={"input-style"} placeholder="Имя" value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                        {validation["name"] && <span className="error-text">Имя может содержать только русские или английские буквы</span>}
                        <label className="custom-checkbox" style={{margin: "10px 0"}}>
                          <input type="checkbox" checked={shippingRequired} onClick={() => setShippingRequired(!shippingRequired)}/>
                          <span className="checkmark"></span>
                          Нужна доставка
                        </label>
                        <button className={"filled-normal-button"} disabled={!items.length || getCartSum(multipl) < minCartPrice || !name || !tel} type="submit">
                          Отправить
                        </button>
                        <button type={"button"} className={"filled-normal-button filled-normal-button__secondary"} style={{margin: "10px 0"}} onClick={saveAsWantedList} disabled={!items.length}>
                          Скачать (как wanted list)
                        </button>
                        <button type={"button"} className={"filled-normal-button filled-normal-button__secondary"} onClick={saveAsPdf} disabled={!items.length}>
                          Скачать (как pdf)
                        </button>
                      </Stack>
                    </Box>
                  }
                </Paper>
              </Grid>
            }
            </>
          }
        </Grid>
      </Box>
    </>
  );
}
