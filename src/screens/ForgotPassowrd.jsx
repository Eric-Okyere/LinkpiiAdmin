import { Container, Card } from '../components/ui';

function ForgotPassowrd() {
  return (
    <Container>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-ink-900">Forget Password</h1>
        </Card>
      </div>
    </Container>
  )
}

export default ForgotPassowrd;
