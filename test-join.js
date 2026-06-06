async function testJoin() {
  try {
    const res = await fetch('http://localhost:3001/api/groups/1/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '13800007777', quantity: 1 })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testJoin();
