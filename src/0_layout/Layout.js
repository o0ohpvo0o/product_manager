import { Fragment, useState } from "react";
import BackDrop from "../shared/components/LayerComponents/BackDrop";
import SideBar from "../shared/components/Navigations/SideBar";
import Footer from "../shared/components/UIComponents/Footer";
import Header from "../shared/components/UIComponents/Header";
import "./Layout.css";

const Layout = (props) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBackDrop, setShowBackDrop] = useState(false);

  const displaySideBarHandler = () => {
    setShowSidebar(true);
    setShowBackDrop(true);
  };

  const closeBackDropHandler = () => {
    setShowSidebar(false);
    if (showSidebar) setShowBackDrop(false);
  };

  const closeSideBarHandler = () => {
    setShowSidebar(false);
    setShowBackDrop(false);
  };
  return (
    <Fragment>
      {/* {showBackDrop && <BackDrop isDisplayed={showBackDrop} onClick={closeBackDropHandler} />} */}
      <BackDrop isDisplayed={showBackDrop} onClick={closeBackDropHandler} />
      <SideBar isDisplayed={showSidebar} onCloseSidebar={closeSideBarHandler} />
      <Header onClick={displaySideBarHandler} />
      {props.children}
      <Footer />
    </Fragment>
  );
};

export default Layout;
