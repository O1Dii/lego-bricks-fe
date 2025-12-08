import React, {useEffect, useState} from "react";
import axios from "axios";
import {SETTINGS_GET} from "../constants/links";

export const SettingsContext = React.createContext({
  reloadSettings: () => {},
  byn: 0,
  rub: 0,
  minCartPrice: 0,
  multipl: 1
});

export default function SettingsContextProvider(props) {
  const [byn, setByn] = useState(0);
  const [rub, setRub] = useState(0);
  const [multipl, setMultipl] = useState(1);
  const [minCartPrice, setMinCartPrice] = useState(0);

  const reloadSettings = () => {
    axios
      .get(SETTINGS_GET())
      .then(response => {
        setByn(response.data.byn)
        setRub(response.data.rub)
        setMinCartPrice(response.data.min)
        setMultipl(response.data.multipl)
      })
  }

  useEffect(() => {
    reloadSettings();
  }, [])

  const context = {
    byn,
    rub,
    minCartPrice,
    multipl,
    reloadSettings
  }

  return (
    <SettingsContext.Provider value={{...context}}>
      {props.children}
    </SettingsContext.Provider>
  )
}