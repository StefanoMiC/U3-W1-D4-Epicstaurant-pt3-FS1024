import { Component } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

// proprietà che il server si aspetta di ricevere per ogni prenotazione inviata (modello):

// name <-- string
// phone <-- string
// numberOfPeople <-- string || number
// smoking <-- boolean
// dateTime <-- string || date
// specialRequests <-- string

class ReservationForm extends Component {
  state = {
    // porzione di stato che gestisce la prenotazione
    reservation: {
      name: "",
      phone: "",
      numberOfPeople: "1",
      smoking: false,
      dateTime: "",
      specialRequests: ""
    },
    // porzione di stato che gestisce l'alert
    alert: {
      isVisible: false,
      type: "",
      title: "",
      message: ""
    }
  };

  handleReset = () => {
    this.setState({
      reservation: {
        name: "",
        phone: "",
        numberOfPeople: "1",
        smoking: false,
        dateTime: "",
        specialRequests: ""
      }
    });
  };

  //  metodi custom ==> devono essere creati con una arrow function!

  // funzione associata a tutti i campi input che agisce in modo dinamico nel modificare una proprietà con un determinato valore,
  // proprietà e valore dinamico li forniamo nel momento dell'esecuzione di questa funzione (ovvero su ogni onChange di ogni input)
  handleInputChange = (propertyName, propertyValue) => {
    this.setState({ reservation: { ...this.state.reservation, [propertyName]: propertyValue } });
  };

  //  metodo chiamato se avviene l'invio del form
  handleSubmit = (e) => {
    // ⚠️Importantissimo, prevenire il refresh della pagina
    e.preventDefault();
    console.log("SUBMIT", this.state.reservation);
    // chiamata HTTP per la creazione di una nuova risorsa a partire dallo stato reservation NEL MOMENTO DELL'INVIO DEL FORM
    // (quindi già con i dati inseriti all'interno di this.state.reservation)
    fetch("https://striveschool-api.herokuapp.com/api/reservation/", {
      method: "POST",
      body: JSON.stringify(this.state.reservation),
      headers: { "Content-Type": "application/json" }
    })
      .then((resp) => {
        if (resp.ok) {
          this.handleReset(); // in questo momento il metodo handleReset partirà e ci resetterà lo stato e pulirà i campi di conseguenza

          return resp.json();
        } else {
          throw new Error("Prenotazione non inviata");
        }
      })
      .then((createdReserv) => {
        this.setState({
          // con i dati ricevuti dal server andiamo a fornire i dati necessari all'alert per visualizzarsi
          alert: {
            isVisible: true,
            type: "success",
            title: "Prenotazione inviata",
            message: `Hai creato una prenotazione per ${createdReserv.numberOfPeople} a nome di ${createdReserv.name} per il giorno: ${createdReserv.dateTime}`
          }
          // se l'invio è andato a buon fine possiamo anche resettare il form
        });
      })
      .catch((err) => {
        this.setState({
          // in caso di errore azioniamo di nuovo l'alert, ma con colore e dati differenti
          alert: {
            isVisible: true,
            type: "danger",
            title: "Prenotazione fallita",
            message: err.message
          }
        });
      })
      .finally(() => {
        // dopo 5 secondi IN OGNI CASO (positivo o negativo) l'alert verrà chiuso e resettato
        setTimeout(
          () =>
            this.setState({
              alert: {
                isVisible: false,
                type: "",
                title: "",
                message: ""
              }
            }),
          5000
        );
      });
  };

  render() {
    return (
      <Container fluid>
        <h2 className="text-center mt-5">Prenota Tavolo</h2>

        {/* controllo su stato dedicato per alert isVisible per gestire la visualizzazione dell'intero blocco contenente griglia + alert */}
        {this.state.alert.isVisible && (
          // se siamo qui lo stato isVisible è sicuramente true
          <Row className="justify-content-center">
            <Col xs={10} md={6}>
              <Alert
                variant={this.state.alert.type}
                dismissible // mi attiva la X e la possibilità di chiudere l'alert dal click della stessa
                // contestualmente al click sulla X l'Alert lancerà la funzione associata a questo evento onClose, che in definitiva resetterà lo stato che lo gestisce
                onClose={() =>
                  this.setState({
                    alert: {
                      isVisible: false,
                      type: "",
                      title: "",
                      message: ""
                    }
                  })
                }
              >
                {/* il contenuto dell'alert dipende da quello che verrà salvato nello stato al momento di creazione/errore dalla fetch */}
                <Alert.Heading>{this.state.alert.title}</Alert.Heading>
                {this.state.alert.message}
              </Alert>
            </Col>
          </Row>
        )}
        <Row className="justify-content-center mb-4">
          <Col xs={10} md={6}>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci il tuo nome"
                  required
                  //   per avere un input CONTROLLATO abbiamo bisogno che possa LEGGERE dallo stato con la prop value e SCRIVERE tramite evento onChange
                  value={this.state.reservation.name} // leggiamo dallo stato
                  //   scriviamo al momento del change dell'input (quando ci scriviamo dentro)
                  //   onChange={(e) => {
                  //     this.setState({ reservation: { ...this.state.reservation, name: e.target.value } });
                  //   }}

                  //   refactor della stessa funzionalità precedente con un metodo custom che semplifica la sintassi e il numero di linee utilizzate nel jsx
                  onChange={(e) => this.handleInputChange("name", e.target.value)}
                />
                {this.state.reservation.name.toLowerCase() === "astolfo" && <Form.Text className="text-danger">ma che brutto nome!</Form.Text>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="+39333000222"
                  required
                  value={this.state.reservation.phone}
                  onChange={(e) => this.handleInputChange("phone", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="numberOfPeople">
                <Form.Label>Coperti</Form.Label>
                <Form.Select
                  aria-label="numero di coperti"
                  value={this.state.reservation.numberOfPeople}
                  onChange={(e) => this.handleInputChange("numberOfPeople", e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="smoking">
                <Form.Check
                  type="checkbox"
                  label="Fumatori"
                  checked={this.state.reservation.smoking}
                  onChange={(e) => this.handleInputChange("smoking", e.target.checked)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="dateTime">
                <Form.Label>Data e ora</Form.Label>
                <Form.Control
                  type="datetime-local"
                  required
                  value={this.state.reservation.dateTime}
                  onChange={(e) => this.handleInputChange("dateTime", e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="specialRequests">
                <Form.Label>Richieste particolari</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Inserisci eventuali allergie, intolleranze, ecc.."
                  value={this.state.reservation.specialRequests}
                  onChange={(e) => this.handleInputChange("specialRequests", e.target.value)}
                />
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button type="button" variant="warning" onClick={this.handleReset}>
                  Resetta i campi
                </Button>

                <Button type="submit" variant="success">
                  Invia prenotazione
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ReservationForm;
