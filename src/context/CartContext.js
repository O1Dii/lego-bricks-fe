import React, {useEffect, useState} from "react";

export const CartContext = React.createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getQuantityOfItemInCart: () => {},
  changeQuantityOfItemInCart: () => {},
  getCartSum: () => {},
  getQuantitiesSum: () => {},
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

  const getQuantityOfItemInCart = (id) => {
    return items.filter(i => i.id === id)[0]['quantityInCart'] || 0;
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

  const changeQuantityOfItemInCart = (itemOrId, newQuantity) => {
    setItems((prevItems) => {
      let newItems;

      // Определяем id и объект item
      const id = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
      const item = typeof itemOrId === "object" ? itemOrId : null;

      const exists = prevItems.find((i) => i.id === id);

      if (exists) {
        if (newQuantity > 0) {
          // обновляем количество
          newItems = prevItems.map((i) =>
            i.id === id ? { ...i, quantityInCart: newQuantity } : i
          );
        } else {
          // удаляем элемент
          newItems = prevItems.filter((i) => i.id !== id);
        }
      } else {
        if (newQuantity > 0 && item) {
          // добавляем новый элемент
          newItems = [...prevItems, { ...item, quantityInCart: newQuantity }];
        } else {
          // ничего не делаем
          newItems = prevItems;
        }
      }

      localStorage.setItem("cart", JSON.stringify(newItems));
      return newItems;
    });

    setReloader((prev) => prev + 1);
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
    localStorage.setItem('cart', JSON.stringify([]))
    setReloader(reloader + 1);
  }

  const getCartSum = (multipl) => {
    const totalPrice = items.reduce((acc, item) => {
      return acc + (Math.round((item.price * multipl + Number.EPSILON) * 100) / 100) * item.quantityInCart
    }, 0)
    return Math.round((totalPrice + Number.EPSILON) * 100) / 100
  }

  const getQuantitiesSum = () => {
    const totalQuantity = items.reduce((acc, item) => {
      return acc + item.quantityInCart
    }, 0)
    return totalQuantity
  }

  const context = {
    items,
    addItem,
    removeItem,
    clearCart,
    getQuantityOfItemInCart,
    changeQuantityOfItemInCart,
    getCartSum,
    getQuantitiesSum,
    reloader
  }

  return (
    <CartContext.Provider value={{...context}}>
      {props.children}
    </CartContext.Provider>
  )
}