'use strict';

const e = React.createElement;

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      value: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {    
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    this.setState({value: event.target.value});

    // ca fonctionne pas ça, le state n'est pas mis à jour quand je le veux
    alert('Votre parfum favori est : ' + this.state.value);
    alert('Votre parfum favori est : ' + event.target.value);

    event.preventDefault();
  }

  componentDidMount() {
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
    } else if (!isLoaded) {
      return (<div>Chargement…</div>);
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
        <label>
          Choisissez votre parfum favori :
          <select onChange={this.handleSubmit}>
              {this.state.items.map(item => {
                return (<option key={item.id} value={item.id}>{item.day}</option>);
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