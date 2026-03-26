export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  
  const PARDOT_URL = 'https://go.rifeng.com/l/900071/2026-03-18/3t99mv';
  
  try {
    let body = '';
    for await (const chunk of req) body += chunk;
    
    console.log('=== Pardot Submit ===');
    console.log('Body:', body);
    
    // 解析参数
    const params = new URLSearchParams(body);
    const email = params.get('email');
    console.log('Email:', email);
    
    // 使用 GET 方式提交（拼接到 URL）
    const submitUrl = PARDOT_URL + '?' + body;
    console.log('Submit URL:', submitUrl);
    
    // 发送 GET 请求
    const response = await fetch(submitUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      redirect: 'manual'
    });
    
    const responseText = await response.text();
    const statusCode = response.status;
    
    console.log('Pardot Status:', statusCode);
    console.log('Pardot Response:', responseText.substring(0, 300));
    
    // GET 成功通常返回 302 重定向或 200
    const success = statusCode === 200 || statusCode === 302 || statusCode === 301;
    
    res.status(200).json({
      success: success,
      status: statusCode,
      submitted_email: email || '',
      message: success ? '提交成功！Pardot 已收到数据。' : '提交完成，请检查 Pardot 后台确认。'
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}