import { Component } from "react";
import { Alert, Badge, Button, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";

import { Trash3 } from "react-bootstrap-icons";

class ReservationList extends Component {
  state = {
    reservations: [],
    isLoading: false,
    hasError: false,
    errorMessage: ""
  };

  //   metodi custom devono essere creati come arrow function!
  fetchReservations = async () => {
    this.setState({ isLoading: true });

    try {
      console.log("fetching data...");
      const resp = await fetch("https://striveschool-api.herokuapp.com/api/reservation/");
      if (resp.ok) {
        const reservations = await resp.json();

        // this.setState({ reservations: reservations });
        // sintassi equivalente
        console.log("data retrieved, setting state...");
        this.setState({ reservations });
      } else {
        if (resp.status === 404) {
          throw new Error("404 - risorsa inesistente");
        } else {
          throw new Error("Errore nel reperimento dei dati");
        }
      }
    } catch (error) {
      console.log(error);

      this.setState({ hasError: true, errorMessage: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  deleteReservation = async (id) => {
    const resp = await fetch("https://striveschool-api.herokuapp.com/api/reservation/" + id, { method: "DELETE" });
    try {
      if (resp.ok) {
        // qui abbiamo certezza che l'elemento si sia cancellato effettivamente
        const deletedObj = await resp.json();

        // visualizziamo un avviso nella pagina di avvenuta cancellazione
        this.setState({ hasError: true, errorMessage: deletedObj.name + " è stato eliminato con successo!" });

        // aggiorniamo la lista, rilanciando la stessa fetch di prima
        this.fetchReservations();

        // dopo 5 secondi l'avviso verrà chiuso
        setTimeout(() => {
          this.setState({ hasError: false, errorMessage: "" });
        }, 5000);
      }
    } catch (err) {
      console.log(err);
      //  utilizziamo lo stesso alert anche in caso di errore nella cancellazione
      this.setState({ hasError: true, errorMessage: err.message });
    }
  };

  //  metodi pre-configurati possono essere creati sia come metodo normale sia come arrow function
  componentDidMount() {
    console.log("componentDidMount()");
    // questo è il posto giusto dove inserire chiamate di metodi che eseguono al loro interno delle fetch
    // i cui dati mi servono a popolare la pagina dopo il suo caricamento iniziale

    // componentDidMount è il un metodo di "LifeCycle" (del ciclo di vita del componente).
    // senza il suo contributo non riusciremmo a creare un'interfaccia a partire da dei dati presenti in una API
    // questo perché al ricevimento dei dati avremo bisogno di settare uno stato, e ci serve un'area del codice
    // che non verrà rieseguita dopo questo cambiamento
    // La sua particolarità è che VIENE ESEGUITO UNA VOLTA SOLA DA REACT! Alla fine del montaggio del componente nel quale è utilizzato.

    // 1) si istanzia il componente a Classe
    // 2) si crea il suo stato iniziale (con valori default)
    // 3) viene chiamato render() per la prima volta
    // 4) se presente, viene eseguito per la prima e unica volta il metodo componentDidMount()
    // 5) se nel componentDidMount avviene un setState, dopo il reperimento dei dati...
    // 6) viene ri-eseguito il metodo render(). Questo è collegato al fatto che ogni setState alla fine produrrà
    //    una nuova chiamata a render() (per OGNI cambio di stato)
    // 7) le parti di interfaccia collegate allo stato, a questo punto, potrebbero ri-generarsi, quindi potenzialmente cambiare
    // con i nuovi dati presenti nello stato

    // di conseguenza il componentDidMount() è il posto PERFETTO per effettuare chiamate API con cui popolare l'interfaccia al
    // primo caricamento del componente

    this.fetchReservations();
    // inserire qui dentro la funzione fa sì che dopo il suo setState non ci possa mai essere un'altra riesecuzione della stessa funzione
    // perché componentDidMount parte UNA SOLA VOLTA dopo il montaggio del componente
  }

  render() {
    console.log("render()");
    // non bisogna MAI chiamare una fetch nel render
    // essendo che la naturale conseguenza di una fetch è salvare i dati nello stato
    // essendo che salvare i dati nello stato producono una nuova esecuzione del metodo render()
    // torneremmo di nuovo qui all'infinito...
    // se la funzione fetchReservations viene chiamata all'infinito, diventi povero!
    // this.fetchReservations();

    return (
      <Container fluid>
        <h2 className="text-center mt-5">Prenotazioni</h2>
        {/* <Button onClick={this.fetchReservations}>Fetch data</Button> */}
        {this.state.isLoading && (
          <Spinner animation="border" role="status" variant="primary" className="d-block mx-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        <Row className="justify-content-center">
          <Col xs={10} md={6}>
            {this.state.hasError && <Alert variant="danger">{this.state.errorMessage ? this.state.errorMessage : "Errore generico"}</Alert>}
            <ListGroup>
              {this.state.reservations.map((reserv) => (
                <ListGroup.Item key={reserv._id} className="d-flex align-items-center gap-1">
                  <span>{reserv.name}</span> per <strong>{reserv.numberOfPeople}</strong> {reserv.smoking && <span>🚬</span>}
                  <Badge bg="light" className="text-bg-light fw-lighter ms-auto">
                    {new Date(reserv.dateTime).toLocaleString("it-IT")}
                  </Badge>
                  {/* premere questo bottone di cestino avvierà l'operazione di cancellazione della risorsa con reserv._id dalle API */}
                  <Button variant="danger" size="sm" onClick={() => this.deleteReservation(reserv._id)}>
                    <Trash3 />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationList;
