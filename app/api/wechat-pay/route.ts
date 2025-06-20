// app/api/createNativeOrder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const globalConf = {
  appid: process.env.WX_APPID!,
  mchid: process.env.WX_MCH_ID!,
  serialNo: process.env.WX_SERIAL_NO!,
  privateKey: fs.readFileSync(path.join(process.cwd(), 'apiclient_key.pem'), 'utf-8'),
  apiV3Key: process.env.WX_API_V3_KEY!,
};

/**
 * 生成随机 nonce_str
 */
function randomString(len = 32) {
  return crypto.randomBytes(len / 2).toString('hex');
}

/**
 * 使用私钥对消息签名，返回 base64 签名
 */
function signMessage(message: string) {
  return crypto.createSign('RSA-SHA256').update(message).sign(globalConf.privateKey, 'base64');
}

/**
 * 创建微信 Native 订单
 */
export async function POST(req: NextRequest) {
  try {
    const { description, outTradeNo, total } = await req.json();

    const urlPath = '/v3/pay/transactions/native';
    const url = 'https://api.mch.weixin.qq.com' + urlPath;

    const bodyObj = {
      appid: globalConf.appid,
      mchid: globalConf.mchid,
      description,
      out_trade_no: outTradeNo,
      notify_url: 'https://bb32-119-78-253-24.ngrok-free.app/api/webhooks/wechat',
      amount: { total, currency: 'CNY' },
    };
    const body = JSON.stringify(bodyObj);

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonceStr = randomString();

    // 构造签名原串
    const message = ['POST', urlPath, timestamp, nonceStr, body].join('\n') + '\n';
    const signature = signMessage(message);

    const auth = `WECHATPAY2-SHA256-RSA2048 mchid="${globalConf.mchid}",appid="${globalConf.appid}",serial_no="${globalConf.serialNo}",nonce_str="${nonceStr}",timestamp="${timestamp}",signature="${signature}"`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body,
    });

    const json = await resp.json();
    if (!resp.ok) {
      console.error('微信下单失败：', json);
      return NextResponse.json({ error: json }, { status: resp.status });
    }
    return NextResponse.json({ codeUrl: json.code_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}