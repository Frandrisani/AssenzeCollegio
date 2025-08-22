import React from 'react'
import { Button, Spinner, Container, Row, Col, Card } from 'react-bootstrap'
import { loginWithGoogle } from '../firebase'

export default function AuthGate() {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{minHeight:'90vh'}}>
      <Row className="w-100">
        <Col xs={{span:10, offset:1}} md={{span:6, offset:3}}>
          <Card className="glass p-4 rounded-4">
            <h1 className="mb-3">Assenze Alloggio</h1>
            <p className="text-secondary">Accedi con Google per sincronizzare i tuoi dati su tutti i dispositivi.</p>
            <Button variant="primary" className="rounded-pill px-4" onClick={loginWithGoogle}>
              Continua con Google
            </Button>
            <p className="mt-3 mb-0 footer">I tuoi dati restano privati nel tuo account Firebase.</p>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
