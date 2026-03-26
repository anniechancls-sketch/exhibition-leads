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
    
    const response = await fetch(PARDOT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (compatible; ExhibitionLeadsTool/1.0)'
      },
      body: body,
      redirect: 'manual'
    });
    
    const responseText = await response.text();
    const statusCode = response.status;
    
    console.log('Pardot Status:', statusCode);
    console.log('Pardot Response:', responseText);
    
    // 提取 email
    let submittedEmail = '';
    const emailMatch = body.match(/email=([^&]+)/);
    if (emailMatch) submittedEmail = decodeURIComponent(emailMatch[1]);
    
    // 返回详细响应
    res.status(200).json({
      success: statusCode === 200 || statusCode === 302,
      status: statusCode,
      submitted_email: submittedEmail,
      pardot_response: responseText.substring(0, 500),
      body_sent: body.substring(0, 300)
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}