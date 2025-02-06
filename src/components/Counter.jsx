// Lo stato esiste solo nei componenti a Classe

import { Component } from "react";
import { Button } from "react-bootstrap";

class Counter extends Component {
  // ogni componente a Classe può scegliere di avere un proprio stato creato in questo modo:
  state = {
    count: 0,
    stefano: true
  };

  render() {
    console.log("RENDER");
    return (
      <div className="text-center mb-4">
        {/* abbiamo collegato l'interfaccia allo stato */}
        <Button
          onClick={() => {
            // vogliamo utilizzare il metodo asincrono this.setState() per
            // 1) operare un cambio di stato in modo asincrono
            // 2) produrre anche un aggiornamento di interfaccia in automatico (richiamando il metodo render())

            this.setState({ count: this.state.count - 1 });
          }}
        >
          -1
        </Button>
        <h2 className="d-inline-block align-middle mx-2">{this.state.count}</h2>
        <Button
          onClick={() => {
            // vogliamo utilizzare il metodo this.setState() per
            // 1) operare un cambio di stato in modo asincrono
            // 2) produrre anche un aggiornamento di interfaccia in automatico

            this.setState({ count: this.state.count + 1 });
          }}
        >
          +1
        </Button>
      </div>
    );
  }
}

export default Counter;
