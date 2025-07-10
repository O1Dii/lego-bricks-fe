import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import {Pagination as MuiPagination} from '@mui/material';
import {Button} from "@mui/material";
import {Link, MemoryRouter, Route, Routes, useLocation} from 'react-router-dom';
import PaginationItem from '@mui/material/PaginationItem';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {useEffect, useState} from "react";

export default function Pagination({urlBase, itemsLen, amountOfPages = 0, productsOnPage, setProductsOnPage}) {
  // pagination
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const page = parseInt(query.get('page') || '1', 10);
  const [pagesCount, setPagesCount] = useState(1);
  useEffect(() => {
      if (amountOfPages) {
          setPagesCount(amountOfPages)
      } else {
          setPagesCount(Math.ceil(itemsLen / productsOnPage));
      }
  }, [productsOnPage, itemsLen, amountOfPages])
  // end pagination

  return (itemsLen || amountOfPages ?
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <MuiPagination
        page={page}
        count={pagesCount}
        shape="rounded"
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            // TODO: move to constants
            to={`/${urlBase}/${item.page === 1 ? '' : `?page=${item.page}`}`}
            {...item}
          />
        )}
      />
      {/*<Stack direction="row" alignItems="center" spacing={2}>*/}
      {/*  <p>На странице</p>*/}
      {/*  <FormControl>*/}
      {/*    <Select*/}
      {/*      labelId="products-on-page-label"*/}
      {/*      id="products-on-page-select"*/}
      {/*      value={productsOnPage}*/}
      {/*      onChange={(e) => {*/}
      {/*        setProductsOnPage(e.target.value);*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <MenuItem value={5}>5</MenuItem>*/}
      {/*      <MenuItem value={10}>10</MenuItem>*/}
      {/*      <MenuItem value={15}>15</MenuItem>*/}
      {/*    </Select>*/}
      {/*  </FormControl>*/}
      {/*</Stack>*/}
    </Stack>
      :
    <></>
  );
}
