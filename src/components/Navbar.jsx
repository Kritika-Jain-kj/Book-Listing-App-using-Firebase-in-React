import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import React from 'react'

function MyNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/book/list">Add Listing</Nav.Link>
          <Nav.Link href="/book/orders"> Orders</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
