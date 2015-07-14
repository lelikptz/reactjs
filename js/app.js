'use strict';

/**
 * Основной компонент формируем таблицу
 */
const ItemsList = React.createClass({displayName: "ItemsList",

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
        var tdClass = '', tdClassNotNum = 'mdl-data-table__cell--non-numeric', data = this.getDataFromServer();
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
            return React.createElement(Line, {key: line.data.id, data: line.data, type: type})
        });

        if (type === 'min') {
            tdClassNotNum = tdClass = 'hidden';
        }

        return React.createElement("table", {className: "mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp"}, 
            React.createElement("thead", null, 
            React.createElement("tr", null, 
                React.createElement("th", {className: "mdl-data-table__cell--non-numeric", "data-sort": "name"}, "Название"), 
                React.createElement("th", {"data-sort": "year", className: tdClass}, "Премьера"), 
                React.createElement("th", {"data-sort": "time", className: tdClass}, "Продолжительность"), 
                React.createElement("th", {"data-sort": "director", className: tdClassNotNum}, "Режиссёр"), 
                React.createElement("th", {"data-sort": "rating"}, "Рейтинг")
            )
            ), 
            React.createElement("tbody", null, lines)
        );
    }
});

/**
 * Компонент формирующий строку таблицы
 * this.props.data: переданные в компонент данные
 */
const Line = React.createClass({displayName: "Line",
    render: function () {
        var tdClass = '', tdClassNotNum = 'mdl-data-table__cell--non-numeric';

        if (this.props.type === 'min') {
            tdClassNotNum = tdClass = 'hidden';
        }

        return React.createElement("tr", null, 
            React.createElement("td", {className: "mdl-data-table__cell--non-numeric"}, this.props.data.name), 
            React.createElement("td", {className: tdClass}, this.props.data.year, " год"), 
            React.createElement("td", {className: tdClass}, this.props.data.time, " мин."), 
            React.createElement("td", {className: tdClassNotNum}, this.props.data.director), 
            React.createElement("td", null, this.props.data.rating)
        );
    }
});

/**
 * Рендер таблицы на страницу
 */
React.render(
    React.createElement(ItemsList, {type: "min"}),
    document.querySelector('.page-content')
);


/**
 * Компонент левого меню
 */
const Menu = React.createClass({displayName: "Menu",
    render: function () {
        var data = [
            {id: 0, text: 'Полный список', type: 'big'},
            {id: 1, text: 'Короткий список', type: 'min'}
        ];

        var items = data.map(function (item) {
            return React.createElement(MenuLink, {key: item.id, text: item.text, type: item.type})
        });

        return React.createElement("nav", {className: "mdl-navigation"}, 
            items
        )
    }
});

/**
 * Пункт левого меню
 */
const MenuLink = React.createClass({displayName: "MenuLink",

    tableRender: function (e) {
        var type = e.target.getAttribute('data-type');

        /**
         * Скрываем всплывающее меню
         */
        document.querySelector('.mdl-layout__obfuscator').click();

        /**
         * Ререндер таблицы
         */
        React.render(
            React.createElement(ItemsList, {type: type}),
            document.querySelector('.page-content')
        );
        e.preventDefault();
    },

    /**
     * Событие на пункт меню после рендер
     */
    componentDidMount: function () {
        this.getDOMNode().addEventListener('click', this.tableRender);
    },
    render: function () {
        return React.createElement("a", {className: "mdl-navigation__link", "data-type": this.props.type, href: "#"}, this.props.text);
    }
});

/**
 * Рендер левого меню
 */
React.render(
    React.createElement(Menu, null),
    document.querySelector('.mdl-layout__drawer')
);
