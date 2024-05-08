import "./Header.scss";
const Header = () => {
  return (
    <>
      <header className="header">
        <div className="header__content">
          <div className="header__info">
            <h2 className="header__title">AutoMonitoring</h2>
            <span className="header__text">Мониторинг уровня игры</span>
          </div>

          <nav className="header__navigation">
            <div className="header__tournaments">
              <h2 className="header__link header__link--popup">Турниры</h2>
              <ul className="header__popup">
                <li>
                  <a href="">4x4</a>
                </li>
                <li>
                  <a href="">6x6</a>
                </li>
                <li>
                  <a href="">Платные</a>
                </li>
                <li>
                  <a href="">Архив</a>
                </li>
                <li>
                  <a href="">Создание</a>
                </li>
                <li>
                  <a href="">Мои турниры</a>
                </li>
              </ul>
            </div>

            <div className="header__ratings">
              <h2 className="header__link header__link--popup">Рейтинги</h2>
              <ul className="header__popup">
                <li>
                  <a href="">Общий(м)</a>
                </li>
                <li>
                  <a href="">Вратари(м)</a>
                </li>
                <li>
                  <a href="">Защитники(м)</a>
                </li>
                <li>
                  <a href="">Нападающие(м)</a>
                </li>
                <li>
                  <a href="">Центр(м)</a>
                </li>
                <li>
                  <a href="">Общий(ж)</a>
                </li>
                <li>
                  <a href="">Вратари(ж)</a>
                </li>
                <li>
                  <a href="">Защитники(ж)</a>
                </li>
                <li>
                  <a href="">Нападающие(ж)</a>
                </li>
                <li>
                  <a href="">Центр(ж)</a>
                </li>
                <li>
                  <a href="">Тренеры</a>
                </li>
                <li>
                  <a href="">Методики</a>
                </li>
                <li></li>
              </ul>
            </div>

            <a href="" className="header__link">
              Мои матчи
            </a>
            <a href="" className="header__link">
              Стоп-лист
            </a>
          </nav>

          <div className="header__users">
            <div className="header__notifications">
              <span className="header-notifications__icon"></span>
              <span className="visually-hidden">Уведомления</span>
              <ul className="header__popup">
                <li>
                  <div className="header-notifications__item header-notifications__item--payment">
                    Оплата прошла успешно
                  </div>
                </li>
                <li>
                  <div className="header-notifications__item header-notifications__item--docs">
                    Документы приняты
                  </div>
                </li>
                <li>
                  <div className="header-notifications__item header-notifications__item--tournaments">
                    Турнирное уведомление
                  </div>
                </li>
              </ul>
            </div>

            <div className="header__profile">
              <div className="header-profile__button">Профиль</div>
              <div className="header-profile__content">
                <div className="header-profile__main">
                  <img src="/assets/img/avatar.png" alt="Аватар пользователя." width={42} height={42}/>
                  <div className="header-profile__info">
                    <span className="header-profile__name">Иван иванов</span>
                    <span className="header-profile__subname">Ivan Ivanov</span>
                  </div>
                </div>

                <div className="header-profile__personal-info">
                  Личные данные
                </div>

                <div className="header-profile__signout">Выйти</div>
              </div>
            </div>

            <div className="header__language">
              <div className="header__language--active">RU</div>
              <ul className="header__popup">
                <li>
                  <a href="">EN</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
