import { SchemaDetails } from "@/components/SchemaDetails";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="flex flex-col">
      <ConnectButton />
      <SchemaDetails />
    </div>
  );
}

export default App;
