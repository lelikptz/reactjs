'use strict';

/**
 * Основной компонент
 */
var App = React.createClass({

    getInitialState: function () {
        return {value: ''};
    },
    search: function (e) {
        this.setState({value: e.target.value});
    },
    reset: function() {
        this.setState({value: ''});
    },
    render: function () {

        var search = this.state.value;

        return <div className="mdl-layout mdl-layout--overlay-drawer-button">
            <header className="mdl-layout__header mdl-layout__header--scroll">
                <div className="mdl-layout__header-row">
                    <span className="mdl-layout-title">React js</span>

                    <div className="mdl-layout-spacer"></div>
                    Поиск по названию:&nbsp;&nbsp;
                    <div className="search">
                        <Search value={search} handle={this.search} />
                    </div>
                </div>
            </header>
            <main className="mdl-layout__content">
                <div className="page-content">
                    <ItemsList filter={search} reset={this.reset} />
                </div>
            </main>
        </div>;
    }
});


/**
 *  Формируем таблицу
 */
var ItemsList = React.createClass({

    /**
     * Количество элементов на странице
     */
    countOnPage: 5,

    /**
     * Это выполняется перед функцией render. Возвращаемый объект присваивается в this.state
     */
    getInitialState: function () {
        var state = {};
        if (typeof localStorage.itemlist == 'undefined') {
            return {sort: 'id', direction: 'asc', items: this.getDataFromServer(), activePage: 1};
        } else {
            state = JSON.parse(localStorage.itemlist);
        }
        return state;
    },

    /**
     * вызывается react'ом, когда компонент был отрисован на странице
     */
    componentDidMount: function () {

        /**
         * Перебераем все th таблицы и вешаем на них события
         */
        [].forEach.call(document.querySelectorAll('th'), this.addEvent);
        localStorage.itemlist = JSON.stringify(this.state);
    },

    /**
     * вызывается react'ом, когда компонент был перерисован
     */
    componentDidUpdate: function () {
        localStorage.itemlist = JSON.stringify(this.state);
    },

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
     * Добавляем новый элемент
     */
    addItem: function (obj) {
        var newItem = {
            id: this.state.items.length + 1,
            name: obj.name,
            year: parseInt(obj.year),
            time: obj.time,
            director: obj.director,
            rating: obj.rating
        };

        /**
         * Аддон для изменения state
         */
        var newState = React.addons.update(
            this.state, {items: {$push: [newItem]}}
        );

        this.setState(newState);
    },

    /**
     * Смена страницы
     */
    changePage: function (page) {
        var newState = React.addons.update(
            this.state, {activePage: {$set: page}}
        );
        this.setState(newState);
    },

    /**
     * Обрезаем массив с данными взависимости от количества строк на странице и активной страницы
     */
    cropDataByPage: function (data, page) {
        return data.slice(page * this.countOnPage - this.countOnPage, page * this.countOnPage);
    },

    /**
     * Очищаем localStorage и загружаем дефолтный state
     */
    resetLocal: function () {
        localStorage.removeItem('itemlist');
        localStorage.removeItem('form');
        this.props.reset();
        this.replaceState(this.getInitialState());
    },
    /**
     * Отображение
     */
    render: function () {
        var lines,
            data = this.state.items;
        var sort = this.state.sort;
        var filter = this.props.filter;
        var direction = this.state.direction;

        /**
         * Поиск по имени
         */
        if (filter.length > 0) {
            data = data.filter(function (e) {
                if (e.name.toLowerCase().indexOf(filter.toLowerCase()) + 1) {
                    return true;
                }
            });
        }

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
         * Активная страница
         */
        var count = Math.ceil(((data.length) / this.countOnPage));
        var activePage = this.state.activePage;
        if (this.state.activePage > count) {
            activePage = count;
        }

        /**
         * Фоомируем массив объектов для паджинации
         */
        var pages = [];
        if (count > 1) {
            for (var i = 1; i <= count; i++) {
                var buttonClass = 'mdl-button mdl-js-button';
                if (i === activePage) {
                    buttonClass += ' mdl-button--raised mdl-button--colored';
                }
                pages.push({'id': i, 'class': buttonClass});
            }
        }

        /**
         * Обрезаем массив
         */
        data = this.cropDataByPage(data, activePage);

        if (data.length) {
            /**
             * Получаем список строк на основе данных
             */
            lines = data.map(function (line) {
                return <Line key={line.data.id} data={line.data}/>
            });
        } else {
            /**
             * Если ничего не найдено выводим сообщение
             */
            lines = <tr>
                <td className="mdl-data-table__cell--center" colSpan="5">Ничего не найдено</td>
            </tr>;
        }

        var tdClassName, tdClassRating = '', tdClassYear = '', tdClassTime = '', tdClassDirector;
        tdClassName = tdClassDirector = 'mdl-data-table__cell--non-numeric';

        /**
         * В зависимости от сортировки добаляем столбцу класс active и направление
         */
        switch (sort) {
            case 'name':
                tdClassName += ' active ' + direction;
                break;
            case 'year':
                tdClassYear += ' active ' + direction;
                break;
            case 'time':
                tdClassTime += ' active ' + direction;
                break;
            case 'director':
                tdClassDirector += ' active ' + direction;
                break;
            case 'rating':
                tdClassRating += ' active ' + direction;
                break;
        }

        return <div className="wrap">
            <Form addItem={this.addItem}/>

            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                <tr>
                    <th data-sort="name" className={tdClassName}>Название</th>
                    <th data-sort="year" className={tdClassYear}>Премьера</th>
                    <th data-sort="time" className={tdClassTime}>Продолжительность</th>
                    <th data-sort="director" className={tdClassDirector}>Режиссёр</th>
                    <th data-sort="rating" className={tdClassRating}>Рейтинг</th>
                </tr>
                </thead>
                <tbody>{lines}</tbody>
            </table>
            <Pagination count={pages} changePage={this.changePage}/>

            <div className="bottom-button">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect align-center" onClick={this.resetLocal}>
                    Сбросить
                </button>
            </div>
        </div>;
    }
});

/**
 * Компонент формирующий строку таблицы
 * this.props.data: переданные в компонент данные
 */
var Line = React.createClass({
    render: function () {
        return <tr>
            <td className="mdl-data-table__cell--non-numeric">{this.props.data.name}</td>
            <td>{this.props.data.year} год</td>
            <td>{this.props.data.time} мин.</td>
            <td className="mdl-data-table__cell--non-numeric">{this.props.data.director}</td>
            <td>{this.props.data.rating}</td>
        </tr>;
    }
});

/**
 * Форма
 */
var Form = React.createClass({

    getInputsData: function () {
        return [
            {
                id: 0,
                name: 'name',
                pattern: '*+',
                value: this.state.name,
                handle: this.changeInput,
                label: 'Название',
                error: ''
            },
            {
                id: 1,
                name: 'year',
                pattern: '-?[0-9]*(\\.[0-9]+)?',
                value: this.state.year,
                handle: this.changeInput,
                label: 'Год премьеры',
                error: 'Только число!'
            },
            {
                id: 2,
                name: 'time',
                pattern: '-?[0-9]*(\\.[0-9]+)?',
                value: this.state.time,
                handle: this.changeInput,
                label: 'Продолжительность',
                error: 'Только число!'
            },
            {
                id: 3,
                name: 'director',
                pattern: '*+',
                value: this.state.director,
                handle: this.changeInput,
                label: 'Режисёр',
                error: ''
            },
            {
                id: 4,
                name: 'rating',
                pattern: '*+',
                value: this.state.rating,
                handle: this.changeInput,
                label: 'Рейтинг',
                error: ''
            }
        ];
    },

    /**
     * Значения по умолчанию
     * @returns {{name: string, year: string, time: string, director: string, rating: string}}
     */
    getInitialState: function () {

        var state = {name: '', year: '', time: '', director: '', rating: ''};

        if (typeof localStorage.form !== 'undefined') {
            state = JSON.parse(localStorage.form);
        }
        return state;
    },
    componentDidMount: function () {
        localStorage.form = JSON.stringify(this.state);
    },
    componentDidUpdate: function () {
        localStorage.form = JSON.stringify(this.state);
    },
    /**
     * При изменения значения input меняем state
     */
    changeInput: function (e) {
        document.querySelector('.mdl-textfield.' + e.target.name).classList.remove('react-invalid');
        var stateObj = React.addons.update(this.state, {
            [e.target.name]: {$set: e.target.value}
        });
        this.setState(stateObj);
    },
    /**
     * Сабмит формы
     */
    formSubmit: function (e) {
        var error = false;
        for (var prop in this.state) {

            /**
             * Если input пустой, то добавляем класс react-invalid и не даём отправить форму
             */
            if (this.state.hasOwnProperty(prop)) {
                if (this.state[prop].trim() === '') {
                    document.querySelector('.mdl-textfield.' + prop).classList.add('react-invalid');
                    error = true;
                }
            }
        }

        if (!error) {

            /**
             * Отправляем данные формы в <Form addItem={this.addItem}/>
             */
            this.props.addItem(this.state);

            /**
             * У полей формы удаляем класс is-dirty
             */
            [].forEach.call(document.querySelectorAll('.mdl-textfield'), function (i) {
                i.classList.remove('is-dirty');
            });

            /**
             * В input устанавливаем значения по умолчанию
             */
            localStorage.removeItem('form');
            this.replaceState(this.getInitialState());
        }
        e.preventDefault();

    },

    render: function () {
        var inputData = this.getInputsData();
        var inputs = inputData.map(function (item) {
            return <FormInput key={item.id} data={item}/>
        });

        return <form action="" method="post" onSubmit={this.formSubmit} className="add">
            {inputs}
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect" type="submit">
                    Добавить фильм
                </button>
            </div>
        </form>;
    }
});

/**
 * Рендер input'а формы
 */
var FormInput = React.createClass({
    render: function () {
        var strClass = "mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + this.props.data.name;
        return <div className={strClass}>
            <input className="mdl-textfield__input"
                   type="text"
                   id={this.props.data.name}
                   pattern={this.props.data.pattern}
                   name={this.props.data.name}
                   value={this.props.data.value}
                   onChange={this.props.data.handle}
                />
            <label className="mdl-textfield__label">{this.props.data.label}...</label>
            <span className="mdl-textfield__error">{this.props.data.error}</span>
        </div>;
    }
});

/**
 * Поиск
 */
var Search = React.createClass({
    render: function () {
        return <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
            <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
                <i className="material-icons">search</i>
            </label>

            <div className="mdl-textfield__expandable-holder">
                <input
                    className="mdl-textfield__input search-input"
                    type="text"
                    id="search"
                    value={this.props.value}
                    onChange={this.props.handle}
                    />
            </div>
        </div>
    }
});

/**
 * Пагинация
 */
var Pagination = React.createClass({
    getInitialState: function () {
        return null;
    },
    click: function (e) {
        e.preventDefault();
        this.props.changePage(parseInt(e.target.firstChild.nodeValue));
    },
    addEvent: function (el) {
        el.addEventListener('click', this.click);
    },
    /**
     * Навешиваем клик при первоначальной отрисовки и при добавлении нового элемента
     */
    componentDidMount: function () {
        [].forEach.call(this.getDOMNode().querySelectorAll('a'), this.addEvent);
    },
    componentDidUpdate: function () {
        [].forEach.call(this.getDOMNode().querySelectorAll('a'), this.addEvent);
    },
    render: function () {
        var pages = this.props.count.map(function (item) {
            return <a href="#" key={item.id} className={item.class}>{item.id}</a>;
        });
        return <div className="pagination">
            {pages}
        </div>
    }
});

React.render(
    <App />,
    document.querySelector('.body')
);