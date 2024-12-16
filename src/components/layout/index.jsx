import { NavLink, Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container } from "react-bootstrap";

const Layout = () => {
  return (
    <div className="container-fluid">
      <header>
        <Navbar bg="light" expand="lg" className="py-3">
          <Container>
            <Navbar.Brand as={NavLink} to="/">
              Hello world
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={NavLink} to="/currency">
                  Currency
                </Nav.Link>
                <Nav.Link as={NavLink} to="/transactions">
                  Transactions
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <main className="container py-4">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;
