import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Highlights from "./components/Highlights/Highlights";


const App = () => {

  return (
    <main className="bg-black">
      <Navbar/>
      <Hero/>
      <Highlights/>
    </main>
  )
}

export default App
