import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import {styled} from "@mui/styles";


const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

export default function CatalogSearch({value, setValue, onSearchClick}) {
  return (
    <Box component="form" sx={{alignItems: "center", width: "50%"}} onSubmit={onSearchClick} display="flex">
      <StyledTextField
        sx={{width: "100%", backgroundColor: "white"}}
        size="small"
        color="secondary"
        value={value}
        onChange={(e) => {setValue(e.target.value)}}
        label="Поиск по артикулу"
        variant="outlined"
      />
      <Button type="submit" className={"button-style"}>Поиск</Button>
    </Box>
  );
}
