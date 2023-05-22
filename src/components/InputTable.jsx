import React, { useState, useEffect, useContext, useRef } from "react";
import { CurrencyContext } from "./CurrencyContext,";
import { FcOk, FcCheckmark } from "react-icons/fc";
import { MdOutlineCancel } from "react-icons/md";
import Wallet from "../Assets/Wallet.png";
import { ThemeContext } from "./ThemeContext";
import { TiCalculator } from "react-icons/ti";

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
        <div id="logo_balans" className={theme}>
          <img src={Wallet} alt="" />
          <h3 style={{ color: theme === "light" ? "blue" : "inherit" }}>
            Balans
          </h3>
        </div>

        <p className="logo_total">
          <button className="dropdown-toggle" onClick={handleDropdownToggle}>
            {selectedCurrencyOption.symbol}
          </button>
          <h3
            style={{ color: theme === "light" ? "blue" : "inherit" }}
            className="total"
          >
            {convertedTotal}
          </h3>

          {isDropdownOpen && (
            <div
              id="dropdown-menu"
              className={`navbar-${theme}`}
              ref={dropdownRef}
            >
              {currencyOptions.map((option) => (
                <button
                  key={option.label}
                  className={`navbar-${theme}`}
                  id="dropdown-item"
                  onClick={() => handleCurrencySelect(option.label)}
                >
                  <div id="elements" className={`navbar-${theme}`}>
                    <span className="firstSymbol">{option.symbol} </span>
                    <span className="labelCurrency"> {option.label} </span>
                    <span className="check">
                      {option.label === currency && <FcCheckmark />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </p>
      </div>
      <div>
        <div id="mainContainer" >
          <div id="leftSide" className={`navbar-${theme}`}>
            <h2>Operations</h2>
            <label className="label">Amounth</label>
            <input
              type="number"
              value={numberInput}
              onChange={handleNumberInputChange}
            />
            <div>
              <label className="label">Description</label>
              <textarea
                type="text"
                value={textInput}
                onChange={handleTextInputChange}
                className="description"
              />
            </div>
            <button className="Income" onClick={handleSave}>
              <span className="icon">
                <TiCalculator /> <span className="text">Income</span>
              </span>{" "}
            </button>
            <button className="Expense" onClick={handleSubtract}>
              <span className="icon">
                <TiCalculator /> <span className="text">Expense</span>
              </span>
            </button>
            <div></div>
          </div>

          <div id="rightSide" className={`navbar-${theme}`}>
            <h2>History</h2>
            {tableData.map((data, index) => (
              <div key={index} className="decArea">
                {/* <p>{data.number}</p> */}
                <p>
                  {data.icon === "Income" && <FcOk />}
                  {data.icon === "Expense" && <MdOutlineCancel />}
                </p>
                <p className="desText">{data.text}</p>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputTable;
