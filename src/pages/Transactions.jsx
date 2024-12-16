import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";

const Transactions = () => {
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selected, setSelected] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [debt, setDebt] = useState({
    price: "",
    currency: "UZS",
    category: "1",
    description: "",
    date: "",
    time: "",
    type: "income", 
  });

  const [debts, setDebts] = useState([]);
  const [filters, setFilters] = useState({ category: "all", startDate: ""});

  const primaryCurrency = "USD";
  const categoryMapping = {
    "1": "Ichimlik",
    "2": "Transport",
    "3": "Telefon",
    "4": "Kitob",
  };

  const transactionTypes = {
    income: "Income",
    expense: "Expense",
  };

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const response = await fetch("https://v6.exchangerate-api.com/v6/e05c6fdc155a8f15db9c8b03/latest/USD");
      const data = await response.json();
      setExchangeRates(data.conversion_rates || {});
    };

    fetchExchangeRates();
    const storedDebts = JSON.parse(localStorage.getItem("debts")) || [];
    setDebts(storedDebts);
  }, []);

  const saveToLocalStorage = (debts) => {
    localStorage.setItem("debts", JSON.stringify(debts));
  };

  const handleClose = () => {
    setShow(false);
    setSelected(null);
  };

  const handleShow = () => {
    setShow(true);
    setValidated(false);
    setDebt({
      price: "",
      currency: "USD",
      category: "1",
      description: "",
      date: "",
      time: "",
      type: "income",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity()) {
      const convertedPrice = parseFloat(debt.price) / (exchangeRates[debt.currency] || 1);

      if (selected) {
        const updatedDebts = debts.map((item) =>
          item.id === selected ? { ...debt, id: selected, convertedPrice } : item
        );
        setDebts(updatedDebts);
        saveToLocalStorage(updatedDebts);
      } else {
        const newDebt = { ...debt, id: debts.length + 1, convertedPrice };
        const updatedDebts = [...debts, newDebt];
        setDebts(updatedDebts);
        saveToLocalStorage(updatedDebts);
      }
      handleClose();
    }
  };

  const handleChange = (e) => {
    setDebt({ ...debt, [e.target.name]: e.target.value });
  };

  const edit = (id) => {
    const selectedDebt = debts.find((item) => item.id === id);
    setDebt(selectedDebt);
    setSelected(id);
    setShow(true);
  };

  const delet = (id) => {
    const updatedDebts = debts.filter((item) => item.id !== id);
    setDebts(updatedDebts);
    saveToLocalStorage(updatedDebts);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredDebts = debts.filter((item) => {
    const matchesCategory =
      filters.category === "all" || item.category === filters.category;
    const matchesDate =
      (!filters.startDate || new Date(item.date) >= new Date(filters.startDate));
    return matchesCategory && matchesDate;
  });

  const totalDebt = filteredDebts.reduce(
    (acc, item) => acc + (item.convertedPrice || 0),
    0
  );

  const totalExpenses = filteredDebts
    .filter(item => item.type === "expense")
    .reduce((acc, item) => acc + (item.convertedPrice || 0), 0);

  const netBalance = totalDebt - totalExpenses;

  return (
    <>
      <Button onClick={handleShow} className="btn btn-primary mb-3">
        Add +
      </Button>

      {/* Filter Section */}
      <Row className="my-4">
        <Col md={6} xs={13} className="mb-3">
          <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="all">All Categories</option>
            <option value="1">Ichimlik</option>
            <option value="2">Transport</option>
            <option value="3">Telefon</option>
            <option value="4">Kitob</option>
          </Form.Select>
        </Col>
        <Col md={6} xs={12}>
          <Form.Control
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder="Start Date"
          />
        </Col>
      </Row>

      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead>
            <tr style={{ textAlign: "center" }}>
              <th>No</th>
              <th>Price</th>
              <th>Currency</th>
              <th>Converted Price ({primaryCurrency})</th>
              <th>Category</th>
              <th>Transaction Type</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDebts.map((debt, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td>{index + 1}</td>
                <td>{debt.price}</td>
                <td>{debt.currency}</td>
                <td>{debt.convertedPrice ? debt.convertedPrice.toFixed(2) : "0.00"}</td>
                <td>{categoryMapping[debt.category]}</td>
                <td>{transactionTypes[debt.type]}</td>
                <td>{debt.description}</td>
                <td>{debt.date}</td>
                <td>{debt.time}</td>
                <td style={{ textAlign: "right" }}>
                  <Button className="btn btn-primary me-2" onClick={() => edit(debt.id)}>
                    Edit
                  </Button>
                  <Button className="btn btn-danger" onClick={() => delet(debt.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="col-lg-4 col-md-6 col-sm-12 mb-3 d-flex flex-column gap-2 mt-5">
        <h5>Total Debt: {totalDebt.toFixed(2)} {primaryCurrency}</h5>
        <h5>Total Expenses: {totalExpenses.toFixed(2)} {primaryCurrency}</h5>
        <h5>Net Balance: {netBalance.toFixed(2)} {primaryCurrency}</h5>
      </div>

      {/* Modal for Add/Edit Transaction */}
      <Modal show={show} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{selected ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  required
                  name="price"
                  value={debt.price}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">Please enter a price.</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Currency</Form.Label>
              <Form.Select name="currency" value={debt.currency} onChange={handleChange}>
                {Object.keys(exchangeRates).map((currencyCode) => (
                  <option key={currencyCode} value={currencyCode}>
                    {currencyCode}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={debt.category} onChange={handleChange}>
                <option value="1">Ichimlik</option>
                <option value="2">Transport</option>
                <option value="3">Telefon</option>
                <option value="4">Kitob</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Transaction Type</Form.Label>
              <Form.Select name="type" value={debt.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                name="description"
                value={debt.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={debt.date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={debt.time}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Transactions;
