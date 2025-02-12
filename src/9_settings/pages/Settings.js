import { Fragment } from "react";
import NotificationCard from "../../shared/components/LayerComponents/NotificationCard";
import Alert from "../../shared/components/UIComponents/Alert";
import Loader from "../../shared/components/UIComponents/Loader";
import useHttpClient from "../../shared/hooks/http-hooks";
import PHONE_ICON from "../../shared/images/settings.png";
import CheckMailBLSettings from "../components/CheckMailBLSettings";
import CheckProxySocksBLSettings from "../components/CheckProxySockBLSettings";
import EncryptLetterSettings from "../components/EncryptLetterSettings";
import GeneralSettings from "../components/GeneralSettings";
import MailFetcherSettings from "../components/MailFetcherSettings";
import PhoneVerificationSettings from "../components/PhoneVerificationSettings";
import RemoveSpamSettings from "../components/RemoveSpamSettings";
import TemplateSettings from "../components/TemplateSettings";
import "./Settings.css";
import "../../common_css/Leads.css";
import CompanyMailFilterSettings from "../components/CompanyMailFilterSettings";
const Settings = (props) => {
  const { alert, showLoader } = useHttpClient();

  return (
    <Fragment>
      {showLoader && <Loader />}
      <Alert message={alert.message} isDisplayed={alert.showAlert} className={alert.className} />
      <main>
        <NotificationCard className="phone" image={PHONE_ICON} imageName="Phone" content="SETTINGS MANAGER" />

        <section className="summary__data leads">
          <div className="leads__collected">
            <ul className="settings__items">
              <GeneralSettings />
              <TemplateSettings />
              <EncryptLetterSettings />
              <MailFetcherSettings />
              <RemoveSpamSettings />
              <CompanyMailFilterSettings />
              <CheckMailBLSettings />
              <PhoneVerificationSettings />
              <CheckProxySocksBLSettings />
            </ul>
          </div>
        </section>
      </main>
    </Fragment>
  );
};

export default Settings;
