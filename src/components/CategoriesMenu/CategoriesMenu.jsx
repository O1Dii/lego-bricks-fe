import React, {useEffect, useState} from "react";
import { List, ListItemButton, ListItemText, Button } from "@mui/material";

function CategoriesMenu({ categories, setSelectedCategory, selectedCategory }) {
  const [path, setPath] = useState([]); // массив с текущим путем
  const currentCategory = path.reduce(
    (acc, key) => (acc && acc[key] ? acc[key] : {}),
    categories
  );

  useEffect(() => {
    if (selectedCategory) {
      if (selectedCategory === 'Parts') {
        setPath(['Parts'])
      } else {
        setPath(selectedCategory.split(' / ').slice(0, -1))
      }
    }
  }, [selectedCategory])

  const handleClick = (key) => {
    if (Object.keys(currentCategory[key] || {}).length > 0) {
      // если есть подкатегории — переходим внутрь
      setPath([...path, key]);
    } else {
      setSelectedCategory([...path, key].join(" / "))
      console.log("Selected:", [...path, key].join(" / "));
    }
  };

  const handleBack = () => {
    setPath(path.slice(0, -1));
  };

  return (
    <div>
      {path.length > 0 && (
        <button onClick={handleBack} className="accent-button-style" style={{textAlign: "left", justifyContent: "flex-start", width: "100%"}}>
          {`<  ${path.at(-1)}`}
        </button>
      )}

      <List>
        {Object.entries(currentCategory).map(([key, value]) => (
          <ListItemButton
            key={key}
            onClick={() => handleClick(key)}
            sx={{
              backgroundColor: "white",
              color: key === selectedCategory.split(' / ').at(path.length) && key !== '' && "#DC1914",
              marginBottom: "5px",
              height: "52px"
            }}
          >
            <ListItemText primary={key} />
            {Object.keys(value).length > 0 ? '>' : ''}
          </ListItemButton>
        ))}
      </List>
    </div>
  );
}

export default CategoriesMenu;
