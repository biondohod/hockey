import './MainCompetitions.scss'

const MainCompetitions = () => {
    return (
        <section className="main-competitions">
            <h2 className="main-competitions__title">Платные турниры</h2>
            <div className="main-competitions__content">
                <ul className="main-competitions__list">
                    <li className="main-competitions__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="main-competitions__img"/>
                        <h3 className="main-competitions__name">Турнир</h3>
                        <span className="main-competitions__date">23.04.2023</span>
                    </li>
                    <li className="main-competitions__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="main-competitions__img"/>
                        <h3 className="main-competitions__name">Турнир</h3>
                        <span className="main-competitions__date">23.04.2023</span>
                    </li>
                    <li className="main-competitions__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="main-competitions__img"/>
                        <h3 className="main-competitions__name">Турнир</h3>
                        <span className="main-competitions__date">23.04.2023</span>
                    </li>
                </ul>
                <button className="main-competitions__load-more">Загрузить еще</button>
            </div>
        </section>
    )
}

export default MainCompetitions