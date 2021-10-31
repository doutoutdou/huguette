'use strict';

const e = React.createElement;

class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: []
        };
    }

    componentDidMount() {
        console.log("toto")
        fetch("http://localhost:5000/api/reservation")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
        return <div>Erreur : tptp</div>;
        return React.createElement("div", null, "Erreur : erreur ");
        } else if (!isLoaded) {
          return (<div>Chargement…</div>);
        } else {
          return (
            <ul>
              {items.map(item => (
                <li key={item.id}>
                  {item.id} {item.day}
                </li>
              ))}
            </ul>
          );
        }
      }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(Reservation, null), domContainer);