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
  const {items, categories, loadItems, loadCategories, loading, categoriesLoading, uploadWantedList} = useContext(ItemsContext);
  const [searchValue, setSearchValue] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(['Parts']);
  const [selectedCategory, setSelectedCategory] = useState('Parts');

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const isMobile = useMediaQuery('(max-width:700px)');

  const toggleCategory = (currentCategory) => {
    setCategoryOpen((prevOpen) => {
      if (prevOpen.includes(currentCategory)) {
        return prevOpen.filter((cat) => cat !== currentCategory);
      } else {
        return [...prevOpen, currentCategory];
      }
    });
  };

  const onSearchClick = (e) => {
    e.preventDefault();
    console.log('search click')
    loadItems(searchValue, 1, selectedCategory);
    loadCategories();
    setShowMenu(false);
  }

  const onFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadWantedList(file);
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
    loadItems('', 1, selectedCategory);
    setShowMenu(false);
    setSearchValue('');
    loadCategories();
  }, [selectedCategory])

  useEffect(() => {
    console.log('use effect')
    loadItems(searchValue, page, selectedCategory);
    loadCategories();
  }, [page])

  return (
    <>
      <Navigation onMobileCatalogClick={() => setShowMenu(!showMenu)} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
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
              <Grid item xs={3}>
                <Paper
                  sx={{
                    backgroundColor: "#ECECEC",
                    width: "100%",
                    borderRadius: 0,
                    height: "100%",
                    minHeight: "calc(100vh - 120px)",
                    padding: "20px",
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
                </Paper>
              </Grid>
              <Grid item xs={9} sx={{ padding: "20px" }}>
                <Typography align="left" fontSize={28}>
                  <strong>
                    Каталог деталей
                    {!items["not_found_items"] ? "" : " (из загруженного Wanted List)"}
                  </strong>
                </Typography>
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
                  <CatalogSearch
                    value={searchValue}
                    setValue={setSearchValue}
                    onSearchClick={onSearchClick}
                  />
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
                  <Typography align="left" fontSize={22} sx={{ mb: 2 }}>
                    <strong>
                      {selectedCategory || "Каталог деталей"}
                      {!items["not_found_items"] ? "" : " (из загруженного Wanted List)"}
                    </strong>
                  </Typography>

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
