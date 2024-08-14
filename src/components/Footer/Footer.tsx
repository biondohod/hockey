import "./Footer.scss";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
//comment
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column footer__column--first">
          <div className="footer_wrapper">
            <h2 className="footer__title">AutoMonitoring</h2>
            <p className="footer__description">{t("footer.description")}</p>
            <ul className="footer__socials">
              <li className="footer-socials__item">
                <a
                  href="https://vk.com"
                  className="footer-socials__link footer-socials__link--vk"
                ></a>
              </li>
              <li className="footer-socials__item">
                <a
                  href="https://youtube.com"
                  className="footer-socials__link footer-socials__link--youtube"
                ></a>
              </li>
              <li className="footer-socials__item">
                <a
                  href="https://telegram.org"
                  className="footer-socials__link footer-socials__link--telegram"
                ></a>
              </li>
            </ul>
          </div>
          <div className="footer__wrapper">
            <h3 className="footer__title">{t("footer.contacts")}</h3>
            <a href="mailto:mailes@mail.ru" className="footer__email">
              mailes@mail.ru
            </a>
            <a href="tel:+79999999999" className="footer__tel">
              +7 (999) 999-99-99
            </a>
          </div>
        </div>
        <div className="footer__column footer__column--second">
          <h3 className="footer__subtitle">{t("footer.competitions")}</h3>
          <ul className="footer__links">
            <li>
              <a href="" className="footer__link">
                4x4
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                6x6
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                {t("footer.tournaments.paid")}
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                {t("footer.tournaments.archive")}
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                {t("footer.tournaments.creation")}
              </a>
            </li>
          </ul>
        </div>
        <div className="footer__column footer__column--third">
          <h3 className="footer__subtitle">{t("footer.ratings")}</h3>
          <ul className="footer__links">
            <li>
              <a href="" className="footer__link">
                {t("footer.rating.players")}
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                {t("footer.rating.coaches")}
              </a>
            </li>
            <li>
              <a href="" className="footer__link">
                {t("footer.rating.methods")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
