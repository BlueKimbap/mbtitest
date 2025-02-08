// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MbtiPage from './components/MbtiPage';
import MbtiCyberPage from './components/MbtiCyberPage';
import ResultPage from './components/ResultPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="/" element={<Home />} />
        {/* mbti 알아보기 페이지 */}
        <Route path="/mbti" element={<MbtiPage />} />
        <Route path="/mbticyber" element={<MbtiCyberPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
