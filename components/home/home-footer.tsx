export function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">香氛商城</h3>
            <p className="text-gray-300 text-sm">
              专业的香氛购物平台<br />
              优质产品，贴心服务
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">商品分类</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>香水系列</li>
              <li>家居香氛</li>
              <li>个护香氛</li>
              <li>香氛饰品</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">客户服务</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>配送说明</li>
              <li>退换政策</li>
              <li>常见问题</li>
              <li>联系我们</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">关注我们</h4>
            <p className="text-gray-300 text-sm mb-2">
              客服热线：400-123-4567
            </p>
            <p className="text-gray-300 text-sm">
              营业时间：9:00-21:00
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2024 香氛商城. 保留所有权利.
        </div>
      </div>
    </footer>
  )
} 