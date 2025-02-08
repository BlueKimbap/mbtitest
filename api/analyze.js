const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.REACT_APP_GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { answers, theme } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = theme === 'cyberpunk' 
      ? `당신은 심리 분석 전문가입니다. 사용자의 응답을 바탕으로 MBTI 유형을 추정하고, 사이버펑크 세계관에 맞춰 성격을 분석해주세요.

다음은 20개의 사이버펑크 테마 성격 검사 질문과 답변입니다. 각 답변은 1(부정)부터 7(긍정)까지의 척도입니다:

${answers.map(a => `질문: ${a.question}\n답변: ${a.answer}/7`).join('\n\n')}

위 답변을 바탕으로:
1. 응답자의 MBTI 유형을 추정해주세요.
2. 사이버펑크 세계관에서 이 성격의 소유자가 어떤 역할과 운명을 가질지 설명해주세요.
3. 기술, 사회, 개인의 자유와 관련된 특징을 포함하여 서술해주세요.`
      : `당신은 심리 분석 전문가입니다. 사용자의 응답을 바탕으로 MBTI 유형을 추정하고, 판타지 세계관에 맞춰 성격을 분석해주세요.

다음은 20개의 판타지 테마 성격 검사 질문과 답변입니다. 각 답변은 1(부정)부터 7(긍정)까지의 척도입니다:

${answers.map(a => `질문: ${a.question}\n답변: ${a.answer}/7`).join('\n\n')}

위 답변을 바탕으로:
1. 응답자의 MBTI 유형을 추정해주세요.
2. 판타지 세계관에서 이 성격의 소유자가 어떤 역할과 운명을 가질지 설명해주세요.
3. 모험, 동료와의 관계, 전투 스타일, 마법이나 기술에 대한 태도 등을 포함하여 서술해주세요.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'API processing failed' });
  }
} 