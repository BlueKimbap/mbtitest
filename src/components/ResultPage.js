import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import './ResultPage.css';

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, theme = 'fantasy' } = location.state || {};

  if (!analysis) {
    return (
      <div className="result-page">
        <h1>결과를 찾을 수 없습니다</h1>
        <button onClick={() => navigate('/')}>처음으로 돌아가기</button>
      </div>
    );
  }

  const analysisLines = analysis.split('\n').filter(line => line.trim());
  
  const titles = {
    fantasy: '당신의 모험가 성향 분석',
    cyberpunk: '당신의 사이버펑크 성향 분석'
  };

  return (
    <>
      <NavigationBar />
      <div className={`result-page ${theme}`}>
        <h1 className="result-title">{titles[theme]}</h1>
        <div className="result-container">
          <section className="analysis-section">
            <div className="analysis-content">
              {analysisLines.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
        </div>
        
        <button 
          className="restart-button" 
          onClick={() => navigate('/')}
        >
          다시 검사하기
        </button>
      </div>
    </>
  );
}

export default ResultPage; 