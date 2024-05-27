import "./App.css";
import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <>
      <Navbar />
      <div className="h-svh">
        <h1 className="text-3xl font-bold underline"> Crew Fireworks</h1>
      </div>
      <Footer />
    </>
  );
}

export default App;
