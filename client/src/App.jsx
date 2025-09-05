// App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SalesEntry from "./pages/SalesEntry";
import SalesHistory from "./pages/SalesHistory";
import Navbar from "./components/Navbar";
import RestockPage from "./pages/RestockPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Dashboard searchTerm={searchTerm} />} />
        <Route path="/sales" element={<SalesEntry />} />
        <Route path="/sales/history" element={<SalesHistory />} />
        <Route path="/restock" element={<RestockPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
