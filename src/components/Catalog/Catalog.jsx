import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {
  Alert,
  Button,
  Collapse, Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Tooltip, useMediaQuery
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import CatalogTable from "../CatalogTable/CatalogTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ItemsContext} from '../../context/ItemsContext';
import CatalogSearch from '../CatalogSearch/CatalogSearch';

import {ARTICLES_GET_AND_UPDATE_ARTICLE, DB_UPLOAD, GET_PRESIGNED_URL, WANTED_LIST} from '../../constants/links';

import axios from 'axios';
import Navigation from "../Navigation/Navigation";
import {styled} from "@mui/styles";
import {useLocation, useNavigate} from "react-router-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";
import getSvg from "../../constants/svg";
import CategoriesMenu from "../CategoriesMenu/CategoriesMenu";
import Dropdown from "../Dropdown/Dropdown";


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


export default function Catalog() {
  const sortMap = {
    'Номер детали': 'item_no',
    'Цена': 'price',
    'Количество': 'quantity',
    'Цвет': 'color'
  }
  const navigate = useNavigate();

  const {items, categories, loadItems, loadCategories, loading, categoriesLoading, uploadWantedList} = useContext(ItemsContext);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Parts');

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [applyAllMinQuantityCounter, setApplyAllMinQuantityCounter] = useState(0);
  const [selectedSort, setSelectedSort] = useState('Номер детали');
  const [perPage, setPerPage] = useState(25);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const isMobile = useMediaQuery('(max-width:700px)');

  const clearQuery = () => {
    navigate(location.pathname, { replace: true });
  };

  const onSearchClick = (e) => {
    e.preventDefault();
    console.log('search click')
    loadItems(searchValue, 1, selectedCategory, sortMap[selectedSort], perPage);
    clearQuery();
    loadCategories();
    setShowMenu(false);
  }

  const onFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadWantedList(file);

    setShowMenu(false);
  };

  // function renderCategories(categories, depth = 0, parentCategories) {
  //   return Object.entries(categories).map(([key, value]) => {
  //     const hasChildren = Object.keys(value).length > 0;
  //     const isOpen = categoryOpen.includes(key);
  //
  //     return (
  //       <React.Fragment key={key}>
  //         <ListItemButton
  //           onClick={hasChildren ? () => toggleCategory(key) : () => setSelectedCategory(key === selectedCategory.split(' / ').at(-1) ? 'Parts' : depth ? `${parentCategories} / ${key}` : key)}
  //           sx={{ pl: 2 + depth * 2, backgroundColor: key === selectedCategory.split(' / ').at(depth) && key !== '' && 'darkgrey' }}
  //         >
  //           <ListItemText primary={key} />
  //           {hasChildren &&
  //             (isOpen ? <ExpandLess /> : <ExpandMore />)}
  //         </ListItemButton>
  //
  //         {hasChildren && (
  //           <Collapse in={isOpen} timeout="auto" unmountOnExit>
  //             <List component="div" disablePadding>
  //               {renderCategories(value, depth + 1, depth ? `${parentCategories} / ${key}` : key)}
  //             </List>
  //           </Collapse>
  //         )}
  //       </React.Fragment>
  //     );
  //   });
  // }

  useEffect(() => {
    console.log('use effect')
    loadItems('', 1, selectedCategory, sortMap[selectedSort], perPage);
    clearQuery();
    setShowMenu(false);
    setSearchValue('');
    loadCategories();
  }, [selectedCategory])

  useEffect(() => {
    console.log('use effect')
    loadItems(searchValue, page, selectedCategory, sortMap[selectedSort], perPage);
    loadCategories();
  }, [page, selectedSort, perPage])

  return (
    <>
      <Navigation
        onMobileCatalogClick={() => setShowMenu(!showMenu)}
        searchComponent={
          <CatalogSearch
            boxStyle={{boxShadow: "inset 0 4px 4px -2px lightgrey"}}
            value={searchValue}
            setValue={setSearchValue}
            onSearchClick={onSearchClick}
          />
        }
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSuccessSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSuccessSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Файл успешно загружен, скоро изменения вступят в силу!
        </Alert>
      </Snackbar>
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
          Произошла ошибка при загрузке файла!
        </Alert>
      </Snackbar>
      <Box className={"main-page-content"}>
        <Grid container spacing={0}>
          {/* ПК версия */}
          {!isMobile && (
            <>
              <Grid item xs={3} sx={{
                backgroundColor: "#ECECEC",
                position: "sticky",
                top: 0,
                height: "100vh",
                overflowY: "auto",
                paddingRight: "8px",
                boxSizing: "border-box",
                padding: "20px"
              }}
              >
                <Stack>
                  <div>
                    <CatalogSearch
                      value={searchValue}
                      setValue={setSearchValue}
                      onSearchClick={onSearchClick}
                    />
                  </div>
                  <Tooltip title="Загрузите Wanted list с BL — система автоматически найдёт все доступные детали из вашего списка">
                    <label
                      className="accent-button-style"
                      style={{
                        height: "auto",
                        margin: "10px 0 20px 0",
                        cursor: "pointer",
                      }}
                    >
                      <Stack direction="row" sx={{ alignItems: "center", marginRight: "auto" }}>
                        <div style={{ marginRight: "10px" }}>
                          {getSvg("upload", "black")}
                        </div>
                        <Stack>
                          <Typography fontSize={15} align="left">
                            Загрузить Wanted list
                          </Typography>
                          <Typography className="grey-text" fontSize={14} align="left">
                            Загрузите текстовый файл весом до 5Мб
                          </Typography>
                        </Stack>
                      </Stack>
                      <VisuallyHiddenInput type="file" onChange={onFileUpload} multiple />
                    </label>
                  </Tooltip>
                </Stack>
                <Divider
                  sx={{
                    width: "120%",
                    borderColor: "white",
                    position: "relative",
                    left: "-20px",
                  }}
                />
                <Typography align="left" fontSize={18} sx={{ marginTop: "10px" }}>
                  <strong>Каталог деталей</strong>
                </Typography>
                {categoriesLoading ? (
                  <>
                    <Skeleton variant="rounded" />
                    <Skeleton variant="rounded" />
                    <Skeleton variant="rounded" />
                  </>
                ) : (
                  <CategoriesMenu
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                  />
                )}
              </Grid>
              <Grid item xs={9} sx={{ padding: "20px" }}>
                <Stack direction={"row"} sx={{width: "100%", alignItems: "center", justifyContent: "space-between"}}>
                  <Typography align="left" fontSize={28}>
                    <strong>
                      Каталог деталей
                      {!items["not_found_items"] ? "" : " (из загруженного Wanted List)"}
                    </strong>
                  </Typography>

                  {!items["not_found_items"] ? <></> :
                    <button
                      className="filled-normal-button"
                      style={{width: "260px"}}
                      onClick={() => setApplyAllMinQuantityCounter(applyAllMinQuantityCounter+1)}
                    >Применить количество</button>
                  }
                </Stack>

                {!items["not_found_items"] &&
                  <Stack direction={"row"} sx={{justifyContent: "space-between", margin: "15px 0"}}>
                    <Dropdown options={['Номер детали', 'Цена', 'Количество', 'Цвет']} selected={selectedSort} setSelected={setSelectedSort}/>
                    <Dropdown options={[15, 25, 35]} selected={perPage} setSelected={setPerPage} defaultSelected={'25'}/>
                  </Stack>
                }
                {loading ? (
                  <>
                    <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                    <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                    <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                  </>
                ) : (
                  <CatalogTable
                    items={items["items"] || []}
                    notFoundItems={items["not_found_items"]}
                    applyAllClickCounter={applyAllMinQuantityCounter}
                  />
                )}
              </Grid>
            </>
          )}

          {/* Мобильная версия */}
          {isMobile && (
            <Grid item xs={12}>
              {showMenu ? (
                <Paper
                  sx={{
                    backgroundColor: "#ECECEC",
                    borderRadius: 0,
                    minHeight: "calc(100vh - 120px)",
                    padding: "20px",
                  }}
                >
                  <Tooltip title="Загрузите Wanted list с BL — система автоматически найдёт все доступные детали из вашего списка">
                    <label
                      className="accent-button-style"
                      style={{
                        height: "auto",
                        margin: "10px 0 20px 0",
                        cursor: "pointer",
                      }}
                    >
                      <Stack direction="row" sx={{ alignItems: "center", marginRight: "auto" }}>
                        <div style={{ marginRight: "10px" }}>{getSvg("upload", "black")}</div>
                        <Stack>
                          <Typography fontSize={15} align="left">
                            Загрузить Wanted list
                          </Typography>
                          <Typography className="grey-text" fontSize={14} align="left">
                            Загрузите текстовый файл весом до 5Мб
                          </Typography>
                        </Stack>
                      </Stack>
                      <VisuallyHiddenInput type="file" onChange={onFileUpload} multiple />
                    </label>
                  </Tooltip>

                  <Divider sx={{ borderColor: "white", my: 2 }} />

                  {categoriesLoading ? (
                    <>
                      <Skeleton variant="rounded" />
                      <Skeleton variant="rounded" />
                      <Skeleton variant="rounded" />
                    </>
                  ) : (
                    <CategoriesMenu
                      categories={categories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  )}
                </Paper>
              ) : drawerOpen ? <></> : (
                <Stack sx={{ padding: "20px", backgroundColor: "#ECECEC", minHeight: "calc(100vh - 120px)" }}>
                  <Stack direction={"row"} sx={{width: "100%", alignItems: "space-between"}}>
                    <Typography align="left" fontSize={22} sx={{ mb: 2 }}>
                      <strong>
                        {selectedCategory || "Каталог деталей"}
                        {!items["not_found_items"] ? "" : " (из загруженного Wanted List)"}
                      </strong>
                    </Typography>
                    {!items["not_found_items"] ? <></> :
                      <Stack style={{margin: "0 0 16px"}}>
                        <button
                          className="filled-normal-button"
                          onClick={() => setApplyAllMinQuantityCounter(applyAllMinQuantityCounter+1)}
                        >Применить количество</button>
                        <Typography fontSize={12} style={{color: "#FF1B15"}}>
                          Пожалуйста, внимательно проверяйте количество каждого товара
                        </Typography>
                      </Stack>
                    }
                  </Stack>

                  {!items["not_found_items"] &&
                    <Grid container spacing={2} direction={"row"} sx={{justifyContent: "space-between", width: "100%", margin: "0 0 15px 0", paddingBottom: "15px", borderBottom: "1px solid #D7D7D7"}}>
                      <Grid xs={6} sx={{paddingLeft: 0, paddingBottom: 0}}>
                        <Dropdown options={['Номер детали', 'Цена', 'Количество', 'Цвет']} selected={selectedSort} setSelected={setSelectedSort}/>
                      </Grid>
                      <Grid xs={6} sx={{paddingRight: 0, paddingBottom: 0}}>
                        <Dropdown options={[15, 25, 35]} selected={perPage} setSelected={setPerPage} defaultSelected={'25'}/>
                      </Grid>
                    </Grid>
                  }

                  {loading ? (
                    <>
                      <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                      <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                      <Skeleton variant="rounded" height={90} sx={{ mt: 2 }} />
                    </>
                  ) : (
                    <CatalogTable
                      items={items["items"] || []}
                      notFoundItems={items["not_found_items"]}
                      applyAllClickCounter={applyAllMinQuantityCounter}
                    />
                  )}
                </Stack>
              )}
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
