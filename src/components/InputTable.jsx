import React, { useState, useEffect, useContext, useRef } from "react";
import { CurrencyContext } from "./CurrencyContext,";
import { FcOk, FcCheckmark } from "react-icons/fc";
import { MdOutlineCancel } from "react-icons/md";
import Wallet from "../Assets/Wallet.png";
import { ThemeContext } from "./ThemeContext";

function InputTable() {
  const { theme } = useContext(ThemeContext);

  const { currency, setCurrency, getConvertedAmount, currencyOptions } =
    useContext(CurrencyContext);
  const [numberInput, setNumberInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [tableData, setTableData] = useState(() => {
    const storedData = localStorage.getItem("tableData");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [total, setTotal] = useState(() => {
    const storedTotal = localStorage.getItem("total");
    return storedTotal ? parseInt(storedTotal) : 0;
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const handleNumberInputChange = (event) => {
    setNumberInput(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSave = () => {
    const newData = {
      number: parseInt(numberInput),
      text: textInput,
      icon: "Income",
    };

    const storedData = localStorage.getItem("tableData");
    let updatedData = storedData ? JSON.parse(storedData) : [];
    updatedData.push(newData);

    localStorage.setItem("tableData", JSON.stringify(updatedData));

    setTableData(updatedData);
    setNumberInput("");
    setTextInput("");
    setTotal(total + parseInt(numberInput));

    localStorage.setItem("total", total + parseInt(numberInput));
  };

  const handleSubtract = () => {
    const subtractedNumber = parseInt(numberInput);
    if (!isNaN(subtractedNumber)) {
      const newData = {
        number: -subtractedNumber,
        text: textInput,
        icon: "Expense",
      };

      const storedData = localStorage.getItem("tableData");
      let updatedData = storedData ? JSON.parse(storedData) : [];
      updatedData.push(newData);

      localStorage.setItem("tableData", JSON.stringify(updatedData));

      setTableData(updatedData);
      setTotal(total - subtractedNumber);

      localStorage.setItem("total", total - subtractedNumber);
    }
    setNumberInput("");
    setTextInput("");
  };

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const convertedTotal = getConvertedAmount(total);

  // const handleCurrencyChange = (event) => {
  //   setCurrency(event.target.value);
  // };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    //  setIsDropdownOpen(false);

    localStorage.setItem("currency", selectedCurrency);
  };

  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("dropdown-toggle") &&
        !event.target.classList.contains("dropdown-item") &&
        !event.target.classList.contains("labelCurrency")
      ) {
        setIsDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  
  

  const selectedCurrencyOption = currencyOptions.find(
    (option) => option.label === currency
  );

  return (
    <div>
      <div className={`navbar-${theme}`} id="Balans">
        <div className="logo_balans">
          <img src={Wallet} alt="" />
          <h3>Balans</h3>
        </div>

        <p className="logo_total">
          <button className="dropdown-toggle" onClick={handleDropdownToggle}>
            {selectedCurrencyOption.symbol}
          </button>
          <h3 className="total">{convertedTotal}</h3>

          {isDropdownOpen && (
            <div className="dropdown-menu" ref={dropdownRef}>
              {currencyOptions.map((option) => (
                <button
                  key={option.label}
                  className="dropdown-item"
                  onClick={() => handleCurrencySelect(option.label)}
                >
                  <div className="elements">
                    <span className="firstSymbol">{option.symbol} </span>
                    <span className="labelCurrency"> {option.label} </span>
                    <span className="check">
                      {option.label === currency && (
                          <FcCheckmark />
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </p>
      </div>
      <div>
        <label>Amounth</label>
        <input
          type="number"
          value={numberInput}
          onChange={handleNumberInputChange}
        />
      </div>
      <div>
        <label>Description</label>
        <input type="text" value={textInput} onChange={handleTextInputChange} />
      </div>
      <button onClick={handleSave}>Income</button>
      <button onClick={handleSubtract}>Expense</button>
      <div>
        {tableData.map((data, index) => (
          <div key={index}>
            <p>{data.number}</p>
            <p>{data.text}</p>
            <p>
              {data.icon === "Income" && <FcOk />}
              {data.icon === "Expense" && <MdOutlineCancel />}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InputTable;
