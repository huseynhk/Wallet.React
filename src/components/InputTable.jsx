import React, { useState, useEffect, useContext, useRef } from "react";
import { CurrencyContext } from "./CurrencyContext,";
import { FcCheckmark } from "react-icons/fc";
import Wallet from "../Assets/Wallet.png";
import Vector from "../Assets/Vector.png";
import { ThemeContext } from "./ThemeContext";
import Swal from 'sweetalert2';

function InputTable() {
  const { theme } = useContext(ThemeContext);
  const {currency, setCurrency, getConvertedAmount, currencyOptions} = useContext(CurrencyContext);
  const [numberInput, setNumberInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [tableData, setTableData] = useState(() => {
    const storedData = localStorage.getItem("tableData");
    return storedData ? JSON.parse(storedData) : [];
  });

  const [total, setTotal] = useState(() => {
    const storedTotal = localStorage.getItem("total");
    return storedTotal ? parseInt(storedTotal) : 0;
  });


  const handleNumberInputChange = (event) => {
   setNumberInput(event.target.value);
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };
  
  const handleSave = () => {
    if (numberInput.trim() !== "" && textInput.trim() !== "") {
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
  
      Swal.fire({
        icon: "success",
        title: "Data Added",
        text: "Your data has been successfully added.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please fill in all the required fields.",
      });
    }
  };


  const handleSubtract = () => {
    if (numberInput.trim() !== "" && textInput.trim() !== "") {
      const subtractedNumber = parseInt(numberInput);
      if (!isNaN(subtractedNumber)) {
        const newTotal = total - subtractedNumber;
        if (newTotal < 0) {
          Swal.fire({
            icon: "error",
            title: "Invalid Operation",
            text: "Cannot subtract more than the current total.",
          });
          // setNumberInput("");
          // setTextInput("");
          return;
        }
        
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
  
        Swal.fire({
          icon: "success",
          title: "Data Subtracted",
          text: "Your data has been successfully subtracted.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please fill in all the required fields.",
      });
    }
    setNumberInput("");
    setTextInput("");
  };

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }, [tableData]);

  const convertedTotal = getConvertedAmount(total);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencySelect = (selectedCurrency) => {
    setCurrency(selectedCurrency);
    //  setIsDropdownOpen(false);
    localStorage.setItem("currency", selectedCurrency);
  };

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }

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
          <h3 style={{ color: theme === "light" ? "inherit" : "#0D99FF"}}>
            Balans
          </h3>
        </div>

        <p className="logo_total">
          <button className="dropdown-toggle" onClick={handleDropdownToggle}>
            {selectedCurrencyOption.symbol}
          </button>
          <h3
            style={{ color: theme === "light" ? "inherit" : "#0D99FF" }}
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
        <div id="mainContainer">
          <div id="leftSide" className={`navbar-${theme}`}>
            <h2>Əməliyyatlar</h2>
            <label className="label">Amount</label>
            <input
              type="number"
              value={numberInput}
              onChange={handleNumberInputChange}
              ref={inputRef}
              min={0}
            />
            <div>
              <label className="label2">Description</label>
              <textarea
                type="text"
                value={textInput}
                onChange={handleTextInputChange}
                className="description"
              />
            </div>
            <button className="Income" onClick={handleSave}>
              <span className="icon">
                <img src={Vector} alt="" /> <span className="text">Income</span>
              </span>
            </button>
            <button className="Expense" onClick={handleSubtract}>
              <span className="icon">
                <img src={Vector} alt="" />{" "}
                <span className="text">Expense</span>
              </span>
            </button>
            <div></div>
          </div>

          <div id="rightSide" className={`navbar-${theme}`}>
            <h2>Tarixçə</h2>
            {tableData.map((data, index) => (
              <div key={index} className="decArea">
                <p>
                  {data.icon === "Income" && (
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="22" cy="22" r="22" fill="#DBF5E4" />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.6667 22C33.6667 28.4433 28.4434 33.6667 22 33.6667C15.5567 33.6667 10.3334 28.4433 10.3334 22C10.3334 15.5567 15.5567 10.3333 22 10.3333C28.4434 10.3333 33.6667 15.5567 33.6667 22ZM26.7021 18.4646C27.0438 18.8063 27.0438 19.3603 26.7021 19.702L20.8688 25.5354C20.5271 25.8771 19.973 25.8771 19.6313 25.5354L17.298 23.202C16.9563 22.8603 16.9563 22.3063 17.298 21.9646C17.6397 21.6229 18.1937 21.6229 18.5354 21.9646L20.25 23.6792L22.8573 21.0719L25.4647 18.4646C25.8064 18.1229 26.3604 18.1229 26.7021 18.4646Z"
                        fill="#30CE0A"
                      />
                    </svg>
                  )}

                  {data.icon === "Expense" && (
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="22" cy="22" r="22" fill="#FFDADA" />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M33.6668 22C33.6668 28.4433 28.4435 33.6667 22.0002 33.6667C15.5568 33.6667 10.3335 28.4433 10.3335 22C10.3335 15.5567 15.5568 10.3333 22.0002 10.3333C28.4435 10.3333 33.6668 15.5567 33.6668 22ZM18.4647 18.4646C18.8064 18.1229 19.3605 18.1229 19.7022 18.4646L22.0001 20.7625L24.2981 18.4646C24.6398 18.1229 25.1938 18.1229 25.5355 18.4646C25.8772 18.8063 25.8772 19.3603 25.5355 19.702L23.2376 22L25.5355 24.2979C25.8772 24.6396 25.8772 25.1936 25.5355 25.5353C25.1938 25.877 24.6397 25.877 24.298 25.5353L22.0001 23.2374L19.7022 25.5354C19.3605 25.8771 18.8065 25.8771 18.4648 25.5354C18.123 25.1936 18.123 24.6396 18.4648 24.2979L20.7627 22L18.4647 19.702C18.123 19.3603 18.123 18.8063 18.4647 18.4646Z"
                        fill="#FE1E46"
                      />
                    </svg>
                  )}
                </p>
                <p className="expenses">{data.number}</p>
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
