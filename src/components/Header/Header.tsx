import {Link} from "react-router-dom";
import "./Header.scss";
import {useUserContext} from "../../context/AuthContext";
import {UseLogoutUser} from "../../lib/utils";

const Header = () => {
    const {isAuthenticated, user} = useUserContext();
    const logOut = UseLogoutUser();
    return (
        <>
            <header className="header">
                <div className="header__content">
                    <Link to={"/"} className="header__info">
                        <h2 className="header__title">AutoMonitoring</h2>
                        <span className="header__text">Мониторинг уровня игры</span>
                    </Link>

                    <nav className="header__navigation">
                        <div className="header__tournaments">
                            <h2 className="header__link header__link--popup">Турниры</h2>
                            <ul className="header__popup">
                                <li>
                                    <Link to={"/AllCompetitions/4x4"}>4x4</Link>
                                </li>
                                <li>
                                    <Link to={"/AllCompetitions/6x6"}>6x6</Link>
                                </li>
                                <li>
                                    <Link to={"/AllCompetitions/paid"}>Платные</Link>
                                </li>
                                <li>
                                    <Link to={"/AllCompetitions/archive"}>Архив</Link>
                                </li>
                                <li>
                                    <Link to="/createCompetition">Создание</Link>
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

                        {isAuthenticated && (
                            <a href="" className="header__link">
                                Мои матчи
                            </a>
                        )}
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
                            {isAuthenticated ? (
                                <div className="header-profile__button header-profile__button--profile">
                                    Профиль
                                </div>
                            ) : (
                                <Link
                                    to={"auth/sign-in"}
                                    className="header-profile__button header-profile__button--auth"
                                >
                                    Войти
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
                                            alt="Аватар пользователя."
                                            width={42}
                                            height={42}
                                        />
                                        <div className="header-profile__info">
                      <span className="header-profile__name">
                        {user?.first_name} {user?.last_name}
                      </span>
                                            {/* <span className="header-profile__subname">
                        {user?.first_name} {user?.last_name}
                      </span> */}
                                        </div>
                                    </Link>

                                    <div className="header-profile__personal-info">
                                        Личные данные
                                    </div>

                                    <div className="header-profile__signout" onClick={logOut}>
                                        Выйти
                                    </div>
                                </div>
                            )}
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
