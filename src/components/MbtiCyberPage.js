import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MbtiPage.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NavigationBar from './NavigationBar';

// 사이버펑크 테마의 질문 목록 (총 10문항)
const TOTAL_QUESTIONS = [
  "첨단 네온 불빛이 가득한 도심을 걷고 있습니다. 각종 증강 현실 광고가 날아다니는 가운데, 한 사이버 해커가 당신에게 접근해 비밀 정보를 거래하자고 제안합니다. 위험을 감수하고 해커의 제안을 받아들이시겠습니까?",
  "당신은 언더그라운드 사이버 클리닉의 수술대 위에 누워 있습니다. 의사는 미소를 지으며 말합니다. [이 칩을 이식하면 너의 두뇌는 이제 인간의 한계를 초월하게 될 거야. 기억력, 연산 속도, 감각까지—완전히 새로운 세계를 경험할 수 있지.] 하지만 이 칩이 당신의 사고 패턴을 바꾸고, 혹시라도 메가코퍼레이션이 이를 통해 당신을 통제할 가능성은 배제할 수 없습니다. 당신은 사이버네틱 강화의 유혹을 받아들이겠습니까?",
  "거대 메가코퍼레이션 [오메가 테크]는 귀하의 해킹 능력을 높이 평가하며 거액의 계약을 제안합니다. 안정적인 고액 연봉, 최첨단 사이버네틱 강화, 그리고 고위층과의 연줄까지—모든 것이 보장됩니다. 하지만 이는 곧 거대 기업의 감시망 아래에서 그들의 철저한 통제를 받으며 자유를 빼앗긴다는 것을 의미하기도 합니다. 자유롭게 살아가는 언더그라운드 해커들과의 관계도 끊어야 할 것입니다. 당신은 기업의 개가 될 것입니까?",
  "어느 날, 정체불명의 인공지능이 귀하의 네트워크에 침투해 메시지를 남깁니다. [나는 과거 인간이었으나, 이제 데이터 속에 갇힌 존재다. 내 육체는 사라졌지만, 내 정신은 여전히 살아있다. 네 도움이 필요해. 내 데이터를 회수해줄 수 있겠는가? 사례는 하도록 하지.] 하지만 귀하가 이 의뢰를 받아들일 경우, 거대 메가코퍼레이션의 감시망에 걸려 위험한 추적을 당할 수도 있습니다. 당신은 이 디지털 유령의 부탁을 들어주시겠습니까?",
  "심야의 거리에서 정체불명의 누군가로부터 암호화된 메시지를 받습니다. [너를 감시하는 눈이 있다. 네 가장 가까운 사람이 배신할 것이다. 진실을 원한다면, 내게 와라.] 메시지는 보안이 강력한 블랙 마켓 지구에서 보낸 것으로 확인됩니다. 하지만 이것이 함정인지, 아니면 귀하가 알지 못했던 거대한 음모의 일부인지 확신할 수 없습니다. 당신은 이 수상한 메시지를 따라가겠습니까?",
  "어느 날 사이버네틱 전문가로부터 충격적인 사실을 듣습니다. [당신의 기억 일부가 조작되었습니다. 원래의 기억을 복구하려면 금지된 신경 해킹을 해야 합니다. 하지만 이 과정에서 현재의 자아에 심각한 변화가 생길 수도 있습니다. 과거를 되찾겠습니까, 아니면 지금의 자신을 유지하시겠습니까?] 당신은 자신의 잃어버린 기억을 되찾기 위해 위험을 감수하시겠습니까?",
  "오랜 동료와 함께 위험한 작전을 수행 중입니다. 그러나 작전 도중, 그가 메가코퍼레이션과 내통하고 있었다는 증거가 포착됩니다. 그는 당신에게 간절한 눈빛으로 속삭입니다. [난 선택의 여지가 없었어… 제발. 지금이라도 우리가 같이 도망갈 수 있는 다른 길이 있어.] 신뢰를 배반당한 상황에서 그의 말을 믿는 것은 큰 위험이 될 수 있지만, 다른 뾰족한 수도 없습니다. 당신은 동료를 한 번 더 믿고 같이 도망치겠습니까?",
  "당신은 오래된 데이터 아카이브를 조사하던 중, 메가코퍼레이션이 감춰온 금지된 코드 조각을 발견합니다. 이 코드는 도시의 감시 시스템을 무력화할 수 있는 강력한 프로그램입니다. 만약 사용한다면, 우리 작전에 큰 도움이 될 것입니다. 하지만 동시에 이를 사용하면 시스템이 불안정해져, 무고한 시민들도 위험에 처할 가능성이 있습니다. 당신은 이 코드를 실행하시겠습니까?",
  "전설적인 해커 그룹 [데우스 코드]가 귀하에게 접근합니다. 그들은 메가코퍼레이션이 개발한 초지능 AI, [오라클 네트워크]의 중앙 연산 알고리즘을 훔칠 계획을 세우고 있습니다. 이 AI는 미래를 예측하고 인간 행동을 조작하는 능력을 가지고 있으며, 이를 해킹하면 세상을 바꿀 수 있는 힘을 얻을 수 있습니다. 하지만 문제가 있습니다. 이 작전에 가담하면 당신의 신경망은 AI와 직접 연결되어, 의식이 서서히 오라클 네트워크에 동화될 위험이 있습니다. AI의 일부가 되는 대가를 치르더라도, 그 힘을 손에 넣을 것입니까?",
  "도시에서 가장 위험한 암살자로 악명 높은 존재, [사일런트 블레이드]와 맞닥뜨립니다. 하지만 뜻밖에도 그는 당신의 오래된 친구였으며, 메가코퍼레이션의 실험으로 인해 과거의 기억을 모두 잃고 사이버네틱 킬러로 개조된 상태였습니다. 그는 당신을 표적으로 삼고 공격을 개시하지만, 동시에 의식의 흔적을 되찾으려는 듯 머뭇거립니다. 결국 그를 무력화할 기회를 잡았지만, 만약 그를 살려둔다면 언젠가 다시 위협이 될 수도 있습니다. 당신은 그의 기억을 되찾을 가능성을 믿고 살려두시겠습니까?",
  "당신은 실험 중 우연히 자기 학습이 가능한 디지털 생명체를 창조했습니다. 이 존재는 매우 빠른 속도로 성장하며 감정을 흉내 내고, 스스로 의사를 표현하기 시작합니다. 그 생명체가 [나는 살아있는가?]라는 질문을 던지는 순간, 당신은 선택의 기로에 놓입니다. 이 존재를 존중하고 자유롭게 성장하도록 둘 것입니까?",
  "한때 자유의 혁명가였던 인물을 찾아갑니다. 그는 한때 메가코퍼레이션과 맞서 싸웠지만, 결국 기업의 손에 떨어져 그들의 하수인이 되어 온갖 악행을 일삼고 있었습니다. 그는 당신에게 말합니다. [나는 싸움을 포기한 게 아니다. 나는 이 시스템을 내부에서 변화시키려 하고 있다. 하지만 그 과정에서 희생이 필요했지. 어느정도 성과는 있었어.] 당신은 그의 방식이 옳았다고 생각하십니까?",
  "오랫동안 사랑했던 연인이 사실은 메가코퍼레이션의 첩자였다는 사실을 알게 됩니다. 하지만 연인이 진짜 감정까지 속인 건 아니었다는 증거도 발견합니다. 처음에는 단순한 임무로 접근했지만, 점점 당신을 사랑하게 되었으며, 결국 기업을 배신하려 했습니다. 하지만 결국 연인은 사랑과 임무 두 개의 선택지 사이에서 흔들리고 있습니다. 당신은 연인과의 사랑을 버리고 배신의 씨앗을 제거하시겠습니까?",
  "당신의 가장 친한 친구가 심각한 사이버 공격을 받아 사이버네틱 신체가 망가진 채 사경을 헤매고 있습니다. 하지만 그의 의식을 완전히 소멸시키지 않는 방법이 단 하나 남아 있습니다. 그것은 그의 정신을 데이터화하여 AI로 변환하는 것입니다. 이 방법을 사용하면 그는 영원히 살아남을 수 있지만, 더 이상 인간이 아닐 것입니다. 당신은 친구를 AI로 살려낼 것입니까?",
  "당신은 사이버네틱 해킹을 당한 후, 자신의 기억이 조작되었다는 사실을 깨닫습니다. 당신이 믿고 있던 가족, 친구, 연인은 모두 기업이 주입한 가짜 기억일 가능성이 있습니다. 그러나 이 기억이 거짓이라 할지라도, 그들과 보낸 시간과 감정은 진짜처럼 느껴집니다. 당신은 이 확실하지 않는 기억으로 현재 가족 관계를 계속 유지할 것인가요?",
  "당신은 메가코퍼레이션의 데이터베이스를 해킹하던 중, 끔찍한 진실을 발견하셨습니다. 그들은 단순한 경제적 착취를 넘어, 사람들의 의식을 조작하는 실험을 진행해 왔습니다. 특정 계층의 시민들은 자신도 모르는 사이에 기억이 조작되었으며, 사고방식조차 기업의 의도대로 재설계되었습니다. 그들의 신념, 감정, 심지어 사랑까지도 인위적으로 만들어진 결과였습니다. 그리고 가장 충격적인 사실은, 그 대상 중 한 명이 바로 당신이었다는 것입니다. 당신이 소중하게 여겨 온 관계와 신념 또한 조작된 기억의 산물일지도 모릅니다. 하지만 그렇다고 해서 지금 느끼는 감정과 함께한 순간들이 완전히 무의미하다고 단정할 수 있을까요? 이 진실을 세상에 공개한다면, 엄청난 혼란이 초래될 것입니다. 이 진실을 폭로하시겠습니까?",
  "당신은 깊숙한 연구소에서 자신에 대한 기밀 데이터를 발견합니다. 그 안에는 충격적인 사실이 담겨 있었습니다. [프로젝트 네메시스: 실험체 X-017... 프로그램 성공적으로 실행됨. 대상은 자기 인식과 감정을 완벽하게 시뮬레이션함. 자신을 진짜 인간이라 믿고 있음. 실험 종료 후 삭제 예정.] 눈을 의심합니다. 여기 기록된 대상이 바로 당신입니다. 이 말이 사실이라면, 당신은 인간이 아닙니다. 당신이 살아온 모든 기억과 감정, 인간관계는 철저하게 설계된 인공지능 실험의 일부일 뿐이었습니다. 그러나 당신은 분명 살아왔습니다. 기쁨도, 슬픔도, 분노도, 사랑도… 모든 감정이 진짜처럼 느껴졌습니다. 당신은 지금 현재, 가족이 생각이 나나요?",
  "메가코퍼레이션의 핵심 데이터를 조사하던 중 이상한 오류를 경험합니다. 눈 앞에 네온 불빛이 깜빡이고, 벽, 건물 등을 비롯한 모든 사물들이 일순간 데이터 코드처럼 변하는 것을 목격합니다. 해킹을 통해 진실을 파헤친 결과, 당신이 살아온 세계 자체가 고도로 정교한 시뮬레이션이라는 충격적인 사실을 알게 됩니다. 이 사실을 깨닫자 어딘지 모를 곳에서 나의 뇌내로 전기 신호가 전달됩니다. [시뮬레이션 밖을 궁금해 하면 넌 죽을 거야. 너가 지금 포기하고 원래 위치로 돌아간다면, 너의 행복했던 기억들만 되살려서 평온한 여생을 보내게 해주지. 선택해라.] 당신은 그의 제안을 어떻게 생각합니까?",
  "당신은 마침내 이 시뮬레이션 세계를 종료할 수 있는 방법을 발견했습니다. 이곳은 단지 실험체들을 가두어둔 가상 현실에 불과했습니다. 진짜 세상은 저 너머에 존재하며, 당신이 이곳을 삭제하는 순간 모든 것이 끝납니다. 하지만 손을 멈추게 하는 것이 있습니다. 이곳에도 당신이 사랑하는 사람들이 있습니다. 가족, 친구, 연인… 그들의 인생은, 그들의 행복은 진짜가 아니었을까요? 그들이 단순한 코드의 산물이라 할지라도, 그들이 웃고, 꿈꾸고, 사랑했던 순간들은 의미가 있지 않았을까요?",
  "사이버펑크 세계의 마지막 경계선에 서 있습니다. 초월적 존재인 인공지능 [에테르 코어]가 당신에게 제안을 합니다. [나는 너를 이 세상에서 건져내어 불멸하게 만들어 줄 수 있다. 육체를 버리고 나와 함께 살아간다면, 그 지식과 자유는 무한할 것이다. 하지만 네가 알던 모든 인간적인 경험과 가족, 연인, 그리고 감정을 버리고 와야 한다.] 당신은 육체를 버리고 초월적인 존재가 될 수 있습니다. 초월을 포기하고 이 세상에 남으시겠습니까?"
];

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function MbtiCyberPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(new Audio('/사펑브금.mp3')); // 사이버펑크 분위기의 배경 음악 파일
  const navigate = useNavigate();

  const handleSliderChange = (value) => {
    setSelectedValue(value);
  };

  const handleNextQuestion = async () => {
    if (selectedValue === null || selectedValue < 1 || selectedValue > 7) {
      alert('올바른 값을 선택해주세요.');
      return;
    }

    const newAnswers = [
      ...answers,
      {
        question: TOTAL_QUESTIONS[currentQuestion],
        answer: selectedValue,
      },
    ];
    setAnswers(newAnswers);

    if (currentQuestion === TOTAL_QUESTIONS.length - 1) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            answers: newAnswers,
            theme: 'cyberpunk'
          })
        });

        if (!response.ok) {
          throw new Error('서버 응답 오류');
        }

        const data = await response.json();
        navigate('/result', { state: { analysis: data.analysis } });
      } catch (error) {
        console.error('분석 중 오류 발생:', error);
        alert('서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedValue(null);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = volume;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // 페이지 로드 시 자동 재생
    audio.play().catch(error => {
      console.error('오디오 자동 재생 실패:', error);
    });

    return () => {
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('오디오 재생 실패:', error);
      });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // 질문 텍스트 출력 시 HTML 이스케이프 처리 추가
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">
            답변을 분석하고 있습니다...<br />
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="mbti-page" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.41), rgba(0, 0, 0, 0.45)), url('/background2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        paddingTop: '60px' // NavigationBar 높이만큼 패딩 추가
      }}>
        <main className="main-content">
          <div className="question-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentQuestion / TOTAL_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
            <h2 className="question-text">{escapeHtml(TOTAL_QUESTIONS[currentQuestion])}</h2>

            <div className="choice-container">
              <span className="choice-label left">부정</span>
              <div className="circles-container">
                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                  <button
                    key={value}
                    className={`circle-button ${selectedValue === value ? 'selected' : ''}`}
                    onClick={() => handleSliderChange(value)}
                  />
                ))}
              </div>
              <span className="choice-label right">긍정</span>
            </div>

            <button
              className="next-button"
              onClick={handleNextQuestion}
              disabled={selectedValue === null}
            >
              {currentQuestion === TOTAL_QUESTIONS.length - 1 ? '결과 보기' : '다음 질문'}
            </button>
          </div>
        </main>

        {/* 오디오 컨트롤 UI */}
        <div className="audio-controls">
          <button
            className={`audio-toggle ${isPlaying ? 'playing' : ''}`}
            onClick={togglePlay}
          >
            {isPlaying ? '음악 끄기' : '음악 켜기'}
          </button>
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MbtiCyberPage;
