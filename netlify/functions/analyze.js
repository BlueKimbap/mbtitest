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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 MBTI 전문가이자 판타지/사이버펑크 세계관 전문가입니다."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
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