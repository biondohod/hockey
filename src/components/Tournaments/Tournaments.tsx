import './Tournaments.scss'

const Tournaments = () => {
    return (
        <section className="tournaments">
            <h2 className="tournaments__title">Платные турниры</h2>
            <div className="tournaments__content">
                <ul className="tournaments__list">
                    <li className="tournaments__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="tournaments__img"/>
                        <h3 className="tournaments__name">Турнир</h3>
                        <span className="tournaments__date">23.04.2023</span>
                    </li>
                    <li className="tournaments__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="tournaments__img"/>
                        <h3 className="tournaments__name">Турнир</h3>
                        <span className="tournaments__date">23.04.2023</span>
                    </li>
                    <li className="tournaments__item">
                        <img src="/assets/img/gray.png" alt="Превью турнира." className="tournaments__img"/>
                        <h3 className="tournaments__name">Турнир</h3>
                        <span className="tournaments__date">23.04.2023</span>
                    </li>
                </ul>
                <button className="tournaments__load-more">Загрузить еще</button>
            </div>
        </section>
    )
}

export default Tournaments