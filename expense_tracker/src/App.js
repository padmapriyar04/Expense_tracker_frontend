import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupPage from "./components/GroupPage";
import MainPage from "./components/MainPage";
import NoMatch from "./components/NoMatchPage";
import "./styles/GroupPage.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/groups/:GroupId" element={<GroupPage />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
