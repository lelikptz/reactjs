'use strict';

/**
 * Основной компонент формируем таблицу
 */
const ItemsList = React.createClass({


    /**
     * Получаем данные с сервера
     * @returns {*[]}
     */
    getDataFromServer: function () {
        return [
            {
                "id": 0,
                "name": "Побег из Шоушенка",
                "year": 1994,
                "time": 142,
                "director": "Фрэнк Дарабонт",
                "rating": 9.214
            },
            {
                "id": 1,
                "name": "Зеленая миля",
                "year": 1999,
                "time": 189,
                "director": "Фрэнк Дарабонт",
                "rating": 9.167
            },
            {
                "id": 2,
                "name": "Форрест Гамп",
                "year": 1994,
                "time": 142,
                "director": "Роберт Земекис",
                "rating": 9.019
            },
            {
                "id": 3,
                "name": "Список Шиндлера",
                "year": 1993,
                "time": 195,
                "director": "Стивен Спилберг",
                "rating": 8.911
            },
            {
                "id": 4,
                "name": "1+1",
                "year": 2011,
                "time": 112,
                "director": "Оливье Накаш",
                "rating": 8.893
            },
            {
                "id": 5,
                "name": "Король Лев",
                "year": 1994,
                "time": 89,
                "director": "Роджер Аллерс",
                "rating": 8.786
            },
            {
                "id": 6,
                "name": "Начало",
                "year": 2010,
                "time": 148,
                "director": "Кристофер Нолан",
                "rating": 8.782
            },
            {
                "id": 7,
                "name": "Леон",
                "year": 1994,
                "time": 133,
                "director": "Люк Бессон",
                "rating": 8.783
            },
            {
                "id": 8,
                "name": "Бойцовский клуб",
                "year": 1999,
                "time": 131,
                "director": "Дэвид Финчер",
                "rating": 8.721
            },
            {
                "id": 9,
                "name": "Жизнь прекрасна",
                "year": 1997,
                "time": 116,
                "director": "Роберто Бениньи",
                "rating": 8.719
            }
        ];
    },

    /**
     * Сортировка объектов по свойству sort
     */
    sorting: function (obj1, obj2) {
        if (this.state.direction === 'desc') {
            var tmp = obj2;
            obj2 = obj1;
            obj1 = tmp;
        }
        return +(obj1.sort > obj2.sort) || +(obj1.sort === obj2.sort) - 1;
    },

    /**
     * Вешаем событие пересортировки
     */
    addEvent: function (el) {
        el.addEventListener('click', this.changeSort);
    },

    /**
     * Сортируем по полю указанному в атрибуте data-sort
     */
    changeSort: function (e) {
        var dirClass,
            sort = e.target.getAttribute('data-sort');

        if (sort) {
            e.target.classList.contains('asc') ? dirClass = 'desc' : dirClass = 'asc';

            [].forEach.call(document.querySelectorAll('th'), function (el) {
                el.classList.remove('active', 'asc', 'desc');
            });

            e.target.classList.add('active', dirClass);
            this.setState({sort: sort, direction: dirClass});
        }
    },

    /**
     * Это выполняется перед функцией render. Возвращаемый объект присваивается в this.state
     */
    getInitialState: function () {
        return {sort: 'id', direction: 'asc'};
    },

    /**
     * вызывается react'ом, когда компонент был отрисован на странице
     */
    componentDidMount: function () {

        /**
         * Перебераем все th таблицы и вешаем на них события
         */
        [].forEach.call(document.querySelectorAll('th'), this.addEvent);
    },

    /**
     * вызывается react'ом, когда компонент был перерисован
     */
    componentDidUpdate: function () {
        [].forEach.call(document.querySelectorAll('th'), this.addEvent);
    },

    /**
     * Отображение
     */
    render: function () {
        var year, time, director, data = this.getDataFromServer();
        var sort = this.state.sort;
        var type = this.props.type;

        /**
         * Формируем массив с учётом сортировки по полю field
         */
        data = data.map(function (e) {
            return {
                sort: e[sort],
                data: e
            };
        });

        /**
         * Сортируем объекты
         */
        data.sort(this.sorting);

        /**
         * Получаем список строк на основе данных
         */
        var lines = data.map(function (line) {
            return <Line key={line.data.id} data={line.data} type={type}/>
        });

        if (type === 'big') {
            year = <th data-sort="year">Премьера</th>;
            time = <th data-sort="time">Продолжительность</th>;
            director = <th className="mdl-data-table__cell--non-numeric" data-sort="director">Режиссёр</th>;
        }

        var table = <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
            <thead>
            <tr>
                <th className="mdl-data-table__cell--non-numeric" data-sort="name">Название</th>
                {year}
                {time}
                {director}
                <th data-sort="rating">Рейтинг</th>
            </tr>
            </thead>
            <tbody>{lines}</tbody>
        </table>;

        return table;
    }
});

/**
 * Компонент формирующий строку таблицы
 * this.props.data: переданные в компонент данные
 */
const Line = React.createClass({
    render: function () {
        var year, time, director;

        if (this.props.type === 'big') {
            year = <td>{this.props.data.year} год</td>;
            time = <td>{this.props.data.time} мин.</td>;
            director = <td className="mdl-data-table__cell--non-numeric">{this.props.data.director}</td>;
        }

        return <tr>
            <td className="mdl-data-table__cell--non-numeric">{this.props.data.name}</td>
            {year}
            {time}
            {director}
            <td>{this.props.data.rating}</td>
        </tr>;
    }
});

/**
 * Рендер таблицы на страницу
 */
React.render(
    <ItemsList type='min'/>,
    document.querySelector('.page-content')
);


/**
 *
 */
const Menu = React.createClass({
    render: function () {
        var data = [
            {id: 0, text: 'Полный список', type: 'big'},
            {id: 1, text: 'Короткий список', type: 'min'}
        ];

        var items = data.map(function (item) {
            return <MenuLink key={item.id} text={item.text} type={item.type}/>
        });

        return <nav className="mdl-navigation">
            {items}
        </nav>
    }
});

const MenuLink = React.createClass({

    tableRender: function (e) {
        var type = e.target.getAttribute('data-type');
        document.querySelector('.mdl-layout__obfuscator').click();
        React.render(
            <ItemsList type={type}/>,
            document.querySelector('.page-content')
        );
        e.preventDefault();
    },
    componentDidMount: function () {
        this.getDOMNode().addEventListener('click', this.tableRender);
    },
    render: function () {
        return <a className="mdl-navigation__link" data-type={this.props.type} href="#">{this.props.text}</a>;
    }
});

React.render(
    <Menu />,
    document.querySelector('.mdl-layout__drawer')
);
