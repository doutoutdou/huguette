'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var e = React.createElement;

var Reservation = function (_React$Component) {
    _inherits(Reservation, _React$Component);

    function Reservation(props) {
        _classCallCheck(this, Reservation);

        var _this = _possibleConstructorReturn(this, (Reservation.__proto__ || Object.getPrototypeOf(Reservation)).call(this, props));

        _this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
        return _this;
    }

    _createClass(Reservation, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;

            console.log("toto");
            fetch("http://localhost:5000/api/reservation").then(function (res) {
                return res.json();
            }).then(function (result) {
                _this2.setState({
                    isLoaded: true,
                    items: result
                });
            }, function (error) {
                _this2.setState({
                    isLoaded: true,
                    error: error
                });
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _state = this.state,
                error = _state.error,
                isLoaded = _state.isLoaded,
                items = _state.items;

            if (error) {
                return React.createElement(
                    "div",
                    null,
                    "Erreur : tptp"
                );
                return React.createElement("div", null, "Erreur : erreur ");
            } else if (!isLoaded) {
                return React.createElement(
                    "div",
                    null,
                    "Chargement\u2026"
                );
            } else {
                return React.createElement(
                    "ul",
                    null,
                    items.map(function (item) {
                        return React.createElement(
                            "li",
                            { key: item.id },
                            item.id,
                            " ",
                            item.day
                        );
                    })
                );
            }
        }
    }]);

    return Reservation;
}(React.Component);

var domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(Reservation, null), domContainer);