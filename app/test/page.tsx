'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import QRCode from 'qrcode'

const TestPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [paymentUrl, setPaymentUrl] = useState<string>('')

  const handleClick = async () => {
    setIsLoading(true)
    setQrCodeUrl('')
    setPaymentUrl('')
    
    try {
      // 生成唯一订单号
      const outTradeNo = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const result = await fetch('/api/wechat-pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: '测试支付',
          outTradeNo: outTradeNo,
          total: 10
        })
      })
      
      const data = await result.json()
      console.log('支付结果:', data)
      
      if (data.codeUrl) {
        setPaymentUrl(data.codeUrl)
        // 生成二维码
        const qrDataUrl = await QRCode.toDataURL(data.codeUrl, {
          width: 256,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        setQrCodeUrl(qrDataUrl)
      } else if (data.error) {
        alert(`支付失败: ${JSON.stringify(data.error)}`)
      }
    } catch (error) {
      console.error('请求失败:', error)
      alert(`请求失败: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">微信支付测试</h1>
        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? '生成中...' : '测试微信支付'}
        </Button>
      </div>

      {qrCodeUrl && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-2">请使用微信扫码支付</h2>
            <p className="text-sm text-gray-600 mb-4">支付金额: ¥1.00</p>
          </div>
          
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-md">
            <img 
              src={qrCodeUrl} 
              alt="微信支付二维码" 
              className="w-64 h-64"
            />
          </div>
          
          <div className="text-center max-w-md">
            <p className="text-xs text-gray-500 break-all">
              支付链接: {paymentUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestPage