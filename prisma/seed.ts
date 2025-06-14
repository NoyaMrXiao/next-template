import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始导入分类数据...')

  // 商品分类数据
  const categoriesData = [
    {
      "category": "香水类",
      "subcategories": [
        "香精（Parfum）",
        "淡香精（Eau de Parfum）",
        "淡香水（Eau de Toilette）",
        "古龙水（Eau de Cologne）",
        "滚珠香水",
        "固体香水"
      ]
    },
    {
      "category": "家居香氛类",
      "subcategories": [
        "香薰蜡烛",
        "藤条香薰",
        "空气喷雾",
        "香氛仪 / 香薰机",
        "香氛挂件（衣柜/车载）",
        "精油（单方/复方）"
      ]
    },
    {
      "category": "个护香氛类",
      "subcategories": [
        "香氛沐浴露",
        "香氛身体乳",
        "香氛洗发护发产品",
        "香氛护手霜",
        "香体喷雾"
      ]
    },
    {
      "category": "香氛饰品类",
      "subcategories": [
        "香氛项链 / 手链",
        "香氛挂件",
        "固态香料珠 / 吊坠芯片"
      ]
    },
    {
      "category": "香氛礼盒套装类",
      "subcategories": [
        "香水礼盒",
        "家居香氛礼盒",
        "旅行香氛套装",
        "情绪主题香氛礼盒"
      ]
    },
    {
      "category": "香味文创类",
      "subcategories": [
        "香味明信片 / 书签",
        "气味笔记本 / 日记本",
        "嗅觉盲盒",
        "嗅觉图书 / 涂色书"
      ]
    },
    {
      "category": "耗材与补充品类",
      "subcategories": [
        "香氛液补充装",
        "香芯 / 香片替换装",
        "精油补充瓶"
      ]
    }
  ]

  // 插入分类和子分类数据
  for (const [index, categoryData] of categoriesData.entries()) {
    // 创建主分类
    const category = await prisma.category.create({
      data: {
        name: categoryData.category,
        sort: index + 1,
        isActive: true
      }
    })

    console.log(`✅ 已创建分类: ${category.name}`)

    // 创建子分类
    for (const [subIndex, subcategoryName] of categoryData.subcategories.entries()) {
      const subcategory = await prisma.subcategory.create({
        data: {
          categoryId: category.id,
          name: subcategoryName,
          sort: subIndex + 1,
          isActive: true
        }
      })

      console.log(`   ↳ 子分类: ${subcategory.name}`)
    }
  }

  // 创建一个示例用户
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: '演示用户',
      phone: '13800138000'
    }
  })

  console.log(`✅ 已创建演示用户: ${user.name}`)

  // 为用户创建一个默认地址
  await prisma.address.create({
    data: {
      userId: user.id,
      name: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '某街道某小区某号楼某单元某室',
      postcode: '100000',
      isDefault: true
    }
  })

  console.log('✅ 已创建演示地址')

  // 创建一些示例商品
  const perfumeCategory = await prisma.category.findFirst({
    where: { name: '香水类' }
  })

  const parfumSubcategory = await prisma.subcategory.findFirst({
    where: { name: '香精（Parfum）' }
  })

  if (perfumeCategory && parfumSubcategory) {
    await prisma.product.create({
      data: {
        categoryId: perfumeCategory.id,
        subcategoryId: parfumSubcategory.id,
        name: 'Chanel No.5 香精',
        description: '经典法式香水，优雅与奢华的完美结合',
        content: '<p>这是一款经典的法式香水，拥有独特而迷人的香调...</p>',
        brand: 'Chanel',
        sku: 'CHANEL-NO5-50ML',
        price: 1299.00,
        originalPrice: 1599.00,
        stock: 100,
        minStock: 10,
        weight: 0.2,
        volume: '50ml',
        images: [
          '/images/chanel-no5-1.jpg',
          '/images/chanel-no5-2.jpg'
        ],
        tags: ['经典', '法式', '优雅', '奢华'],
        isActive: true,
        isFeatured: true,
        sort: 1
      }
    })

    console.log('✅ 已创建示例商品: Chanel No.5 香精')
  }

  console.log('🎉 数据导入完成！')
}

main()
  .catch((e) => {
    console.error('❌ 数据导入失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 