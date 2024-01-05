import NavBar from "#/components/navbar";
import NotFound from "#/components/not-found";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchByImage from "./pages/SearchByImage";
import SearchByText from "./pages/SearchByText";
import { Toaster } from "#/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <header>
        <NavBar />
      </header>
      <div className="flex flex-col">
        <main className="flex flex-col flex-1 px-10 pt-4">
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/sbt" element={<SearchByText />} />
            <Route path="/sbi" element={<SearchByImage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
