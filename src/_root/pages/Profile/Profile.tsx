import { useParams } from "react-router-dom";
import { useUserContext } from "../../../context/AuthContext";
import "./Profile.scss";
import { useEffect, useState } from "react";
import { calculateAge, formatDate } from "../../../lib/utils";

const Profile = () => {
  const [isUserProfile, setIsUserProfile] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext();

  useEffect(() => {
    if (!id) return;
    if (parseInt(id) === user?.id) {
      setIsUserProfile(true);
    } else {
      setIsUserProfile(false);
    }
  }, [id, user]);

  if (!user) return null;

  return (
    <section className="profile">
      <h1 className="profile__title">Профиль</h1>

      <div className="profile__content">
        <div className="profile__info">
          <div className="profile-info__wrapper">
            <img
              src="/assets/img/avatar.png"
              className="profile-info__img"
              alt="Аватар пользователя."
            />
            <div className="profile-info__name-container">
              <span className="profile-info__name">
                {user?.first_name} {user?.last_name}
              </span>
              <span
                className="profile-info__verification"
                style={{ color: user?.isVerificated ? "green" : "red" }}
              >
                {user?.isVerificated ? "Подтверждженный" : "Неподтвержденный"}
              </span>
              {isUserProfile ? (
                <button className="profile-info__edit">
                  Загрузить документы
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <div className="profile-info__wrapper">
            <ul className="profile-info__about-list">
              <li className="profile-info__about">
                <span className="profile-info__about-title">Дата рождения</span>
                <span className="profile-info__about-value">
                  {formatDate(user?.player.birth_date)}
                </span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">Возраст</span>
                <span className="profile-info__about-value">{calculateAge(user.player.birth_date)}</span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">Тренер</span>
                <span className="profile-info__about-value">
                  {"Иванов И.И."}
                </span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">
                  Состояние здоровья
                </span>
                <span className="profile-info__about-value">{"Здоров"}</span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">Пол</span>
                <span className="profile-info__about-value">
                  {user?.player.is_male ? "Мужской" : "Женский"}
                </span>
              </li>
              <li className="profile-info__about">
                <span className="profile-info__about-title">
                  Уровень подготовки
                </span>
                <span className="profile-info__about-value">
                  {"II спортивный разряд"}
                </span>
              </li>
            </ul>
            {isUserProfile ? (
              <button className="profile-info__about-btn">Изменить</button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="profile__tournaments">
          <h2 className="profile__subtitle">Турниры</h2>

          <ul className="profile-tournaments__list">
            <li className="profile-tournaments__item">
              <div className="profile-tournaments__wrapper">
                <span className="profile-tournaments__name">
                  Ранее вы зарегестровались на участие в турнире (Название
                  турнира)
                </span>
                <div className="profile-tournaments__verification">
                  <span className="profile-tournaments__verification-text">
                    Подтвердить участие?
                  </span>
                  <div className="profile-tournaments__btns">
                    <button className="profile-tournaments__btn profile-tournaments__btn--yes">
                      Да
                    </button>
                    <button className="profile-tournaments__btn profile-tournaments__btn--no">
                      Нет
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="profile__rating">
          <h2 className="profile__subtitle">Рейтинг</h2>
        </div>
      </div>
    </section>
  );
};

export default Profile;
