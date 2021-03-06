import React, { useState, useEffect, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { connect } from "react-redux";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";

import formOperations from "../../redux/opertions/formOperations.js";
import formSelectors from "../../redux/selectors/selectors";

import "react-datepicker/dist/react-datepicker.css";
import formStyle from "./TransactionForm.module.css";
import "./transactionFormSelect.css";
import "./transactionFormDatepicker.css";

const initialState = {
  date: Number(moment(new Date()).format("D")),
  month: moment(new Date()).format("MMMM"),
  year: Number(moment(new Date()).format("YYYY")),
  type: "income",
  category: "",
  description: "",
  amount: "",
  balanceAfter: 0,
};

const TransactionForm = ({
  addTransaction,
  editTransaction,
  modalHandler,
  categoriesList,
  currentTransaction,
  currentBalance,
  token,
}) => {
  const [transactionItem, setTransactionItem] = useState(initialState);
  const [startDate, setStartDate] = useState(new Date());
  const [optionsList, setOptionsList] = useState([]);
  const [checkedBox, setCheckedBox] = useState(false);
  const [errors, setErrors] = useState({});

  const getCategoriesNames = (list) => {
    const namesList = list.map((item) => ({
      value: item.name,
      label: item.name.charAt(0).toUpperCase() + item.name.slice(1),
    }));
    return namesList;
  };

  const handleKeyDown = useCallback((event) => {
    if (event.code === "Escape") {
      closeForm();
    }
  }, []);

  const addListener = useCallback(() => {
    window.addEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const removeListener = useCallback(() => {
    window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const closeForm = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }
      removeListener();
      modalHandler();
    },
    [modalHandler, removeListener]
  );

  useEffect(() => {
    if (currentTransaction && currentTransaction.type === "expense") {
      setCheckedBox((state) => !state);
    }
    if (currentTransaction) {
      setTransactionItem((state) => ({
        ...state,
        ...currentTransaction,
        category: "",
      }));
    }
    addListener();
    setOptionsList(getCategoriesNames(categoriesList));
    return removeListener;
  }, [removeListener, addListener, currentTransaction, categoriesList]);

  const handleInputAmount = ({ target }) => {
    const { name, value } = target;
    if (Number(value) || value.length === 0) {
      setTransactionItem((state) => ({
        ...state,
        [name]: value,
      }));
    }
  };

  const handleInput = ({ target }) => {
    const { name, value } = target;
    setTransactionItem((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleSelect = (option) => {
    setTransactionItem((state) => ({
      ...state,
      category: option,
    }));
  };

  const handleCheckboxChange = () => {
    setCheckedBox((state) => !state);
    const typeValue = !checkedBox ? "expense" : "income";
    setTransactionItem((state) => ({ ...state, type: typeValue }));
  };

  const validate = (amount, category, type, description) => {
    const errors = {};
    if (amount.length === 0) {
      errors.amount = "Введите число!";
    }
    if (type === "expense" && category === "") {
      errors.category = "Категория не выбрана!";
    }
    if (description.length > 24) {
      errors.description = "Делай описание лаконичнее, пиши короче!!!";
    }
    setErrors(errors);
    return !!Object.keys(errors).length;
  };

  const handleDate = (date) => {
    setStartDate(date);
    const formatedDate = moment(date).format("DD/MMMM/yyyy");
    const dateD = moment(formatedDate).date();
    const month = moment(formatedDate).format("MMMM");
    const year = moment(formatedDate).year();
    setTransactionItem((state) => ({
      ...state,
      date: dateD,
      month: month,
      year: year,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { type, amount, category, description } = transactionItem;

    const validateResult = validate(amount, category, type, description);

    if (!validateResult) {
      if (event.target[1].checked) {
        transactionItem.category = transactionItem.category.value;
      }

      if (!currentTransaction) {
        event.target[1].checked
          ? (transactionItem.balanceAfter =
              Number(currentBalance) - Number(amount))
          : (transactionItem.balanceAfter =
              Number(currentBalance) + Number(amount));
      }
      transactionItem.amount = Number(transactionItem.amount);
      currentTransaction
        ? editTransaction(transactionItem, currentTransaction.id, token)
        : addTransaction(transactionItem, token);
      setTransactionItem(initialState);
      closeForm();
    }
    return validateResult;
  };

  return (
    <>      
        <form
          className={formStyle.form}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <h2 className={formStyle.form__title}>Добавить транзакцию</h2>
          <button className={formStyle.form__closeBtn} onClick={closeForm} />
          <div className={formStyle.form__checkbox_wrapper}>
            <label className={formStyle.form__checkbox_label}>
              <input
                id="check"
                type="checkbox"
                className={formStyle.form__checkbox_input}
                onChange={handleCheckboxChange}
                checked={checkedBox}
              />
              <span className={formStyle.form__checkbox_span}></span>
              <label
                className={formStyle.form__checkbox_income}
                htmlFor="check"
              >
                Доход
              </label>
              <label
                className={formStyle.form__checkbox_consumption}
                htmlFor="check"
              >
                Расход
              </label>
            </label>
          </div>
          {transactionItem.type === "income" ? null : (
            <div className={formStyle.form__errorsWrapper}>
              <Select
                className="select"
                classNamePrefix="selectprefix"
                options={optionsList}
                noOptionsMessage={() => "Категория не найдена"}
                placeholder="Выберите категорию"
                isSearchable={true}
                name="category"
                value={transactionItem.category}
                onChange={handleSelect}
              />
              {errors.category && (
                <span className={formStyle.form__categoryError}>
                  {errors.category}
                </span>
              )}
            </div>
          )}
          <div className={formStyle.form__acBox}>
            <div className={formStyle.form__errorsWrapper}>
              <input
                type="text"
                className={formStyle.form__amount}
                placeholder="0.00"
                name="amount"
                value={transactionItem.amount}
                onChange={handleInputAmount}
              />
              {errors.amount && (
                <span className={formStyle.form__amountError}>
                  {errors.amount}
                </span>
              )}
            </div>
            <DatePicker
              id="select"
              className={formStyle.form__calendar}
              selected={startDate}
              onChange={handleDate}
              dateFormat="dd.MM.yyyy"
            />
          </div>
          <div className={formStyle.form__errorsWrapper}>
            <input
              type="text"
              className={formStyle.form__description}
              placeholder="Комментарий"
              name="description"
              value={transactionItem.description}
              onChange={handleInput}
              maxLength="24"
            />
            {errors.description && (
              <span className={formStyle.form__descriptionError}>
                {errors.description}
              </span>
            )}
          </div>
          <button className={formStyle.form__add_btn}>
            {currentTransaction ? "Изменить" : "Добавить"}
          </button>
          <button className={formStyle.form__cancel_btn} onClick={closeForm}>
            Отмена"
          </button>
        </form>
        <div className={formStyle.overlay} onClick={closeForm}></div>      
    </>
  );
};

const mapStateToProps = (state) => ({
  token: formSelectors.tokenSelector(state),
  currentBalance: formSelectors.currentBalanceSelector(state),
  categoriesList: formSelectors.categoriesSelector(state),
});

const mapDispatchToProps = {
  addTransaction: formOperations.addTransactionOperation,
  editTransaction: formOperations.editTransactionOperation,
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionForm);
