import React from "react";
import { Container, Spinner } from "react-bootstrap";

export default function SplashScreen() {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <h1 className="mb-4" style={{ fontWeight: 700 }}>
        Assenze Alloggio
      </h1>
      <p className="text-secondary mb-4">Verifica autenticazione in corso...</p>
      <Spinner animation="border" variant="primary" />
    </Container>
  );
}
