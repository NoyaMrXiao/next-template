# Stripe 支付集成配置

## 环境变量配置

在您的项目根目录创建 `.env.local` 文件，并添加以下环境变量：

```env
# Stripe 支付配置
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 获取 Stripe API 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 登录或注册账户
3. 进入 "开发者" -> "API密钥" 页面
4. 复制 "可发布密钥" 和 "密钥"
5. 将这些密钥添加到 `.env.local` 文件中

## 支付功能说明

### 功能特性

- ✅ 安全的信用卡支付
- ✅ 实时支付状态更新
- ✅ 支付成功/失败处理
- ✅ 订单状态自动更新
- ✅ 错误处理和用户提示
- ✅ 支付表单验证

### 支持的支付方式

- 信用卡（Visa, MasterCard, American Express）
- 借记卡
- 其他 Stripe 支持的支付方式（可扩展）

### 使用流程

1. 用户在订单列表中找到 "待支付" 状态的订单
2. 点击 "立即支付" 按钮
3. 系统创建支付意图
4. 弹出支付表单
5. 用户填写信用卡信息
6. 确认支付
7. 系统处理支付结果并更新订单状态

## 安全说明

- 所有支付信息通过 SSL 加密传输
- 不在本地存储任何敏感支付信息
- 使用 Stripe 的安全支付处理
- 支付表单符合 PCI DSS 标准

## 测试

使用以下测试卡号进行测试：

- **成功支付**: 4242 4242 4242 4242
- **需要验证**: 4000 0025 0000 3155
- **被拒绝**: 4000 0000 0000 0002

测试卡的其他信息：
- 过期日期：任何未来日期
- CVC：任何3位数字
- 邮编：任何5位数字

## 生产环境

1. 将测试API密钥替换为生产API密钥
2. 配置 Webhook 端点（可选）
3. 更新支付设置和业务规则
4. 进行充分的测试

## Webhook 配置（可选）

如需接收支付状态的实时通知，可以配置 Webhook：

1. 在 Stripe Dashboard 中添加 Webhook 端点
2. 设置端点 URL：`https://yourdomain.com/api/webhooks/stripe`
3. 选择需要监听的事件
4. 将 Webhook 签名密钥添加到环境变量

## 故障排除

### 常见问题

1. **支付按钮无响应**
   - 检查环境变量是否正确配置
   - 确认 Stripe 密钥有效

2. **支付失败**
   - 检查网络连接
   - 验证测试卡号
   - 查看浏览器控制台错误

3. **环境变量未生效**
   - 重启开发服务器
   - 检查 `.env.local` 文件格式

### 调试模式

在开发环境中，所有支付相关的日志都会输出到控制台，方便调试。

## 技术栈

- **前端**: Next.js 15 + TypeScript
- **支付**: Stripe + @stripe/stripe-js + @stripe/react-stripe-js
- **UI**: Tailwind CSS + ShadCN UI
- **状态管理**: React Hooks
- **表单**: React Hook Form（可扩展） 