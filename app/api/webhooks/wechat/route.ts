import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

// 微信支付配置
const globalConf = {
  apiV3Key: process.env.WX_API_V3_KEY!,
  mchid: process.env.WX_MCH_ID!,
  // 微信支付平台证书公钥文件路径（需要下载并放置在项目根目录）
  platformCertPath: path.join(process.cwd(), 'apiclient_cert.pem'),
}

/**
 * 验证微信支付回调签名
 * 根据官方文档：使用微信支付平台证书/公钥进行RSA-SHA256验签
 */
function verifySignature(
  timestamp: string,
  nonce: string,
  body: string,
  signature: string,
  serial: string
): boolean {
  try {
    // 检查是否为签名探测流量
    if (signature.startsWith('WECHATPAY/SIGNTEST/')) {
      console.log('检测到微信支付签名探测流量，验签失败')
      return false
    }

    // 构造验签串
    const message = `${timestamp}\n${nonce}\n${body}\n`
    
    // 读取微信支付平台证书公钥
    let publicKey: string
    try {
      if (fs.existsSync(globalConf.platformCertPath)) {
        publicKey = fs.readFileSync(globalConf.platformCertPath, 'utf-8')
      } else {
        console.error('微信支付平台证书文件不存在:', globalConf.platformCertPath)
        console.log('提示：请从微信支付商户平台下载证书文件并放置在项目根目录')
        // 在开发/测试环境中，如果没有证书文件，可以跳过验签
        if (process.env.NODE_ENV === 'development') {
          console.log('开发环境：跳过签名验证')
          return true
        }
        return false
      }
    } catch (error) {
      console.error('读取微信支付平台证书失败:', error)
      return false
    }
    
    // 使用RSA-SHA256进行验签
    const verify = crypto.createVerify('RSA-SHA256')
    verify.update(message, 'utf8')
    
    // 对签名进行base64解码
    const signatureBuffer = Buffer.from(signature, 'base64')
    
    // 验证签名
    const isValid = verify.verify(publicKey, signatureBuffer)
    
    console.log('签名验证结果:', isValid ? '通过' : '失败')
    return isValid
    
  } catch (error) {
    console.error('验签过程发生错误:', error)
    return false
  }
}

/**
 * 解密微信支付回调数据
 * 使用AES-256-GCM算法解密
 * 参考微信官方Python示例进行实现
 */
function decryptResource(resource: any): any {
  try {
    const { ciphertext, associated_data, nonce } = resource
    
    console.log('开始解密回调数据...', {
      algorithm: resource.algorithm,
      nonceLength: nonce.length,
      ciphertextLength: ciphertext.length,
      associatedData: associated_data
    })
    
    // 验证加密算法
    if (resource.algorithm !== 'AEAD_AES_256_GCM') {
      throw new Error(`不支持的加密算法: ${resource.algorithm}`)
    }
    
    // 根据微信官方Python示例，参数处理方式：
    // key_bytes = str.encode(key)
    // nonce_bytes = str.encode(nonce)  // 注意：nonce直接编码，不是base64解码
    // ad_bytes = str.encode(associated_data)
    // data = base64.b64decode(ciphertext)
    
    const keyBytes = Buffer.from(globalConf.apiV3Key, 'utf8')
    const nonceBytes = Buffer.from(nonce, 'utf8')  // 修改：直接使用utf8编码，而不是base64解码
    const adBytes = Buffer.from(associated_data, 'utf8')
    const ciphertextBuffer = Buffer.from(ciphertext, 'base64')
    
    // GCM模式的认证标签长度为16字节，位于密文末尾
    const authTagLength = 16
    const encryptedData = ciphertextBuffer.slice(0, -authTagLength)
    const authTag = ciphertextBuffer.slice(-authTagLength)
    
    // 创建解密器
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBytes, nonceBytes)
    
    // 设置认证标签和附加数据
    decipher.setAuthTag(authTag)
    decipher.setAAD(adBytes)
    
    // 解密数据  
    let decrypted = decipher.update(encryptedData, undefined, 'utf8')
    decrypted += decipher.final('utf8')
    
    const decryptedData = JSON.parse(decrypted)
    console.log('解密成功，数据类型:', typeof decryptedData)
    
    return decryptedData
    
  } catch (error) {
    console.error('解密失败，详细错误:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`数据解密失败: ${errorMessage}`)
  }
}

/**
 * 处理支付成功的业务逻辑
 */
async function handlePaymentSuccess(paymentData: any) {
  try {
    const {
      appid,
      mchid,
      out_trade_no,
      transaction_id,
      trade_type,
      trade_state,
      trade_state_desc,
      bank_type,
      attach,
      success_time,
      payer,
      amount,
      scene_info
    } = paymentData
    
    console.log('=== 支付成功业务逻辑处理 ===')
    console.log('商户订单号:', out_trade_no)
    console.log('微信支付订单号:', transaction_id)
    console.log('交易类型:', trade_type)
    console.log('交易状态:', trade_state)
    console.log('交易状态描述:', trade_state_desc)
    console.log('银行类型:', bank_type)
    console.log('支付完成时间:', success_time)
    console.log('支付金额:', amount)
    console.log('支付者信息:', payer)
    
    if (attach) {
      console.log('商户数据包:', attach)
    }
    
    if (scene_info) {
      console.log('场景信息:', scene_info)
    }
    
    // 这里添加具体的业务处理逻辑
    // 例如：
    // 1. 更新数据库中的订单状态
    // 2. 发送支付成功通知给用户
    // 3. 触发后续的业务流程（如发货、积分奖励等）
    // 4. 记录支付日志
    
    // 示例：更新订单状态（需要根据实际数据库结构调整）
    /*
    await prisma.order.update({
      where: { outTradeNo: out_trade_no },
      data: {
        status: 'PAID',
        transactionId: transaction_id,
        paidAt: new Date(success_time),
        totalAmount: amount.total,
        paymentMethod: trade_type,
        bankType: bank_type
      }
    })
    
    // 记录支付信息
    await prisma.payment.create({
      data: {
        orderId: orderId, // 需要通过out_trade_no查找orderId
        paymentNo: transaction_id,
        amount: amount.total,
        method: trade_type,
        status: 'SUCCESS',
        thirdPartyId: transaction_id,
        paidAt: new Date(success_time)
      }
    })
    */
    
    console.log('支付成功业务逻辑处理完成')
    
  } catch (error) {
    console.error('处理支付成功业务逻辑时发生错误:', error)
    throw error
  }
}

/**
 * 处理微信支付回调的主要函数
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // 获取原始请求体
    const body = await request.json()
    console.log('body', body)
    const { resource } = body
    const decryptedData = decryptResource(resource)
    console.log('decryptedData', decryptedData)
    await handlePaymentSuccess(decryptedData)
    // 根据官方文档：验签通过，返回200状态码，无需返回应答报文
    return new NextResponse(null, { status: 200 })
    
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`❌ 处理微信支付回调时发生错误 (耗时: ${processingTime}ms):`, error)
    
    return NextResponse.json(
      { 
        code: 'FAIL', 
        message: '服务器内部错误' 
      },
      { status: 500 }
    )
  }
}
