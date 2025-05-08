import { Button } from "../components/ui/button";
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <h2>Inscreva-se no Noah!</h2>
      <Button>Inscreva-se</Button>
      <UserButton />
    </div>
  
  );
}
