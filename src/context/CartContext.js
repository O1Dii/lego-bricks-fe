import React, {useEffect, useState} from "react";

export const CartContext = React.createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  isItemInCart: () => {},
  changeQuantityOfItemInCart: () => {},
  getCartSum: () => {},
  reloader: 0
});

export default function CartContextProvider(props) {
  const [items, setItems] = useState([]);
  const [reloader, setReloader] = useState(0);

  console.log(items);

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem('cart');
    setItems(JSON.parse(cartFromLocalStorage) || []);
  }, [])

  const isItemInCart = (id) => {
    console.log('here');
    return items.some(i => i.id === id);
  }

  const addItem = (item) => {
    setItems((prevItems) => {
      const exists = prevItems.some((i) => i.id === item.id);
      if (!exists) {
        const newItems = [...prevItems, item];
        localStorage.setItem('cart', JSON.stringify(newItems))
        return newItems;
      }
      return prevItems;
    });
    setReloader(reloader + 1);
  };

  const changeQuantityOfItemInCart = (id, newQuantity) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantityInCart: newQuantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return newItems;
    });
    setReloader(reloader + 1);
  };

  const removeItem = (id) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id)
      localStorage.setItem('cart', JSON.stringify(newItems))
      return newItems;
    });
    setReloader(reloader + 1);
  };

  const clearCart = () => {
    setItems([]);
    setReloader(reloader + 1);
  }

  const getCartSum = () => {
    const totalPrice = items.reduce((acc, item) => {
      return acc + item.price * item.quantityInCart
    }, 0)
    return Math.round((totalPrice + Number.EPSILON) * 100) / 100
  }

  const context = {
    items,
    addItem,
    removeItem,
    clearCart,
    isItemInCart,
    changeQuantityOfItemInCart,
    getCartSum,
    reloader
  }

  return (
    <CartContext.Provider value={{...context}}>
      {props.children}
    </CartContext.Provider>
  )
}