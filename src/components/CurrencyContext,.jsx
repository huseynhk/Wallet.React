import React, { createContext, useState } from "react";

const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const storedCurrency = localStorage.getItem("currency");
    return storedCurrency ? storedCurrency : "USD"; // Basqa bir Currency secmisikse onu qaytarsin eks halda Dollari qaytarsin
  });

  const [currencyLabel] = useState("USD");

  const currencyOptions = [
    { label: "USD", symbol: "$", rate: 1 },
    { label: "EUR", symbol: "€", rate: 0.85 },
    { label: "AZN", symbol: "₼", rate: 1.7 },
  ];
 
  const getConvertedAmount = (amount) => {
    const selectedCurrency = currencyOptions.find((option) => option.label === currency);
    const convertedAmount = amount * selectedCurrency.rate; // Daxil ona deyeri Currency-e vursun
  
    return convertedAmount.toFixed(2);
  };

  const value = {
    currency,
    currencyLabel,
    currencyOptions,
    setCurrency,
    getConvertedAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider };
