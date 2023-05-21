import React, { createContext, useState } from "react";

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem("currency");
    return storedCurrency ? storedCurrency : "USD"; // Set a default currency value if none is found in localStorage
  });

  const [currencyLabel, setCurrencyLabel] = useState("USD");

  const currencyOptions = [
    { label: "USD", symbol: "$", rate: 1 },
    { label: "EUR", symbol: "€", rate: 0.85 },
    { label: "MAN", symbol: "₼", rate: 1.7 },
  ];

  const getConvertedAmount = (amount) => {
    const selectedCurrency = currencyOptions.find(
      (option) => option.label === currency
    );
    return amount * selectedCurrency.rate;
  };

  const handleCurrencyChange = (event) => {
    const selectedCurrencyLabel = event.target.value;
    setCurrency(selectedCurrencyLabel);
    setCurrencyLabel(selectedCurrencyLabel);
  };

  const value = {
    currency,
    currencyLabel,
    currencyOptions,
    setCurrency,
    getConvertedAmount,
    handleCurrencyChange,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider };
