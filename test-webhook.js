// 测试微信支付webhook的脚本
const crypto = require('crypto');

// 模拟微信支付配置（需要与实际配置一致）
const testConfig = {
  apiV3Key: 'your_api_v3_key_here', // 替换为实际的API v3密钥
  webhookUrl: 'http://localhost:3000/api/webhooks/wechat'
};

// 模拟微信支付回调数据
const mockWechatCallback = {
  id: 'test-callback-id-123',
  create_time: new Date().toISOString(),
  resource_type: 'encrypt-resource',
  event_type: 'TRANSACTION.SUCCESS',
  summary: '支付成功',
  resource: {
    original_type: 'transaction',
    algorithm: 'AEAD_AES_256_GCM',
    // 这里应该是加密后的实际数据，需要用实际的密钥和算法加密
    ciphertext: 'encrypted_data_here',
    associated_data: 'transaction',
    nonce: 'test_nonce_123'
  }
};

/**
 * 生成微信支付回调签名
 */
function generateWechatSignature(timestamp, nonce, body, apiV3Key) {
  const message = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac('sha256', apiV3Key)
    .update(message, 'utf8')
    .digest('base64');
}

/**
 * 发送测试回调请求
 */
async function testWechatWebhook() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const body = JSON.stringify(mockWechatCallback);
  
  const signature = generateWechatSignature(timestamp, nonce, body, testConfig.apiV3Key);
  
  const headers = {
    'Content-Type': 'application/json',
    'Wechatpay-Timestamp': timestamp,
    'Wechatpay-Nonce': nonce,
    'Wechatpay-Signature': signature,
    'Wechatpay-Serial': 'test-serial-number'
  };
  
  console.log('发送测试回调请求...');
  console.log('Headers:', headers);
  console.log('Body:', body);
  
  try {
    const response = await fetch(testConfig.webhookUrl, {
      method: 'POST',
      headers,
      body
    });
    
    const responseText = await response.text();
    
    console.log('\n=== 响应结果 ===');
    console.log('状态码:', response.status);
    console.log('状态文本:', response.statusText);
    console.log('响应头:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    console.log('响应体:', responseText || '(空)');
    
    if (response.status === 200 || response.status === 204) {
      console.log('\n✅ Webhook处理成功!');
    } else {
      console.log('\n❌ Webhook处理失败!');
    }
    
  } catch (error) {
    console.error('请求失败:', error);
  }
}

/**
 * 简单的回调测试（不进行加密，只测试基本结构）
 */
async function testSimpleCallback() {
  console.log('=== 简单回调测试 ===');
  
  // 简化的回调数据（不包含加密内容）
  const simpleCallback = {
    id: 'simple-test-123',
    create_time: new Date().toISOString(),
    resource_type: 'encrypt-resource',
    event_type: 'TRANSACTION.SUCCESS',
    summary: '支付成功',
    resource: {
      original_type: 'transaction',
      algorithm: 'AEAD_AES_256_GCM',
      ciphertext: 'fake_encrypted_data',
      associated_data: 'transaction',
      nonce: 'fake_nonce'
    }
  };
  
  try {
    const response = await fetch(testConfig.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 故意不提供签名头部，测试错误处理
      },
      body: JSON.stringify(simpleCallback)
    });
    
    const responseText = await response.text();
    
    console.log('状态码:', response.status);
    console.log('响应体:', responseText);
    
    if (response.status === 400) {
      console.log('✅ 正确识别缺少签名头部!');
    }
    
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 运行测试
console.log('开始测试微信支付Webhook...\n');

// 检查是否在生产环境中运行
if (process.env.NODE_ENV === 'production') {
  console.log('⚠️  注意：您正在生产环境中运行测试脚本!');
}

// 首先运行简单测试
testSimpleCallback()
  .then(() => {
    console.log('\n' + '='.repeat(50) + '\n');
    
    // 如果需要完整测试，请配置正确的API密钥
    if (testConfig.apiV3Key === 'your_api_v3_key_here') {
      console.log('💡 提示：要进行完整的签名验证测试，请在脚本中配置正确的API v3密钥');
      console.log('   然后取消注释下面的代码');
      // return testWechatWebhook();
    } else {
      return testWechatWebhook();
    }
  })
  .then(() => {
    console.log('\n测试完成!');
  })
  .catch(error => {
    console.error('测试失败:', error);
  }); 