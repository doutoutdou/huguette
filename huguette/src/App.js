import logo from './beer.svg';
import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useTable, useSortBy } from 'react-table'
import './App.css';
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="http://www.cde-beerzone.fr/wp-content/uploads/2021/07/CARTE-BEERZONE_LERHEU.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Carte repas
        </a>
      </header>
      <div>
        <Reservation />

      </div>

    </div>
  );
}

function Table(props) {
  const data = React.useMemo(
    () => props.orders.map(item => ({ "col1": item.customer_name, "col2": item.customer_order })),
    [props.orders]
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Qui',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Quoi',
        accessor: 'col2',
      },
    ],
    []
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useSortBy
  )

  return (

    <MaUTable {...getTableProps()} style={{ border: 'solid 1px blue' }}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableHead
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
                <span>
                  +                 {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  +               </span>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </TableCell>
                )
              })}
            </TableRow>
          )
        })}
      </TableBody>
    </MaUTable>
  )
}

class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isReservationLoaded: false,
      reservations: [],
      selectedOption: null,
      isLoading: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ selectedOption: event });
  }

  handleCreate(event) {
    console.log("createInProgress")
  }

  handleSubmit(event) {

  }

  getReservations() {
    fetch("http://localhost:5000/api/reservations")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isReservationLoaded: true,
            reservations: result.map(item => ({ "label": item.day, "value": item.id }))
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

  componentDidMount() {
    this.getReservations()
  }


  render() {
    const { error, isReservationLoaded, reservations, selectedOption, isLoading } = this.state;
    if (error) {
      return <div>Ooops pas de chance une erreur est survenue</div>;
    } else if (!isReservationLoaded) {
      return (<div>Loading...</div>);
    } else if (isReservationLoaded) {
      return (
        <div className="reservation-select">
          <label htmlFor="select">Choisis ton jour </label>
          <CreatableSelect
            className="reservation-select--container"
            id="select"
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            value={selectedOption}
            onCreateOption={this.handleCreate}
            onChange={this.handleChange}
            options={reservations}
          />
          <Orders id={selectedOption} />
        </div>


      );
    }
  }
}

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {

    this.setState({ selectedOption: event });

  }

  handleSubmit(event) {
    this.setState({ value: event.target.value });
    // Trouver comment chainer l'appel pour retrouver une liste
    event.preventDefault();

  }




  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nom :
          <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
        <input type="submit" value="Envoyer" />
      </form>
    )
  }
}




class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isOrdersLoaded: false,
      orders: [],
      selectedOption: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // this.setState(console.dir(event));

    this.setState({ selectedOption: event });

  }

  handleSubmit(event) {
    this.setState({ value: event.target.value });

    // Trouver comment chainer l'appel pour retrouver une liste
    event.preventDefault();

  }

  getOrders() {
    fetch(`http://localhost:5000/api/reservations/${encodeURIComponent(this.props.id["value"])}/orders`)
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

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.getOrders()
    }
  }


  addLine() {
    console.log("toto")
  }


  render() {
    const { error, isOrdersLoaded, orders } = this.state;

    if (this.props.id === null) {
      return null
    } else {
      if (error) {
        return <div>Ooops pas de chance une erreur est survenue</div>;
      } else if (!isOrdersLoaded) {

        return (<div>Loading...</div>);
      } else if (isOrdersLoaded) {
        return (
          <React.Fragment><Table orders={orders} />
            <button onClick={this.addLine}> Activer les lasers</button></React.Fragment>
        )
      }
    }
  }
}
export default App;
