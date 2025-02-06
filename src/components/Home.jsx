import { Alert, Badge, Button, Carousel, Col, Container, Image, ListGroup, Row } from "react-bootstrap";

// prendiamo l'array menu dal file posizionato in /src/data/

import menu from "../data/menu.json";
import { Component } from "react";

class Home extends Component {
  state = {
    selectedPasta: null
  };

  render() {
    return (
      <Container fluid>
        {/* SHORT CIRCUIT OPERATOR - se l'espressione a sinistra degli && si valuta a false, React non andrà nemmeno a leggere cosa c'è nella parte a destra di && 
        evitando quindi la renderizzazione di quell'elemento*/}
        {this.state.selectedPasta && <Alert variant="info">Pasta Selezionata!</Alert>}

        <Row className="justify-content-center">
          <Col xs={10} md={6} className="text-center">
            <Carousel>
              {/* Il nostro obbiettivo sarà generare tanti Carousel.Item quanti sono gli elementi del nostro array menu 
            
            per farlo utilizzeremo il metodo .map() che ha SEMPRE come scopo quello di trasformare gli elementi di un array e ritornarli modificati
            partiremo da un oggetto e otterremo un nuovo Carousel.Item per ognuno di essi, che userà internamente i dati di quell'oggetto
            */}

              {menu.map((plate) => {
                // la prop key è fondamentale tutte le volte che generate dinamicamente degli elementi con un map
                // dovrà esistere per tenere traccia di eventuali modifiche che react dovrà fare al dom
                return (
                  // la key va applicata sempre sul primo elemento ritornato dal map, non su elementi interni
                  <Carousel.Item key={`plate-${plate.id}`}>
                    <Image
                      src={plate.image}
                      className="w-100"
                      onClick={() => {
                        // in questo punto stiamo effettuando un'operazione al click su una delle immagini del carosello

                        // chiediamo a react di salvarci l'oggetto plate (l'oggetto di una pasta) come valore dello di una porzione di stato
                        // chiamato selectedPasta
                        this.setState({ selectedPasta: plate });
                      }}
                    />
                    <Carousel.Caption>
                      <h3>{plate.name}</h3>
                      <p>{plate.description}</p>
                      <Badge bg="dark">{plate.price}€</Badge>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              })}
            </Carousel>
          </Col>
        </Row>

        {/* TERNARY OPERATOR - serve per renderizzare un blocco o l'altro in maniera esclusiva, in base al controllo precedente al ? 
        in questo modo proteggiamo il codice da un'esecuzione che produrrebbe errori nel leggere 
        troppo presto un this.state.selectedPasta.name o this.state.selectedPasta.comments quando this.state.selectedPasta è ancora null */}
        {this.state.selectedPasta ? (
          // se il controllo risulta positivo (truthy) finiamo a renderizzare il primo blocco
          <Row className="justify-content-center mt-4">
            <h4 className="text-center">Recensioni di: {this.state.selectedPasta.name}</h4>
            <Col xs={10} md={6} className="text-center">
              <ListGroup>
                {this.state.selectedPasta.comments.map((review) => (
                  <ListGroup.Item key={`review-${review.id}`}>
                    {review.author} — {review.comment} <Badge bg="info">{review.rating}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        ) : (
          // se il controllo risulta negativo (falsy) finiamo a renderizzare il secondo
          <Row className="justify-content-center mt-4">
            <Col xs={10} md={6} className="text-center">
              <Alert variant="light">Devi selezionare una pasta per visualizzare le recensioni👆</Alert>
            </Col>
          </Row>
        )}

        {/* questo bottone ci permette di resettare lo stato alla sua condizione iniziale, di fatto riportando anche 
        l'interfaccia ad una condizione iniziale */}
        {this.state.selectedPasta && (
          <Button variant="warning" className="d-block mx-auto mt-5" onClick={() => this.setState({ selectedPasta: null })}>
            Reset
          </Button>
        )}
      </Container>
    );
  }
}

export default Home;
