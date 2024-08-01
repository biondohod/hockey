 import { useEffect, useState } from "react";
import MainCompetitoins from "../../../components/MainCompetitions/MainCompetitions";
import { useGetCompetitions } from "../../../lib/react-query/queries";
import "./Main.scss";

const Main = () => {

    return (
        <div className="main-page">
            <section className="intro">
                <div className="intro__left-column">
                    <h1 className="intro__title">
                        Cервис мониторинга уровня игры хоккеистов
                    </h1>
                    <button className="intro__btn">Подробнее</button>
                </div>
                <div className="intro__right-column">
                    <img
                        src="/assets/img/intro.png"
                        alt="Хоккейный клуб 'Автомобилист'"
                        width={829}
                        height={553}
                    />
                </div>
            </section>
            <MainCompetitoins/>
            <section className="partners">
                <h2 className="partners__title">Наши партнеры</h2>
                <ul className="partners__list">
                    <li className="partners__item">
                        <img
                            className="partners__img"
                            src="/assets/img/partners/spartakovec.svg"
                            alt="Логотип спартаковец"
                        />
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Main;
