import { createContext, useCallback, useState } from "react";

export const TblContext = createContext({
  keyword: null,
  dataRefreshed: false,
  itemsData: [],
  tableData: [],
  tableIntro: [],
  setKeyword: (keyword) => {},
  setItemsData: (data) => {},
  setRefreshData: (flag) => {},
  setIntro: (intro) => {},
  setTableData: (data) => {},
});

const TblContextProvider = (props) => {
  const [keyword, setKeyword] = useState();
  const [allItems, setAllItems] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [intro, setIntro] = useState([]);
  const [tableData, setTableData] = useState([]);

  const setKeywordHandler = useCallback((keyword) => {
    setKeyword(keyword);
  }, []);

  const setItemsDataHandler = useCallback((items) => {
    setAllItems(items);
  }, []);

  const refreshDataHandler = useCallback(() => {
    setRefreshData(true);
  }, []);

  const setIntroHandler = useCallback((intro) => {
    setIntro(intro);
  }, []);

  const setTableDataHandler = useCallback((data) => {
    setTableData(data);
  }, []);

  const initialVal = {
    keyword: keyword,
    itemsData: allItems,
    dataRefreshed: refreshData,
    tableData: tableData,
    tableIntro: intro,
    setItemsData: setItemsDataHandler,
    setKeyword: setKeywordHandler,
    setRefreshData: refreshDataHandler,
    setIntro: setIntroHandler,
    setTableData: setTableDataHandler,
  };

  return <TblContext.Provider value={initialVal}>{props.children}</TblContext.Provider>;
};

export default TblContextProvider;
