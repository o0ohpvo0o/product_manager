import './Footer.css'
import Copy_Right from "../../images/open-book-48.png";
const Footer = () => {
  return (
    <footer className="footer">
      <nav>
        <div className="copy-right">
          <p>
            <a href="http://newbiea-z.blogspot.com/" rel="noreferrer" target="_blank">Copyright © by J-Tran</a>
            <img src={Copy_Right} alt="" />
          </p>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
