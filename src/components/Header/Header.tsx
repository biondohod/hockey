import { Link } from "react-router-dom";
import "./Header.scss";
import { useUserContext } from "../../context/AuthContext";
import { LogOutUser, transliterateText } from "../../lib/utils";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { isAuthenticated, user } = useUserContext();
  const { t } = useTranslation();
  const logOut = LogOutUser();

  return (
    <>
      <header className="header">
        <div className="header__content">
          <Link to={"/"} className="header__info">
            <h2 className="header__title">AutoMonitoring</h2>
            <span className="header__text">{t("header.text")}</span>
          </Link>

          <nav className="header__navigation">
            <div className="header__competitions">
              <h2 className="header__link header__link--popup">
                {t("header.competitions")}
              </h2>
              <ul className="header__popup">
                <li>
                  <Link to={"/AllCompetitions/4x4?limit=10&offset=0"}>4x4</Link>
                </li>
                <li>
                  <Link to={"/AllCompetitions/6x6?limit=10&offset=0"}>6x6</Link>
                </li>
                <li>
                  <Link to={"/AllCompetitions/paid?limit=10&offset=0"}>{t("header.paid")}</Link>
                </li>
                <li>
                  <Link to={"/AllCompetitions/archive?limit=10&offset=0"}>
                    {t("header.archive")}
                  </Link>
                </li>
                {(user?.role_id === 1 || user?.role_id === 2) && (
                  <li>
                    <Link to="/createCompetition">{t("header.creation")}</Link>
                  </li>
                )}
                <li>
                  <a href="">{t("header.my-competitions")}</a>
                </li>
              </ul>
            </div>

            <div className="header__ratings">
              <h2 className="header__link header__link--popup">
                {t("header.ratings")}
              </h2>
              <ul className="header__popup">
                <li>
                  <a href="">{t("header.general-m")}</a>
                </li>
                <li>
                  <a href="">{t("header.goalkeepers-m")}</a>
                </li>
                <li>
                  <a href="">{t("header.defenders-m")}</a>
                </li>
                <li>
                  <a href="">{t("header.forwards-m")}</a>
                </li>
                <li>
                  <a href="">{t("header.center-m")}</a>
                </li>
                <li>
                  <a href="">{t("header.general-f")}</a>
                </li>
                <li>
                  <a href="">{t("header.goalkeepers-f")}</a>
                </li>
                <li>
                  <a href="">{t("header.defenders-f")}</a>
                </li>
                <li>
                  <a href="">{t("header.forwards-f")}</a>
                </li>
                <li>
                  <a href="">{t("header.center-f")}</a>
                </li>
                <li>
                  <a href="">{t("header.coaches")}</a>
                </li>
                <li>
                  <a href="">{t("header.methods")}</a>
                </li>
                <li></li>
              </ul>
            </div>

            {isAuthenticated && (
              <a href="" className="header__link">
                {t("header.my-matches")}
              </a>
            )}
            <a href="" className="header__link">
              {t("header.stop-list")}
            </a>
          </nav>

          <div className="header__users">
            <div className="header__notifications">
              <span className="header-notifications__icon"></span>
              <span className="visually-hidden">
                {t("header.notifications")}
              </span>
              <ul className="header__popup">
                <li>
                  <div className="header-notifications__item header-notifications__item--payment">
                    {t("header.payment-success")}
                  </div>
                </li>
                <li>
                  <div className="header-notifications__item header-notifications__item--docs">
                    {t("header.documents-accepted")}
                  </div>
                </li>
                <li>
                  <div className="header-notifications__item header-notifications__item--tournaments">
                    {t("header.tournament-notification")}
                  </div>
                </li>
              </ul>
            </div>

            <div className="header__profile">
              {isAuthenticated ? (
                <div className="header-profile__button header-profile__button--profile">
                  {t("header.profile")}
                </div>
              ) : (
                <Link
                  to={"auth/sign-in"}
                  className="header-profile__button header-profile__button--auth"
                >
                  {t("header.sign-in")}
                </Link>
              )}

              {isAuthenticated && (
                <div className="header-profile__content">
                  <Link
                    to={`/profile/${user?.id}`}
                    className="header-profile__main"
                  >
                    <img
                      src="/assets/img/avatar.png"
                      alt={t("header.avatar-alt")}
                      width={42}
                      height={42}
                    />
                    <div className="header-profile__info">
                      <span className="header-profile__name">
                        {transliterateText(user?.first_name)}{" "}
                        {transliterateText(user?.last_name)}
                      </span>
                    </div>
                  </Link>

                  <div className="header-profile__personal-info">
                    {t("header.personal-info")}
                  </div>

                  <div className="header-profile__signout" onClick={logOut}>
                    {t("header.logout")}
                  </div>
                </div>
              )}
            </div>

            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
