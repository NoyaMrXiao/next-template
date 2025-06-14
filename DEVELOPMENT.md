# 开发指南 - 代码重构改进说明

本文档详细说明了项目代码重构的主要改进内容和使用指南。

## 重构改进概述

### 1. 类型系统完善

#### 改进前问题
- 大量使用 `any` 类型
- 缺少统一的类型定义
- 组件 props 类型不明确

#### 改进后效果
- 完善的 TypeScript 类型系统
- 统一的类型定义文件 (`lib/types.ts`)
- 明确的组件接口定义

#### 使用示例
```typescript
// 使用统一的类型定义
import type { Product, Category, ViewMode } from '@/lib/types'

interface ProductCardProps {
  product: Product
  viewMode?: ViewMode
  showBadges?: boolean
  showRating?: boolean
  className?: string
}
```

### 2. 常量管理优化

#### 改进前问题
- 硬编码的配置值散布在各个文件中
- 重复的配置定义
- 缺少统一的配置管理

#### 改进后效果
- 集中的常量配置 (`lib/constants.ts`)
- 分类明确的配置项
- 易于维护和修改

#### 使用示例
```typescript
import { TOAST_CONFIG, DEFAULT_IMAGES, CATEGORY_ICONS } from '@/lib/constants'

// 使用统一的配置
toast.success('操作成功', { style: TOAST_CONFIG.STYLES.SUCCESS })
```

### 3. 工具函数扩展

#### 改进前问题
- 缺少通用的工具函数
- 数据转换逻辑重复
- 验证和格式化函数分散

#### 改进后效果
- 丰富的工具函数库 (`lib/utils.ts`)
- 统一的数据转换函数
- 完善的验证和格式化工具

#### 使用示例
```typescript
import { 
  formatPrice, 
  formatDiscount, 
  transformProducts, 
  validateEmail 
} from '@/lib/utils'

// 格式化价格
const priceText = formatPrice(99.99) // "¥99.99"

// 转换产品数据
const products = transformProducts(rawData)

// 验证邮箱
const isValid = validateEmail('user@example.com')
```

### 4. 错误处理统一

#### 改进前问题
- 缺少统一的错误处理机制
- 错误信息不一致
- 没有错误重试机制

#### 改进后效果
- 统一的错误处理 Hook (`hooks/use-error-handler.ts`)
- 一致的错误信息展示
- 支持错误重试和分类

#### 使用示例
```typescript
import { useErrorHandler } from '@/hooks/use-error-handler'

function MyComponent() {
  const { handleAsyncError, error } = useErrorHandler()
  
  const handleSubmit = async () => {
    const result = await handleAsyncError(
      () => submitData(),
      '提交数据',
      true // 显示错误提示
    )
    
    if (result) {
      // 处理成功结果
    }
  }
  
  return (
    <div>
      {error && <ErrorDisplay error={error} />}
      {/* 组件内容 */}
    </div>
  )
}
```

### 5. 组件架构优化

#### 改进前问题
- 组件职责不清
- 缺少子组件拆分
- 代码可复用性低

#### 改进后效果
- 明确的组件层次结构
- 合理的子组件拆分
- 提高代码复用性

#### 组件结构示例
```typescript
// ===========================================
// 类型定义
// ===========================================
interface ComponentProps {
  // 类型定义
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
  return (
    <div>
      <SubComponent />
    </div>
  )
}
```

### 6. 配置文件改进

#### layout.tsx 优化
- 启用中文字体 (Noto Sans SC)
- 完善的元数据配置
- 统一的 Toast 配置
- 更好的 SEO 支持

#### 使用示例
```typescript
// 完善的元数据配置
export const metadata: Metadata = {
  title: {
    default: APP_METADATA.TITLE,
    template: `%s | ${APP_METADATA.TITLE}`
  },
  description: APP_METADATA.DESCRIPTION,
  keywords: APP_METADATA.KEYWORDS,
  // ... 更多配置
}
```

## 开发最佳实践

### 1. 组件开发流程

1. **定义类型接口**
   ```typescript
   interface ComponentProps {
     // 明确的属性定义
     required: string
     optional?: boolean
     callback?: (value: string) => void
   }
   ```

2. **实现组件逻辑**
   ```typescript
   export function Component({ required, optional = false }: ComponentProps) {
     // 组件实现
   }
   ```

3. **添加样式和交互**
   ```typescript
   const className = cn(
     "基础样式",
     optional && "条件样式",
     props.className
   )
   ```

4. **错误处理和加载状态**
   ```typescript
   const { handleAsyncError } = useErrorHandler()
   const [loading, setLoading] = useState(false)
   ```

### 2. 样式开发规范

1. **使用 Tailwind CSS 预设类**
   ```typescript
   className="bg-white border border-gray-100 hover:border-gray-200 transition-colors"
   ```

2. **响应式设计**
   ```typescript
   className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
   ```

3. **使用 cn() 函数合并样式**
   ```typescript
   className={cn(
     "基础样式",
     variant === 'primary' && "primary样式",
     className
   )}
   ```

### 3. 状态管理模式

1. **局部状态使用 useState**
   ```typescript
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   ```

2. **全局状态使用 Context**
   ```typescript
   const { cart, addItem, removeItem } = useCart()
   const { favorites, toggleFavorite } = useFavorites()
   ```

3. **异步状态使用自定义 Hook**
   ```typescript
   const { data, loading, error, refetch } = useAsyncData(fetchFunction)
   ```

### 4. 数据获取模式

1. **页面级数据获取**
   ```typescript
   async function getPageData() {
     const [data1, data2] = await Promise.all([
       fetchData1(),
       fetchData2()
     ])
     return { data1, data2 }
   }
   ```

2. **组件级数据获取**
   ```typescript
   useEffect(() => {
     const fetchData = async () => {
       const result = await handleAsyncError(
         () => apiCall(),
         '获取数据'
       )
       if (result) setData(result)
     }
     fetchData()
   }, [])
   ```

## 性能优化指南

### 1. 组件优化

```typescript
// 使用 memo 包装纯组件
export const PureComponent = memo(function PureComponent(props) {
  return <div>{props.content}</div>
})

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(props.data)
}, [props.data])

// 使用 useCallback 稳定函数引用
const handleClick = useCallback((id: string) => {
  onItemClick(id)
}, [onItemClick])
```

### 2. 图片优化

```typescript
// 使用 Next.js Image 组件
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  priority={index < 4} // 首屏图片优先加载
/>
```

### 3. 代码分割

```typescript
// 动态导入组件
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <ComponentSkeleton />,
  ssr: false // 如果不需要 SSR
})
```

## 调试和测试

### 1. 开发工具使用

```bash
# 启动开发服务器（支持 Turbopack）
pnpm dev

# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 数据库管理
pnpm db:studio
```

### 2. 错误调试

```typescript
// 使用错误处理 Hook 进行调试
const { error, handleError } = useErrorHandler()

// 手动处理错误
try {
  await riskyOperation()
} catch (error) {
  handleError(error, '操作上下文')
}
```

### 3. 组件测试

```typescript
// 组件测试示例
import { render, screen } from '@testing-library/react'
import { ProductCard } from './product-card'

test('renders product card correctly', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    // ... 其他属性
  }
  
  render(<ProductCard product={mockProduct} />)
  expect(screen.getByText('Test Product')).toBeInTheDocument()
})
```

## 升级和维护

### 1. 依赖更新

```bash
# 检查过期依赖
pnpm outdated

# 更新依赖
pnpm update

# 安全审计
pnpm audit
```

### 2. 代码维护

- 定期重构重复代码
- 更新类型定义
- 优化性能瓶颈
- 改进用户体验

### 3. 文档更新

- 保持 README 文档同步
- 更新组件使用示例
- 记录重要变更
- 维护开发指南

## 总结

通过这次代码重构，项目在以下方面得到了显著改进：

1. **类型安全**: 完善的 TypeScript 类型系统
2. **代码组织**: 清晰的文件结构和模块划分
3. **错误处理**: 统一的错误处理机制
4. **性能优化**: 更好的加载和渲染性能
5. **开发体验**: 更友好的开发和调试环境
6. **维护性**: 更易于维护和扩展的代码结构

这些改进为项目的长期发展奠定了坚实的基础，提高了开发效率和代码质量。 