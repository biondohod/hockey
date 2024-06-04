import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language.split("-")[0];
  const otherLanguage = currentLanguage === "en" ? "ru" : "en";

  const switchLanguage = () => {
    i18n.changeLanguage(otherLanguage);
  };

  return (
    <div className="header__language">
      <div className="header__language--active">
        {currentLanguage.toUpperCase()}
      </div>
      <ul className="header__popup">
        <li>
          <span onClick={switchLanguage}>{otherLanguage.toUpperCase()}</span>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
