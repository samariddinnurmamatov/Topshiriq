import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button
} from "react-bootstrap";

const CurrencyP = () => {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    axios
      .get("https://v6.exchangerate-api.com/v6/e05c6fdc155a8f15db9c8b03/latest/USD")
      .then((response) => setRates(response.data.conversion_rates))
      .catch((error) => console.error(error));
  }, []);

  const handleConvert = () => {
    if (rates[toCurrency]) {
      setConvertedAmount((amount * rates[toCurrency]).toFixed(2));
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Row>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">Valyuta Konvertori</Card.Title>
              <Form>
                <Form.Group controlId="amount">
                  <Form.Label>Miqdor:</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
                <Row className="mt-3">
                  <Col>
                    <Form.Group controlId="fromCurrency">
                      <Form.Label>Qaysi valyutadan:</Form.Label>
                      <Form.Control
                        as="select"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        {Object.keys(rates).map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="toCurrency">
                      <Form.Label>Qaysi valyutaga:</Form.Label>
                      <Form.Control
                        as="select"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                      >
                        {Object.keys(rates).map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" className="mt-3 w-100" onClick={handleConvert}>
                  Konvertatsiya qilish
                </Button>
              </Form>
              <h4 className="mt-4 text-center">
                Konvertatsiya qilingan miqdor: {convertedAmount} {toCurrency}
              </h4>
            </Card.Body>
          </Card>
        </Row>
      </Row>
    </Container>
  );
};

export default CurrencyP;