import React, { useContext, useRef } from "react";
import { TblContext } from "../../contexts/table-context";
import "./TableSearch.css";

const TableSearch = (props) => {
  const { setKeyword, keyword } = useContext(TblContext);
  const searchRef = useRef();

  const searchButtonHandler = () => {
    searchItemsByKeyword();
  };

  const searchByEnterHandler = (e) => {
    if (e.key !== "Enter") return;
    searchItemsByKeyword();
  };

  const searchItemsByKeyword = () => {
    if (keyword === searchRef.current.value) return;

    setKeyword(searchRef.current.value);
    props.onSearch(searchRef.current.value);
  };

  return (
    <div className="search-form">
      <input type="text" name="search" ref={searchRef} placeholder="Keyword..." onKeyUp={searchByEnterHandler} />
      <button className="leads__btn search" onClick={searchButtonHandler}>
        Search
      </button>
      <button className="leads__btn reset" onClick={props.onRefreshTable}>
        Refresh
      </button>
    </div>
  );
};

export default TableSearch;
