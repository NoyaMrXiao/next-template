
// 分类映射表 - 使用数字ID更高效
export const CATEGORY_MAP = {
    1: { name: "香水类", description: "各种类型的香水产品" },
    2: { name: "家居香氛类", description: "家居香氛相关产品" },
    3: { name: "个护香氛类", description: "个人护理香氛产品" },
    4: { name: "香氛饰品类", description: "香氛相关饰品" },
    5: { name: "香氛礼盒套装类", description: "香氛礼盒和套装" },
    6: { name: "香味文创类", description: "香味主题文创产品" },
    7: { name: "耗材与补充品类", description: "香氛耗材和补充装" }
} as const

// 子分类映射表
export const SUBCATEGORY_MAP = {
    // 香水类 (categoryId: 1)
    101: { categoryId: 1, name: "香精（Parfum）", sort: 1 },
    102: { categoryId: 1, name: "淡香精（Eau de Parfum）", sort: 2 },
    103: { categoryId: 1, name: "淡香水（Eau de Toilette）", sort: 3 },
    104: { categoryId: 1, name: "古龙水（Eau de Cologne）", sort: 4 },
    105: { categoryId: 1, name: "滚珠香水", sort: 5 },
    106: { categoryId: 1, name: "固体香水", sort: 6 },

    // 家居香氛类 (categoryId: 2)
    201: { categoryId: 2, name: "香薰蜡烛", sort: 1 },
    202: { categoryId: 2, name: "藤条香薰", sort: 2 },
    203: { categoryId: 2, name: "空气喷雾", sort: 3 },
    204: { categoryId: 2, name: "香氛仪 / 香薰机", sort: 4 },
    205: { categoryId: 2, name: "香氛挂件（衣柜/车载）", sort: 5 },
    206: { categoryId: 2, name: "精油（单方/复方）", sort: 6 },

    // 个护香氛类 (categoryId: 3)
    301: { categoryId: 3, name: "香氛沐浴露", sort: 1 },
    302: { categoryId: 3, name: "香氛身体乳", sort: 2 },
    303: { categoryId: 3, name: "香氛洗发护发产品", sort: 3 },
    304: { categoryId: 3, name: "香氛护手霜", sort: 4 },
    305: { categoryId: 3, name: "香体喷雾", sort: 5 },

    // 香氛饰品类 (categoryId: 4)
    401: { categoryId: 4, name: "香氛项链 / 手链", sort: 1 },
    402: { categoryId: 4, name: "香氛挂件", sort: 2 },
    403: { categoryId: 4, name: "固态香料珠 / 吊坠芯片", sort: 3 },

    // 香氛礼盒套装类 (categoryId: 5)
    501: { categoryId: 5, name: "香水礼盒", sort: 1 },
    502: { categoryId: 5, name: "家居香氛礼盒", sort: 2 },
    503: { categoryId: 5, name: "旅行香氛套装", sort: 3 },
    504: { categoryId: 5, name: "情绪主题香氛礼盒", sort: 4 },

    // 香味文创类 (categoryId: 6)
    601: { categoryId: 6, name: "香味明信片 / 书签", sort: 1 },
    602: { categoryId: 6, name: "气味笔记本 / 日记本", sort: 2 },
    603: { categoryId: 6, name: "嗅觉盲盒", sort: 3 },
    604: { categoryId: 6, name: "嗅觉图书 / 涂色书", sort: 4 },

    // 耗材与补充品类 (categoryId: 7)
    701: { categoryId: 7, name: "香氛液补充装", sort: 1 },
    702: { categoryId: 7, name: "香芯 / 香片替换装", sort: 2 },
    703: { categoryId: 7, name: "精油补充瓶", sort: 3 }
} as const

// 转换函数：将映射表转换为标准格式
export function convertToStandardFormat() {
    const categories = Object.entries(CATEGORY_MAP).map(([id, info]) => ({
        id: parseInt(id),
        name: info.name,
        description: info.description,
        sort: parseInt(id),
        isActive: true,
        subcategories: Object.entries(SUBCATEGORY_MAP)
            .filter(([_, sub]) => sub.categoryId === parseInt(id))
            .map(([subId, subInfo]) => ({
                id: parseInt(subId),
                name: subInfo.name,
                sort: subInfo.sort,
                isActive: true
            }))
    }))

    return categories
}

// 获取分类统计信息
export function getCategoryStats() {
    const totalCategories = Object.keys(CATEGORY_MAP).length
    const totalSubcategories = Object.keys(SUBCATEGORY_MAP).length

    const categoryBreakdown = Object.entries(CATEGORY_MAP).map(([id, info]) => {
        const subcategoryCount = Object.values(SUBCATEGORY_MAP)
            .filter(sub => sub.categoryId === parseInt(id)).length

        return {
            id: parseInt(id),
            name: info.name,
            subcategoryCount
        }
    })

    return {
        totalCategories,
        totalSubcategories,
        categoryBreakdown
    }
}