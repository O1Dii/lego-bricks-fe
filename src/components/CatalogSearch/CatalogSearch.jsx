import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import {styled} from "@mui/styles";
import getSvg from "../../constants/svg";
import {InputAdornment} from "@mui/material";


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
    <Box
      component="form"
      className="input-holder"
      onSubmit={onSearchClick}
    >
      <span className="input-icon">
        {getSvg("search", "black")}
      </span>
      <input
        type="text"
        value={value}
        className="input-style"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Поиск"
      />
    </Box>
  );
}
