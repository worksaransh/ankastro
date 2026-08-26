const fetch = globalThis.fetch || require('node-fetch');

async function testOtp() {
  try {
    console.log("Calling send-otp...");
    const sendRes = await fetch('https://kassdsugfktqptsxzqhr.supabase.co/functions/v1/send-otp', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sb_publishable_dpDzS-Z0l99-saXLIxjBBQ_MELe4bBn',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: '+910000000001', purpose: 'login' })
    });
    console.log(`Send-OTP Status: ${sendRes.status}`);
    console.log(`Send-OTP Body: ${await sendRes.text()}`);

    console.log("Calling verify-otp...");
    const response = await fetch('https://kassdsugfktqptsxzqhr.supabase.co/functions/v1/verify-otp', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sb_publishable_dpDzS-Z0l99-saXLIxjBBQ_MELe4bBn',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone: '+910000000001', code: '123456' })
    });
    
    const text = await response.text();
    console.log(`Verify-OTP Status: ${response.status}`);
    console.log(`Verify-OTP Body: ${text}`);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testOtp();
