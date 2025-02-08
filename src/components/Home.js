// src/components/Home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // 추가 스타일링을 위한 css 파일 (원하는 경우)

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const handleNavigation = (path, theme) => {
    setIsLoading(true);
    setLoadingText(`${theme} 세계관에 진입하는 중...`);
    
    // 1초 후에 페이지 이동
    setTimeout(() => {
      navigate(path);
    }, 3000);
  };

  const goToMbtiPage = () => {
    handleNavigation('/mbti', '판타지');
  };

  const goToMbtiCyberPage = () => {
    handleNavigation('/mbticyber', '사이버펑크');
  };

  return (
    <div className="home-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-spinner"></div>
            <div className="loading-text">{loadingText}</div>
          </div>
        </div>
      )}
      
      {/* 가운데 정렬을 위한 컨테이너 */}
      <div className="main-content">
        <img
          src="main.png" // 예시 이미지 URL, 원하는 이미지로 변경
          alt="메인 이미지"
          className="main-image"
        />
        <p className="intro-message">
          당신의 MBTI를 테스트 해보세요!
        </p>
      </div>

      {/* 하단 버튼 */}
      <div className="button-container">
        <div className="button-wrapper hover-effect clickable" onClick={goToMbtiPage}>
          <div className="button-image floating">
            <img src="/022.png" alt="fantasy" />
          </div>
          <div className="mbti-button fantasy">
            <div>mbti 알아보기</div>
            <div className="button-subtext">(중세판타지)</div>
          </div>
        </div>
        <div className="button-wrapper hover-effect clickable" onClick={goToMbtiCyberPage}>
          <div className="button-image floating">
            <img src="/023.png" alt="cyberpunk" />
          </div>
          <div className="mbti-button cyberpunk">
            <div>mbti 알아보기</div>
            <div className="button-subtext">(사이버펑크)</div>
          </div>
        </div>
        <div className="button-wrapper hover-effect">
          <div className="button-image floating">
            <img src="/024.png" alt="apocalypse" />
          </div>
          <div className="mbti-button apocalypse disabled">
            <div>준비 중입니다</div>
            <div className="button-subtext">(아포칼립스)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
