import NavBar from "#/components/navbar";
import NotFound from "#/components/not-found";
import { Routes, Route } from "react-router-dom";
import SearchByImage from "./pages/SearchByImage";
import SearchByText from "./pages/SearchByText";
import { Toaster } from "#/components/ui/sonner";
import Home from "./pages/Home";
import SearchByMetadata from "./pages/SearchByMetadata";

function App() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  return (
    <div className="select-none">
      <header>
        <NavBar />
      </header>
      <div className="flex flex-col">
        <main className="flex flex-col flex-1 px-10 pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sbt" element={<SearchByText />} />
            <Route path="/sbi" element={<SearchByImage />} />
            <Route path="/sbm" element={<SearchByMetadata />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </div>
  );
}

export default App;
