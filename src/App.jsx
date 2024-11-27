import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sign from "./Component/Sign/Sign";
import Home from "./Component/Home/Home";
import Dashboard from "./Component/Dashbord/Dashbord";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Sign" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
