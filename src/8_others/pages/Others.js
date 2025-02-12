import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import NotificationCard from "../../shared/components/LayerComponents/NotificationCard";
import SummaryCard from "../../shared/components/LayerComponents/SummaryCard";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import TableFooter from "../../shared/components/UIComponents/TableFooter";
import TableSearch from "../../shared/components/UIComponents/TableSearch";
import { AuthContext } from "../../shared/contexts/auth-context";
import { TblContext } from "../../shared/contexts/table-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import OTHERS_ICON from "../../shared/images/data.png";
import OthersSummary from "../components/OthersSummary";
import OthersTableBody from "../components/OthersTableBody";
import "../../common_css/Leads.css";
import "./Others.css";

const Others = (props) => {
  const { alert, sendRequest, showLoader } = useHttpClient();
  const { setKeyword, keyword, setRefreshData, setItemsData } = useContext(TblContext);
  const { token } = useContext(AuthContext);

  const [pageInfo, setPageInfo] = useState(COMMON_VALUES.pageInfoFormat);
  const [data, setData] = useState({
    intro: COMMON_VALUES.othersIntroFormat,
    othersByDuration: COMMON_VALUES.tableSummaryFormat,
  });
  const { itemResults, currentPage } = pageInfo;

  const searchItemHandler = useCallback(
    async (keyword, currentPage = 1) => {
      if (!keyword) return;

      const url = `${process.env.REACT_APP_BACKEND_URL}/others/get-many/${keyword}/${currentPage}`;
      const data = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Not found", null, COMMON_VALUES.alertClass.danger);

      if (data) {
        setPageInfo((prev) => {
          return {
            currentPage: data.paginationData.currentPage,
            itemResults: data.paginationData.itemResults,
            totalItems: data.paginationData.totalItems,
            totalPage: data.paginationData.totalPage,
          };
        });
        setKeyword(keyword);
      }
    },
    [setKeyword, sendRequest, token]
  );

  const reloadDataHandler = useCallback(() => {
    if (!keyword) {
      window.location.reload();
    } else {
      searchItemHandler(keyword, currentPage);
    }
  }, [keyword, searchItemHandler, currentPage]);

  const refreshTableHandler = () => {
    window.location.reload();
  };

  const changePageHandler = useCallback(
    async (currentPage) => {
      if (keyword) {
        searchItemHandler(keyword, currentPage);
      } else {
        const url = `${process.env.REACT_APP_BACKEND_URL}/others/get-data-by-page-number/${currentPage}`;
        const paginationData = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading data failed", null, null);
        setPageInfo((prev) => {
          return {
            currentPage: paginationData.currentPage,
            itemResults: paginationData.itemResults,
            totalItems: paginationData.totalItems,
            totalPage: paginationData.totalPage,
          };
        });
      }
    },
    [searchItemHandler, keyword, token, sendRequest]
  );

  const deleteOtherHandler = async (id) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/others/${id}`;
    const res = await sendRequest(url, "DELETE", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, null, "Delete failed", null, COMMON_VALUES.alertClass.danger);
    if (res) {
      setRefreshData(true);
      reloadDataHandler();
    }
  };

  const downloadOthersHandler = async (fromDate, toDate, type) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/others/download-others/${fromDate}/${toDate}/${type}`;
    try {
      const fileData = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Download failed", null, COMMON_VALUES.alertClass.danger);

      let rs = "";
      fileData.forEach((element) => {
        rs += `${element.item}\r\n`;
      });

      const blob = new Blob([rs], { type: "text/plain" });
      const downloadUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `${new Date(Date.now()).toLocaleString()}.txt`;
      link.href = downloadUrl;
      link.click();
    } catch (error) {}
  };

  const fetchOthers = useCallback(async () => {
    const url = process.env.REACT_APP_BACKEND_URL + "/others/others-summary";
    try {
      const res = await sendRequest(url, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Loading results data failed", null, COMMON_VALUES.alertClass.danger);

      const paginationData = {
        currentPage: 1,
        itemResults: res.paginationData.itemResults,
        totalItems: res.paginationData.totalItems,
        totalPage: res.paginationData.totalPage,
      };
      setPageInfo(paginationData);

      if (res) {
        setItemsData(res.allData);
        setData((prev) => {
          return {
            intro: res.intro,
            othersByDuration: res.othersByDuration,
          };
        });
      }
    } catch (error) {}
  }, [token, sendRequest, setItemsData]);

  useEffect(() => {
    fetchOthers();
    setKeyword(null);
  }, [fetchOthers, setKeyword]);

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />

      <main>
        <NotificationCard className="phone" image={OTHERS_ICON} imageName="Others" content="TOOLS DATA MANAGER" />
        <SummaryCard className="phone" summaryData={data.intro} />

        <section className="summary__data leads">
          <div className="leads__collected">
            <div className="leads__header">
              <h3>RESULTS - REPORTS</h3>
              <TableSearch onSearch={searchItemHandler} onRefreshTable={refreshTableHandler} />
            </div>

            <table className="main-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="email-column">Item</th>
                  <th>Type</th>
                  <th>Added</th>
                  <th className="options-column">Action</th>
                </tr>
              </thead>
              <tbody>
                <OthersTableBody data={itemResults} pageNum={currentPage} onReloadData={reloadDataHandler} onDelete={deleteOtherHandler} />
              </tbody>
              <TableFooter onItems={changePageHandler} pageData={pageInfo} />
            </table>

            <OthersSummary durationData={data.othersByDuration} onDownload={downloadOthersHandler} />
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default Others;
