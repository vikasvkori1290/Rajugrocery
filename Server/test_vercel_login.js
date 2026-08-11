const test = async () => {
  try {
    const res = await fetch('https://rajugocery.vercel.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@rajgroceries.com',
        password: 'adminpassword'
      })
    });
    const data = await res.json();
    console.log('Status Code:', res.status);
    console.log('Response Body:', data);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
};
test();
