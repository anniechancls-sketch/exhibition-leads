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
    
    console.log('=== Pardot Submit Debug ===');
    console.log('Received body:', body);
    
    // 解析参数
    const params = new URLSearchParams(body);
    const email = params.get('email');
    
    // 构建完整 URL（保持参数原样）
    const submitUrl = PARDOT_URL + '?' + body;
    console.log('GET URL:', submitUrl);
    
    // 发送 GET 请求
    const response = await fetch(submitUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      redirect: 'manual'  // 不自动跳转，获取原始响应
    });
    
    const responseText = await response.text();
    const statusCode = response.status;
    const locationHeader = response.headers.get('location');
    
    console.log('Status:', statusCode);
    console.log('Location:', locationHeader);
    console.log('Response body:', responseText);
    
    // 返回完整调试信息
    res.status(200).json({
      success: statusCode === 302 && locationHeader && !locationHeader.includes('error'),
      status: statusCode,
      location: locationHeader,
      submitted_email: email,
      pardot_response: responseText.substring(0, 1000),
      request_url: submitUrl
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}