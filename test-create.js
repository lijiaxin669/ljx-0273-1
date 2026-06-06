async function testCreateGroup() {
  const base = 'http://localhost:3001/api';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  console.log('=== 创建团购 ===');
  const createRes = await fetch(`${base}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productName: '爱他美白金版奶粉3段',
      description: '德国进口，适合1-3岁宝宝，社区团购专属价',
      imageUrl: '',
      price: 298.00,
      targetCount: 10,
      stock: 50,
      deadline: tomorrow.toISOString(),
      leaderId: 1,
    })
  });
  const createData = await createRes.json();
  console.log(`状态: ${createRes.status}`);
  console.log(JSON.stringify(createData, null, 2));
  
  console.log('\n=== 获取团购列表 ===');
  const listRes = await fetch(`${base}/groups`);
  const listData = await listRes.json();
  console.log(`状态: ${listRes.status}, 数量: ${listData.length}`);
  listData.forEach((g, i) => {
    console.log(`${i+1}. ${g.productName} - ¥${g.price} - 库存${g.remainingStock}/${g.stock} - ${g.currentCount}/${g.targetCount}人`);
  });
}
testCreateGroup().catch(e => console.error('Error:', e.message));
