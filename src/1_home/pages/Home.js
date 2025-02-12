import { Fragment, useContext, useEffect } from "react";
import { COMMON_VALUES } from "../../shared/common/SharedValues";
import NotificationCard from "../../shared/components/LayerComponents/NotificationCard";
import SummaryCard from "../../shared/components/LayerComponents/SummaryCard";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import { AuthContext } from "../../shared/contexts/auth-context";
import { TblContext } from "../../shared/contexts/table-context";
import useHttpClient from "../../shared/hooks/http-hooks";
import HOME_ICON from "../../shared/images/house.png";
import TableBody from "../components/HomeTableBody";
import "./Home.css";

const Home = () => {
  const { setItemsData, dataRefreshed, tableData, tableIntro, setIntro, setTableData } = useContext(TblContext);
  const { alert, sendRequest, showLoader } = useHttpClient();
  const { token } = useContext(AuthContext);

  const table_header = (
    <thead>
      <tr>
        <th>Duration</th>
        <th>Amount</th>
      </tr>
    </thead>
  );

  const defaultIntro = COMMON_VALUES.homeIntroFormat;
  const defaultTableData = COMMON_VALUES.tableSummaryFormat;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url2 = process.env.REACT_APP_BACKEND_URL + "/home/summary";
        const homeData = await sendRequest(url2, "GET", { "Content-Type": "application/json", Authorization: "Bearer " + token }, null, true, "Load data failed", null, COMMON_VALUES.alertClass.danger);

        setIntro(homeData.homeIntro);
        setTableData(homeData.homeDataTables);
        setItemsData(homeData.totalItems);
      } catch (error) {}
    };

    if (tableData.length === 0 || tableIntro.length === 0 || dataRefreshed) {
      fetchData();
    }
  }, [sendRequest, token, setItemsData, dataRefreshed, setTableData, setIntro, tableData, tableIntro]);

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
      <main>
        <NotificationCard className="home" image={HOME_ICON} imageName="Home" content="Hello, Boss" subContent={<p>Welcome back</p>} />
        <SummaryCard summaryData={tableIntro.length === 0 ? defaultIntro : tableIntro} />

        <section className="summary__data home">
          <div className="data__collected fullz">
            <h3>SCAN/CRACK/EXPLOIT... RESULTS</h3>
            <table>
              {table_header}
              <tbody>
                <TableBody body={tableData.length === 0 ? defaultTableData : tableData} />
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default Home;
