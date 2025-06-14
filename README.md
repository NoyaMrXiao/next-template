# 香氛商城 - 电商平台

一个基于 Next.js 15 的现代化香氛电商平台，提供优雅的购物体验。

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: ShadCN UI
- **数据库**: Prisma ORM
- **状态管理**: React Context API
- **表单验证**: 自定义验证函数
- **通知系统**: React Hot Toast
- **包管理器**: pnpm

## 项目结构

```
├── app/                    # Next.js App Router 目录
│   ├── (admin)/           # 管理员路由组
│   ├── (client)/          # 客户端路由组
│   ├── api/               # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # 组件目录
│   ├── home/             # 首页专用组件
│   ├── ui/               # 通用 UI 组件
│   ├── admin/            # 管理员组件
│   └── product-card.tsx  # 产品卡片组件
├── lib/                  # 工具库
│   ├── types.ts          # TypeScript 类型定义
│   ├── constants.ts      # 应用常量
│   ├── utils.ts          # 工具函数
│   ├── validation.ts     # 验证函数
│   └── *-context.tsx     # React Context
├── hooks/                # 自定义 Hooks
├── actions/              # Server Actions
├── prisma/               # 数据库相关文件
└── public/               # 静态资源
```

## 设计规范

### 代码组织原则

1. **模块化设计**: 每个功能模块独立，便于维护和扩展
2. **类型安全**: 使用 TypeScript 严格类型检查，避免 `any` 类型
3. **组件封装**: 遵循单一职责原则，组件功能明确
4. **常量管理**: 统一管理配置常量，避免硬编码

### 文件命名规范

- **组件文件**: kebab-case (如: `product-card.tsx`)
- **工具文件**: kebab-case (如: `error-handler.ts`)
- **类型文件**: camelCase (如: `types.ts`)
- **常量文件**: camelCase (如: `constants.ts`)

### 组件设计规范

#### 1. 组件结构

```typescript
// ===========================================
// 类型定义
// ===========================================

interface ComponentProps {
  // props 定义
}

// ===========================================
// 子组件
// ===========================================

function SubComponent() {
  // 子组件逻辑
}

// ===========================================
// 主组件
// ===========================================

export function MainComponent(props: ComponentProps) {
  // 主组件逻辑
}
```

#### 2. 组件职责

- **页面组件**: 负责数据获取和页面布局
- **容器组件**: 负责状态管理和业务逻辑
- **展示组件**: 负责纯 UI 展示，接收 props
- **工具组件**: 负责通用功能，如错误处理、加载状态

#### 3. Props 设计

- 使用明确的接口定义
- 提供合理的默认值
- 支持可选属性扩展
- 包含必要的类型注释

### 样式规范

#### 1. Tailwind CSS 使用

- 优先使用 Tailwind 预设类
- 使用 `cn()` 函数合并类名
- 响应式设计优先
- 一致的间距和色彩体系

#### 2. 组件样式

```typescript
// 基础样式类
const baseStyles = "基础样式"

// 变体样式映射
const variants = {
  primary: "主要变体样式",
  secondary: "次要变体样式"
}

// 使用 cn() 合并样式
className={cn(baseStyles, variants[variant], className)}
```

#### 3. 设计系统

- **色彩**: 基于 Tailwind 色彩系统
- **字体**: Noto Sans SC (简体中文优化)
- **间距**: 使用 4px 基础单位系统
- **圆角**: 统一使用 `rounded-lg` 等预设值
- **阴影**: 统一使用 `shadow-sm`、`shadow-md` 等

### 状态管理规范

#### 1. Context 使用

```typescript
// Context 提供者组件
export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  
  const contextValue = useMemo(() => ({
    state,
    actions: {
      // 定义操作方法
    }
  }), [state])
  
  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  )
}

// 自定义 Hook
export function useContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useContext must be used within ContextProvider')
  }
  return context
}
```

#### 2. 状态设计原则

- **单一数据源**: 避免重复状态
- **不可变更新**: 使用展开运算符或 immer
- **错误处理**: 统一的错误状态管理
- **加载状态**: 明确的加载状态指示

### 错误处理规范

#### 1. 统一错误处理

```typescript
// 使用自定义错误处理 Hook
const { handleAsyncError } = useErrorHandler()

// 包装异步操作
const result = await handleAsyncError(
  () => apiCall(),
  '操作上下文',
  true // 是否显示 Toast
)
```

#### 2. 错误边界

- 页面级别的错误边界
- 组件级别的错误恢复
- 友好的错误信息显示
- 错误日志记录

### 性能优化规范

#### 1. 组件优化

- 使用 `memo` 包装纯组件
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 稳定函数引用
- 避免不必要的重新渲染

#### 2. 加载优化

- 图片懒加载和优化
- 代码分割和动态导入
- 预获取关键资源
- 骨架屏加载状态

#### 3. 数据获取

- 并行数据请求
- 缓存策略实施
- 分页和虚拟滚动
- 数据预获取

## 开发指南

### 启动项目

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

### 数据库操作

```bash
# 生成 Prisma 客户端
pnpm db:generate

# 推送数据库结构
pnpm db:push

# 填充种子数据
pnpm db:seed

# 打开数据库管理界面
pnpm db:studio

# 重置数据库
pnpm db:reset
```

### 代码质量

```bash
# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 格式化代码
pnpm format
```

## 最佳实践

### 1. 组件开发

- 先设计接口，再实现功能
- 编写组件文档和使用示例
- 进行单元测试覆盖
- 考虑可访问性 (a11y)

### 2. 性能考虑

- 避免过度优化
- 监控核心性能指标
- 使用 Web Vitals 指标
- 定期性能审计

### 3. 用户体验

- 响应式设计适配
- 加载状态指示
- 错误信息友好
- 交互反馈及时

### 4. 代码维护

- 定期重构优化
- 更新依赖版本
- 监控错误日志
- 收集用户反馈

## 版本信息

- **Node.js**: >= 18.0.0
- **Next.js**: 15.3.3
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Tailwind CSS**: 4.x

## 许可证

MIT License

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码更改
4. 创建 Pull Request
5. 代码审查通过后合并

## 支持

如有问题或建议，请创建 [Issue](https://github.com/your-repo/issues) 或联系开发团队。
