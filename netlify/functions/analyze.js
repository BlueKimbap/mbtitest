const OpenAI = require('openai');

console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

exports.handler = async function(event, context) {
  // 타임아웃 설정
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API key not configured' })
    };
  }

  try {
    const { answers, theme } = JSON.parse(event.body);
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = theme === 'cyberpunk' 
      ? `다음 답변을 바탕으로 5가지 사항만 간단히 분석해주세요!:
${answers.map(a => `${a.answer}/7`).join(', ')}

1. MBTI 유형 (한 줄)
2. 사이버펑크 세계에서의 역할 (3문장)
3. 주요 성격 특성 (키워드 5개)
4. 가장 어울리는 직업 (한 단어)
5. 주의해야 할 점 (한 문장)`
      : `다음 답변을 바탕으로 5가지 사항만 간단히 분석해주세요!:
${answers.map(a => `${a.answer}/7`).join(', ')}

1. MBTI 유형 (한 줄)
2. 판타지 세계에서의 역할 (3문장)
3. 주요 성격 특성 (키워드 5개)
4. 어울리는 클래스 (한 단어)
5. 모험에서의 강점 (한 문장)`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 MBTI 분석가입니다. 답변은 최대한 간단명료하게 해주세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        analysis: completion.choices[0].message.content 
      })
    };
  } catch (error) {
    console.error('Error details:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'API processing failed',
        details: error.message 
      })
    };
  }
}; 