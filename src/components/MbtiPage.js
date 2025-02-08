// src/components/MbtiPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './MbtiPage.css';
import { GoogleGenerativeAI } from '@google/generative-ai';
import NavigationBar from './NavigationBar';

const TOTAL_QUESTIONS = [
  "한적한 시골 마을을 지나던 당신과 파티원들은 마을 광장에서 한 상인이 최신 유행하는 마법 물품을 자랑스럽게 선보이는 모습을 봅니다. 그는 이것이 희귀한 유물이라며, 단돈 몇 닢이면 강력한 힘을 손에 넣을 수 있다고 장담합니다. 그러나 파티원 중 마법사는 이 물건이 사기일 가능성이 크다며 신중히 조사해야 한다고 주장합니다. 반면 드워프는 [위험을 감수해야 큰 것을 얻는다]며 당장 구매할 것을 권합니다. 당신은 이 마법 물품을 지금 구매할 의향이 있으신가요?",
  "당신과 파티는 깊은 던전에서 미지의 분기점을 마주합니다. 한쪽 길은 어두운 기운이 감도는 좁은 길이며, 다른 한쪽은 평화로운 풍경의 넓은 길입니다. 전사는 위험을 감수하고 보상이 클 가능성이 높은 어두운 길을 선택하자고 주장합니다. 반면 성직자는 안전하고 명확한 길을 선택하는 것이 옳다고 말합니다. 당신은 위험이 도사리더라도 미지의 길을 탐험하는 것이 더 흥미롭다고 생각하시나요?",
  "여관에서 쉬고 있던 당신은 한 낯선 모험가가 흥미로운 이야기를 들려주는 것을 듣게 됩니다. 그는 먼 동방의 제국에서 온 사람이었고, 그곳에서만 전해지는 신비로운 전설과 독특한 전투 기술에 대해 이야기합니다. 마법사는 그에게 더 많은 이야기를 들려달라며 흥미를 보이지만, 전사는 낯선 정보에 휘둘리지 말고 익숙한 방식대로 행동하는 것이 최선이라며 무관심한 태도를 보입니다. 당신은 낯선 모험가에게 대화를 걸어보겠나요?",
  "한 왕국의 사절이 당신과 파티에게 찾아와 중요한 임무를 의뢰합니다. 그 임무는 침략국과의 전쟁을 피하기 위해 비밀리에 외교 협상을 진행하는 것입니다. 성직자는 외교적 해결이 최선이라며 이를 수락해야 한다고 주장하지만, 전사는 피해가 발생하더라도 침략국에게 굴복하지 않는 것이 더 확실한 방법이라며 반대합니다. 당신은 굴욕적이더라도 평화적인 협상을 시도해보시겠나요?",
  "당신과 파티는 오래된 폐허에서 고대 유적을 발견했습니다. 그런데, 그곳에는 여러 개의 신비로운 문양이 새겨진 문이 서 있습니다. 마법사는 오래된 기록을 해석하여 신중하게 문을 열어야 한다고 주장하지만, 그것은 시간이 얼마나 걸릴지 모릅니다. 어쩌면 몇 달이 걸릴지도 모르죠. 드워프는 직접 문을 열어보며 어떤 일이 일어나는지 실험하는 것이 빠른 방법이라고 말합니다. 당신은 모험적으로 직접 문을 열어보며 탐험 하시겠나요?",
  "어느 날 한 성에서 열린 연회에 초대받았습니다. 귀족들과 상인들이 모여 정보를 교환하며, 각자의 목적을 위해 은밀한 대화를 나누고 있습니다. 성직자는 사람들 사이를 자유롭게 돌아다니며 흥미로운 정보를 캐낼 기회라고 생각하지만, 전사는 낯선 이들과의 교류는 피로할 뿐이라며 조용한 구석에서 쉬기를 원합니다. 당신은 이런 사교적인 자리에서 최대한 많은 사람과 교류하며 정보를 얻는 것이 중요하다고 생각하시나요?",
  "의뢰를 받아 한 마을에 도착했습니다. 그런데 마을에 도착하자마자, 두 개의 상반된 소문을 듣게 됩니다. 한쪽에서는 마을을 괴롭히는 악당이 산속에 숨어 있다고 주장하고, 다른 쪽에서는 마을 지도자가 사실은 폭군이며 반란을 진압하려 한다고 말합니다. 전사는 즉시 마을 주민들을 조사해 누가 거짓말을 하고 있는지 찾아야 한다고 말하고, 성직자는 오해가 생기지 않도록 각 진영을 만나 진심을 들어보아야 한다고 주장합니다. 당신은 정보를 수집하고 분석하는 것이 사람들과 신뢰를 바탕으로 대화하는 것보다 더 효율적이라고 생각하나요?",
  "여정을 이어가던 당신과 파티는 한 왕국의 수도에 도착했습니다. 하지만 도시로 들어서자마자 시민들이 광장에서 논쟁을 벌이고 있는 모습을 보게 됩니다. 왕은 최근 세금을 인상하여 강력한 방어군을 양성하려 하고 있으며, 그 덕분에 외부의 위협으로부터 안전이 보장될 것이라 주장합니다. 반면, 상인들과 시민들은 세금 부담이 너무 커 생계를 위협받고 있으며, 왕이 무리한 군사 확장을 하고 있다고 반발합니다. 전사는 강력한 군대는 필수적이라며 왕의 결정을 지지하지만, 성직자는 시민들의 어려움을 외면해서는 안 된다고 주장합니다. 당신은 국가의 안전을 위해 시민들의 희생이 불가피하다고 생각하시나요?",
  "모험 도중 당신과 파티는 어느 폐허가 된 성에서 귀족의 유령을 만납니다. 그는 억울한 누명을 쓰고 죽었으며, 자신의 결백을 증명해달라고 간청합니다. 성의 오래된 문서와 유품을 조사하면 진실을 밝혀낼 수 있을 것 같습니다. 하지만 이 의뢰를 맡게 되면 중요한 여정을 크게 늦출 위험이 있습니다. 마법사는 역사적 진실을 밝히는 것은 중요한 일이라며 이 사건을 해결해야 한다고 주장하지만, 전사는 이미 맡은 임무를 방해받을 수 없다며 빨리 떠나야 한다고 말합니다. 당신은 이 미해결된 진실을 밝히는 것이 가치 있다고 생각하시나요?",
  "당신과 파티는 강을 따라 여행하던 중, 배가 전복되어 조난당한 여행자들을 발견합니다. 그들은 마을로 돌아갈 길을 잃고 식량도 거의 바닥난 상태입니다. 성직자는 그들을 돕는 것이 당연한 도리라며 마을까지 동행해야 한다고 주장하지만, 드워프는 우리도 충분히 위험한 상황이며, 모험에 집중해야 한다고 말합니다. 도움을 주는 것은 좋지만, 우리 자원까지 소모해가면서 이들을 돌보는 것은 무리라는 것이죠. 당신은 조난민들을 끝까지 보호하며 마을까지 데려가야 한다고 생각하시나요?",
  "여관에서 쉬고 있던 당신과 파티는 한 음유시인으로부터 흥미로운 제안을 받습니다. 그는 당신의 모험담을 노래로 만들어 왕국 전역에 퍼뜨리겠다고 합니다. 덕분에 명성을 얻고 귀족들에게 주목받을 기회가 될 수도 있지만, 잘못된 정보가 퍼지거나 원치 않는 적들의 표적이 될 위험도 있습니다. 마법사는 이런 기회를 놓쳐선 안 된다며 적극적으로 홍보해야 한다고 하지만, 전사는 조용히 행동하는 것이 더 현명하다고 주장합니다. 당신은 세상에 당신의 파티가 널리 알려지는 것을 긍정적으로 생각하시나요?",
  "여정 중 당신과 파티는 깊은 산속에서 전설적인 대장장이를 만납니다. 그는 엄청난 기술을 지녔지만, 그가 만든 무기를 얻기 위해서는 당신이 소중히 여기는 무언가를 제물로 바쳐야 한다고 합니다. 그것이 양심이 됐던, 신념이 됐던 말이죠. 전사는 강력한 장비를 얻기 위해서는 희생이 필요하다며 거래를 받아들여야 한다고 주장하지만, 성직자는 물질적인 힘보다 소중한 가치를 지키는 것이 더 중요하다고 말합니다. 당신은 더 큰 힘을 얻기 위해 중요한 것을 희생하는 것이 정당하다고 생각하시나요?",
  "여정을 계속하던 중, 당신과 파티는 한 신비로운 석판을 발견합니다. 그것은 고대의 강력한 주문이 새겨진 유물로, 해독하면 엄청난 힘을 얻을 수 있을지도 모릅니다. 하지만 문제는 이 주문이 위험할 수도 있으며, 한 번 사용하면 돌이킬 수 없는 결과를 초래할 수도 있다는 것입니다. 마법사는 지식을 추구하는 것이 모험가의 본질이라며 반드시 해독해야 한다고 주장하지만, 성직자는 자연의 질서를 함부로 건드려서는 안 된다며 그냥 두고 가자고 합니다. 당신은 미지의 지식을 탐구하는 것이 위험을 감수할 만큼 가치 있다고 생각하시나요?",
  "당신과 파티는 황량한 전장에서 쓰러진 기사 한 명을 발견합니다. 그는 치명적인 부상을 입고 있으며, 마지막 힘을 다해 당신에게 간청합니다. [내가 맡은 임무를 완수해 주시오…]라며 중요한 서신을 건네고, 이 서신을 왕에게 전달하는 것이 왕국의 운명을 바꿀 수도 있다고 합니다. 하지만 이 임무를 맡으면 당신이 원래 계획했던 목표는 뒤로 미뤄지게 됩니다. 성직자는 이 기사의 마지막 소원을 들어주는 것이 도리라고 하지만, 드워프는 우리의 목표를 벗어나지 않는 것이 현명하다고 말합니다. 당신은 자신의 원래 목표를 희생하더라도 이 새로운 임무를 받아들이는 것이 옳다고 생각하시나요?",
  "한 마법 연구소에 도착했습니다. 이곳에서는 금기시된 실험이 진행되고 있으며, 연구자들은 강력한 마법을 창조하는 과정에서 윤리적인 논란을 일으키고 있습니다. 그들은 이 연구가 왕국의 미래를 바꿀 혁신적인 발견을 가져올 것이라 주장하지만, 실험의 과정에서 많은 희생이 따를 수도 있습니다. 마법사는 연구가 금지될 이유는 없다며, 진보를 위해서는 어떤 위험도 감수해야 한다고 주장합니다. 반면 성직자는 자연과 생명의 균형을 해치는 연구는 용납할 수 없다고 반대합니다. 당신은 위대한 발전을 위해서라면 이런 연구도 용인될 수 있다고 생각하시나요?",
  "모험을 이어가던 당신과 파티는 고대 신전에서 신비한 마법의 거울을 발견합니다. 이 거울은 들여다보는 자가 가장 깊이 원하는 미래의 모습을 비춰주지만, 그것이 실제로 이루어질 것이라는 보장은 없습니다. 마법사는 이 거울을 통해 자신의 진정한 욕망을 깨닫고 목표를 더욱 명확히 할 수 있다고 주장하지만, 드워프는 환상에 사로잡혀 현실을 망각할 위험이 크다며 경계합니다. 당신은 자신의 가장 깊은 욕망을 알게 된다면 그것이 당신의 삶에 긍정적인 영향을 미칠 것이라고 생각하시나요?",
  "당신과 파티는 마침내 마왕성이 있는 저주받은 땅 근처까지 다다랐습니다. 하지만 이곳은 상상 이상으로 험난한 지역이었고, 식량과 물자가 점점 부족해지고 있습니다. 그런 상황에서 한 어두운 세력의 사절이 당신을 찾아와 제안을 합니다. 지금 자기 세력과 화친을 맺고 돌아가면, 당신과 동료들은 안전을 보장 받을 수 있다는 것입니다. 마법사는 협상을 통해 더 나은 기회를 찾을 수도 있다며 고려할 가치가 있다고 주장하지만, 전사는 악과 타협하는 것은 있을 수 없는 일이라며 단칼에 거절해야 한다고 합니다. 당신은 더 큰 목표를 위해서라면 적과의 협상도 고려할 수 있다고 생각하시나요?",
  "마왕성이 코앞에 다가왔을 때, 당신과 파티는 기이한 광경을 목격합니다. 마왕성을 둘러싼 황폐한 대지는 예상과 달리 활기가 넘치며, 이곳에 사는 사람들이 공포에 질려있기는커녕 평온한 일상을 보내고 있습니다. 성 안에서 다스리는 마왕이 무자비한 폭군이라는 소문과는 달리, 이곳에서는 오히려 평화가 유지되는 것처럼 보입니다. 이에 대해 마법사는 마왕의 실체를 직접 확인한 후 공격 여부를 결정해야 한다고 주장하지만, 성직자는 마왕의 본질이 무엇이든 간에, 악의 근원은 반드시 제거해야 한다며 원래 계획을 밀고 나가야 한다고 말합니다. 당신은 예상과 다른 진실을 마주했을 때, 원래 신념을 고수하는 것이 더 중요하다고 생각하시나요?",
  "당신과 파티는 마왕성 근처의 한 평화로운 마을에 도착합니다. 겉보기에는 평온한 들판과 잔잔한 강물, 조용한 주거환경이 주민들에게 안정을 주는 듯 보입니다. 그러나 이 평화는 마왕세력의 엄격한 통제 하에 유지되는, 실상은 억압받는 자유 없는 안정이었습니다. 주민들은 현재의 안락함에 익숙해진 나머지, 진정한 자율과 자유를 누릴 기회를 잃어버렸습니다. 당신은 이 마을의 주민들이 진정한 자유를 찾기 위해서는, 지금 보이는 평화를 깨뜨리고 모든 걸 뒤엎어야 한다고 생각하시나요?",
  "마왕의 옥좌 앞에 섰습니다. 그러나 마왕의 눈빛에는 전형적인 폭군의 잔혹함 대신, 오히려 냉정하고 침착한 평온이 서려 있습니다. 그는 천천히 입을 열어 말합니다. [네가 지금까지 믿어온 전설, 그 모든 공포는 단 한 가지 진실을 감추고 있네. 나는 단순한 악의 화신이 아니다. 내 존재는 수세기 전, 세계 각 왕국의 지도자들이 모여 서로의 불신과 분열을 막기 위해 합의한 의례적인 상징일 뿐이었으니까. 절대적인 악이 있어야 사람들은 서로 뭉쳐, 공통의 적을 향해 힘을 합칠 수 있었고, 그로써 일시적이나마 평화와 질서를 유지할 수 있었던 것이다. 내가 바로, 그들이 선택한 [악의 표상]이자 균형의 수단이지. 이제 남은 건 너의 선택뿐이다. 네가 마왕이 되던가, 아니면 마왕이 없는 세상에 혼돈을 초래하던가.] 그의 고백에 파티의 동료들은 충격에 빠지고, 당신의 마음속에는 혼란의 파도가 이는 것을 느낍니다. 당신은 이 인위적으로 만들어진 평화를 부정하고 질서를 깨뜨리겠습니까?",
];

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

function MbtiPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef(new Audio('/중세브금.mp3'));
  const navigate = useNavigate();

  const handleSliderChange = (value) => {
    setSelectedValue(value);
  };

  const handleNextQuestion = async () => {
    if (selectedValue === null) return;

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
        const response = await fetch('/.netlify/functions/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            answers: newAnswers,
            theme: 'fantasy'
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
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.66)), url('/background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        paddingTop: '60px'
      }}>
        <main className="main-content">
          <div className="question-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(currentQuestion / TOTAL_QUESTIONS.length) * 100}%` }}
              ></div>
            </div>
            <h2 className="question-text">{TOTAL_QUESTIONS[currentQuestion]}</h2>
            
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

export default MbtiPage;
