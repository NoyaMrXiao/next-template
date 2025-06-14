'use client'

import { useState, useEffect } from 'react'

export interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  street: string
  detailAddress: string
  postalCode?: string
  isDefault: boolean
  tag?: string // 家、公司、学校等标签
}

interface UseAddressReturn {
  addresses: Address[]
  selectedAddressId: string | null
  isLoading: boolean
  addAddress: (address: Omit<Address, 'id'>) => void
  updateAddress: (id: string, address: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  selectAddress: (id: string) => void
  getSelectedAddress: () => Address | null
  getFullAddress: (address: Address) => string
}

const STORAGE_KEY = 'user_addresses'
const SELECTED_ADDRESS_KEY = 'selected_address_id'

// 真实的中国地址数据示例
const defaultAddresses: Address[] = [
  {
    id: '1',
    name: '张三',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    street: '三里屯街道',
    detailAddress: '工体北路8号院1号楼101室',
    postalCode: '100027',
    isDefault: true,
    tag: '家'
  },
  {
    id: '2',
    name: '李四',
    phone: '13900139000',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    street: '陆家嘴街道',
    detailAddress: '世纪大道1000号环球金融中心88层',
    postalCode: '200120',
    isDefault: false,
    tag: '公司'
  },
  {
    id: '3',
    name: '王五',
    phone: '13700137000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    street: '粤海街道',
    detailAddress: '科技园南区深南大道10000号腾讯大厦',
    postalCode: '518057',
    isDefault: false,
    tag: '公司'
  },
  {
    id: '4',
    name: '赵六',
    phone: '13600136000',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    street: '文三路街道',
    detailAddress: '文三路269号阿里巴巴西溪园区',
    postalCode: '310013',
    isDefault: false,
    tag: '公司'
  }
]

export function useAddress(): UseAddressReturn {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 初始化地址数据
  useEffect(() => {
    const loadAddresses = () => {
      try {
        const storedAddresses = localStorage.getItem(STORAGE_KEY)
        const storedSelectedId = localStorage.getItem(SELECTED_ADDRESS_KEY)
        
        if (storedAddresses) {
          const parsedAddresses = JSON.parse(storedAddresses)
          setAddresses(parsedAddresses)
          
          // 设置选中的地址
          if (storedSelectedId && parsedAddresses.find((addr: Address) => addr.id === storedSelectedId)) {
            setSelectedAddressId(storedSelectedId)
          } else {
            // 如果没有选中地址或选中的地址不存在，选择默认地址
            const defaultAddr = parsedAddresses.find((addr: Address) => addr.isDefault)
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id)
            } else if (parsedAddresses.length > 0) {
              setSelectedAddressId(parsedAddresses[0].id)
            }
          }
        } else {
          // 首次使用，设置默认地址
          setAddresses(defaultAddresses)
          setSelectedAddressId(defaultAddresses[0].id)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAddresses))
          localStorage.setItem(SELECTED_ADDRESS_KEY, defaultAddresses[0].id)
        }
      } catch (error) {
        console.error('加载地址数据失败:', error)
        // 出错时使用默认数据
        setAddresses(defaultAddresses)
        setSelectedAddressId(defaultAddresses[0].id)
      } finally {
        setIsLoading(false)
      }
    }

    loadAddresses()
  }, [])

  // 添加地址
  const addAddress = (addressData: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }

    let newAddresses = [...addresses, newAddress]

    // 如果设置为默认地址，取消其他地址的默认状态
    if (newAddress.isDefault) {
      newAddresses = newAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }))
    }

    // 立即更新状态
    setAddresses(newAddresses)
    
    // 保存到localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses))
    } catch (error) {
      console.error('保存地址失败:', error)
    }

    // 如果是第一个地址或设置为默认，自动选中
    if (addresses.length === 0 || newAddress.isDefault) {
      setSelectedAddressId(newAddress.id)
      try {
        localStorage.setItem(SELECTED_ADDRESS_KEY, newAddress.id)
      } catch (error) {
        console.error('保存选中地址失败:', error)
      }
    }
  }

  // 更新地址
  const updateAddress = (id: string, updates: Partial<Address>) => {
    let newAddresses = addresses.map(addr => 
      addr.id === id ? { ...addr, ...updates } : addr
    )

    // 如果更新的地址设置为默认，取消其他地址的默认状态
    if (updates.isDefault) {
      newAddresses = newAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    }

    // 立即更新状态
    setAddresses(newAddresses)
    
    // 保存到localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses))
    } catch (error) {
      console.error('保存地址失败:', error)
    }
  }

  // 删除地址
  const deleteAddress = (id: string) => {
    const newAddresses = addresses.filter(addr => addr.id !== id)
    
    // 立即更新状态
    setAddresses(newAddresses)
    
    // 保存到localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses))
    } catch (error) {
      console.error('保存地址失败:', error)
    }

    // 如果删除的是当前选中的地址，重新选择
    if (selectedAddressId === id) {
      if (newAddresses.length > 0) {
        const defaultAddr = newAddresses.find(addr => addr.isDefault) || newAddresses[0]
        setSelectedAddressId(defaultAddr.id)
        try {
          localStorage.setItem(SELECTED_ADDRESS_KEY, defaultAddr.id)
        } catch (error) {
          console.error('保存选中地址失败:', error)
        }
      } else {
        setSelectedAddressId(null)
        try {
          localStorage.removeItem(SELECTED_ADDRESS_KEY)
        } catch (error) {
          console.error('删除选中地址失败:', error)
        }
      }
    }
  }

  // 设置默认地址
  const setDefaultAddress = (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }))
    
    // 立即更新状态
    setAddresses(newAddresses)
    
    // 保存到localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddresses))
    } catch (error) {
      console.error('保存地址失败:', error)
    }
  }

  // 选择地址
  const selectAddress = (id: string) => {
    if (addresses.find(addr => addr.id === id)) {
      setSelectedAddressId(id)
      try {
        localStorage.setItem(SELECTED_ADDRESS_KEY, id)
      } catch (error) {
        console.error('保存选中地址失败:', error)
      }
    }
  }

  // 获取当前选中的地址
  const getSelectedAddress = (): Address | null => {
    if (!selectedAddressId) return null
    return addresses.find(addr => addr.id === selectedAddressId) || null
  }

  // 获取完整地址字符串
  const getFullAddress = (address: Address): string => {
    return `${address.province}${address.city}${address.district}${address.street}${address.detailAddress}`
  }

  return {
    addresses,
    selectedAddressId,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    getSelectedAddress,
    getFullAddress
  }
} 