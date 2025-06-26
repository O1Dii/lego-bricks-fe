import React, {useContext, useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import {Button, Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import CatalogTable from "../CatalogTable/CatalogTable";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ItemsContext} from '../../context/ItemsContext';
import CatalogSearch from '../CatalogSearch/CatalogSearch';

import {ARTICLES_GET_AND_UPDATE_ARTICLE} from '../../constants/links';

import axios from 'axios';
import Navigation from "../Navigation/Navigation";
import {styled} from "@mui/styles";
import {useLocation} from "react-router-dom";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {ExpandLess, ExpandMore} from "@mui/icons-material";


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
  const {items, loadItems, loading} = useContext(ItemsContext);
  const [searchValue, setSearchValue] = useState('');
  const [categoryOpen, setCategoryOpen] = useState('');

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);

  const toggleCategory = (currentCategory) => {
    // TODO: better keys to always be unique
    const index = categoryOpen.lastIndexOf(currentCategory);
    if (index === -1) {
      setCategoryOpen(`${categoryOpen}${currentCategory};`);
    } else {
      setCategoryOpen(categoryOpen.slice(0, index) + categoryOpen.slice(index + currentCategory.length));
    }
  }

  function renderCategories(categories, depth = 0) {
    return Object.entries(categories).map(([key, value]) => {
      const hasChildren = Object.keys(value).length > 0;
      const isOpen = categoryOpen.includes(key);

      const handleClick = () => {
        toggleCategory(key)
      };

      return (
        <React.Fragment key={key}>
          <ListItemButton
            onClick={hasChildren ? handleClick : undefined}
            sx={{ pl: 2 + depth * 2 }}
          >
            <ListItemText primary={key} />
            {hasChildren &&
              (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderCategories(value, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  }

  const onSearchClick = () => {
    loadItems(searchValue, page);
  }

  useEffect(() => {
    loadItems()
  }, [])

  console.log(items);

  return (
    <>
      <Navigation>
        <Stack direction={'row'}>
          <Button
            className={"accent-button-style"}
            sx={{margin: "auto 15px auto 0"}}
            component="label"
          >
            Загрузить Wanted list
            <VisuallyHiddenInput
              type="file"
              onChange={(event) => console.log(event.target.files)}
              multiple
            />
          </Button>
          <CatalogSearch value={searchValue} setValue={setSearchValue} onSearchClick={onSearchClick}/>
        </Stack>
      </Navigation>
      <Box className={"main-page-content"}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={2}>
            <Paper sx={{
              backgroundColor: "#f2f2f2",
              width: "100%",
              borderRadius: "0",
              height: "100%",
              minHeight: "95vh"
            }}>
              {renderCategories({
                  'category 1': {},
                  'category 2': {},
                  'category 3': {
                    'subcategory 1': {},
                    'subcategory 2': {}
                  },
                  'category 4': {
                    'subcategory 1': {
                      'subsub 1': {},
                      'subsub 2': {}
                    },
                    'subcategory 2': {},
                    'subcategory 3': {}
                  }
                }
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={10} sx={{padding: "20px"}}>
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
              <CatalogTable items={items['items'] || []}/>
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
