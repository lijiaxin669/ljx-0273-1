async function testAPI() {
  const base = 'http://localhost:3001/api';
  
  console.log('=== 1. 获取团购列表 ===');
  const listRes = await fetch(`${base}/groups`);
  const listData = await listRes.json();
  console.log(`状态: ${listRes.status}, 数量: ${listData.length}`);
  if (listData.length > 0) {
    console.log(`第一个团: ${listData[0].productName}, 库存: ${listData[0].remainingStock}, 当前人数: ${listData[0].currentCount}`);
  }
  
  console.log('\n=== 2. 获取第一个团详情 ===');
  if (listData.length > 0) {
    const detailRes = await fetch(`${base}/groups/${listData[0].id}`);
    const detailData = await detailRes.json();
    console.log(`状态: ${detailRes.status}`);
    console.log(`商品: ${detailData.productName}, 价格: ¥${detailData.price}, 库存: ${detailData.remainingStock}`);
    console.log(`目标人数: ${detailData.targetCount}, 当前人数: ${detailData.currentCount}, 状态: ${detailData.status}`);
  }
  
  console.log('\n=== 3. 测试参团 ===');
  if (listData.length > 0) {
    const joinRes = await fetch(`${base}/groups/${listData[0].id}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '13900008888', quantity: 1 })
    });
    const joinData = await joinRes.json();
    console.log(`状态: ${joinRes.status}`);
    console.log(JSON.stringify(joinData, null, 2));
  }
}
testAPI().catch(e => console.error('Error:', e.message));
