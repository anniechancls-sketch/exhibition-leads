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
    
    const response = await fetch(PARDOT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'ExhibitionLeadsTool/1.0' },
      body: body
    });
    
    const responseText = await response.text();
    let submittedEmail = '';
    const emailMatch = body.match(/email=([^&]+)/);
    if (emailMatch) submittedEmail = decodeURIComponent(emailMatch[1]);
    
    res.status(200).json({ success: response.status === 200, status: response.status, submitted_email: submittedEmail });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
