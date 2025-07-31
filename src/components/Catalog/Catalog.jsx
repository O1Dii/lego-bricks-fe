import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {
  Alert,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Tooltip
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
  const navigate = useNavigate();
  const {items, categories, loadItems, loadCategories, loading, categoriesLoading, uploadWantedList} = useContext(ItemsContext);
  const [searchValue, setSearchValue] = useState('');
  const [categoryOpen, setCategoryOpen] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [failureSnackbarOpen, setFailureSnackbarOpen] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

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
    loadItems(searchValue, page, selectedCategory);
    loadCategories();
  }

  const onFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await uploadWantedList(file);
  };

  console.log(items);

  function renderCategories(categories, depth = 0, parentCategories) {
    return Object.entries(categories).map(([key, value]) => {
      const hasChildren = Object.keys(value).length > 0;
      const isOpen = categoryOpen.includes(key);

      return (
        <React.Fragment key={key}>
          <ListItemButton
            onClick={hasChildren ? () => toggleCategory(key) : () => setSelectedCategory(key === selectedCategory.split(' / ').at(-1) ? '' : depth ? `${parentCategories} / ${key}` : key)}
            sx={{ pl: 2 + depth * 2, backgroundColor: key === selectedCategory.split(' / ').at(-1) && key !== '' && 'darkgrey' }}
          >
            <ListItemText primary={key} />
            {hasChildren &&
              (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderCategories(value, depth + 1, depth ? `${parentCategories} / ${key}` : key)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  }

  useEffect(() => {
    console.log('use effect')
    loadItems(searchValue, page, selectedCategory);
    loadCategories();
  }, [page, selectedCategory])

  return (
    <>
      <Navigation />
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
          <Grid item xs={2}>
            <Paper sx={{
              backgroundColor: "#f2f2f2",
              width: "100%",
              borderRadius: "0",
              height: "100%",
              minHeight: "95vh",
              paddingTop: "20px"
            }}>
              <Stack>
                <div style={{margin: "auto 10px"}}>
                  <CatalogSearch value={searchValue} setValue={setSearchValue} onSearchClick={onSearchClick}/>
                </div>
                <Tooltip title="Загрузите Wanted list с BL — система автоматически найдёт все доступные детали из вашего списка">
                  <Button
                    className={"accent-button-style"}
                    sx={{margin: "10px"}}
                    component="label"
                  >
                    Загрузить Wanted list
                    <VisuallyHiddenInput
                      type="file"
                      onChange={onFileUpload}
                      multiple
                    />
                  </Button>
                </Tooltip>
              </Stack>
              <Typography variant="h6" align="left" gutterBottom sx={{padding: "20px 15px"}}>
                <strong>
                  Категории
                </strong>
              </Typography>
              {categoriesLoading ?
                <>
                  <Skeleton variant="rounded" />
                  <Skeleton variant="rounded" />
                  <Skeleton variant="rounded" />
                </>
                : renderCategories(categories)}
            </Paper>
          </Grid>
          <Grid item xs={10} sx={{padding: "20px"}}>
            <Typography variant="h4" align="left" gutterBottom>
              <strong>
                Каталог деталей
              </strong>
            </Typography>
            {loading ?
              <>
                <Skeleton variant="rounded" height={90} style={{marginTop: 20 }} />
                <Skeleton variant="rounded" height={90} style={{marginTop: 20 }} />
                <Skeleton variant="rounded" height={90} style={{marginTop: 20 }} />
              </> :
              <CatalogTable items={items['items'] || []} notFoundItems={items['not_found_items']}/>
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
