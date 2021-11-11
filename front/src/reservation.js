'use strict';

// import { useTable } from "react-table";

const e = React.createElement;

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isReservationLoaded: false,
      isOrdersLoaded: false,
      reservations: [],
      oldReservations: [],
      orders: [],
      value: 1
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ value: event.target.value });

    // Trouver comment chainer l'appel pour retrouver une liste
    event.preventDefault();

    fetch(`http://localhost:5000/api/reservations/${encodeURIComponent(event.target.value)}/orders`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isOrdersLoaded: true,
            orders: result
          });
        },
        (error) => {
          this.setState({
            isOrdersLoaded: true,
            error
          });
        }
      )
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/reservations")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isReservationLoaded: true,
            oldReservations: result,
//            reservations: Object.entries(result).map(result => console.dir(Object.keys(result[1])))
            reservations: Object.entries(result).map(result => ({"label": result[1]["day"], "value": result[1]["id"]}))

          
           });
        },
        (error) => {
          this.setState({
            isReservationLoaded: true,
            error
          });
        }
      )
  }

  
  render() {
    const { error, isReservationLoaded, isOrdersLoaded, reservations, orders } = this.state;
    if (error) {
      return <div>Ooops pas de chance une erreur est survenue</div>;
    } else if (!isReservationLoaded) {
      return (<div>Loading...</div>);
    } else if (isReservationLoaded && !isOrdersLoaded) {
      // console.dir(Object.entries(this.state.oldReservations));

      // console.dir(Object.entries(this.state.reservations));
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Choisissez votre parfum favori :
            <select
              defaultValue={{ label: 2002, value: 2002, isDisabled: true }}
              onChange={this.handleSubmit}
              
              options={this.state.reservations.map(item => {
                <option key={item.id} value={item.id}>{item.day}</option>
              })}>
            </select>
          </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    } else if (isReservationLoaded && isOrdersLoaded) {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Choisissez votre parfum favori :
            <select onChange={this.handleSubmit}>
              {this.state.reservations.map(item => {
                return (<option key={item.id} value={item.id}>{item.day}</option>);
              })}
            </select>
          </label>
          <label>
            Choisissez votre parfum favori :
            <select onChange={this.handleSubmit}>
              {this.state.orders.map(item => {
                return (<option key={item.id} value={item.id}>{item.customer_name}</option>);
              })}
            </select>
          </label>
          <input type="submit" value="Envoyer" />
        </form>
      );
    }
  }
}

const domContainer = document.querySelector('#reservation_container');
ReactDOM.render(e(Reservation, null), domContainer);

// voir https://codesandbox.io/s/32pwzwxom?file=/index.js:1327-1387