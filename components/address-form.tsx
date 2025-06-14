'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAddress, type Address } from "@/hooks/use-address"
import { toast } from 'react-hot-toast'

interface AddressFormProps {
  address?: Address | null
  onSuccess: () => void
  onCancel: () => void
}

// 省份数据
const provinces = [
  '北京市', '上海市', '天津市', '重庆市',
  '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
  '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
  '河南省', '湖北省', '湖南省', '广东省', '海南省',
  '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省',
  '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
  '香港特别行政区', '澳门特别行政区', '台湾省'
]

// 城市数据（简化版，实际项目中应该使用完整的省市区数据）
const cityMap: Record<string, string[]> = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '天津市': ['天津市'],
  '重庆市': ['重庆市'],
  '广东省': ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '韶关市', '湛江市', '肇庆市', '江门市', '茂名市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'],
  '江苏省': ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'],
  // 其他省份可以继续添加...
}

// 区县数据（简化版）
const districtMap: Record<string, string[]> = {
  '北京市': ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
  '广州市': ['荔湾区', '越秀区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区', '南沙区', '从化区', '增城区'],
  '深圳市': ['罗湖区', '福田区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区', '光明区', '大鹏新区'],
  '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
  // 其他城市可以继续添加...
}

// 地址标签选项
const tagOptions = [
  { value: '家', label: '家' },
  { value: '公司', label: '公司' },
  { value: '学校', label: '学校' },
  { value: '其他', label: '其他' }
]

export function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const { addAddress, updateAddress } = useAddress()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
    detailAddress: '',
    postalCode: '',
    isDefault: false,
    tag: '家'
  })

  // 可选的城市和区县
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])

  // 初始化表单数据
  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name,
        phone: address.phone,
        province: address.province,
        city: address.city,
        district: address.district,
        street: address.street,
        detailAddress: address.detailAddress,
        postalCode: address.postalCode || '',
        isDefault: address.isDefault,
        tag: address.tag || '家'
      })
    }
  }, [address])

  // 省份变化时更新城市选项
  useEffect(() => {
    if (formData.province) {
      const cities = cityMap[formData.province] || []
      setAvailableCities(cities)
      
      // 如果当前选中的城市不在新的城市列表中，清空城市和区县
      if (!cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '', district: '' }))
        setAvailableDistricts([])
      }
    } else {
      setAvailableCities([])
      setAvailableDistricts([])
    }
  }, [formData.province])

  // 城市变化时更新区县选项
  useEffect(() => {
    if (formData.city) {
      const districts = districtMap[formData.city] || []
      setAvailableDistricts(districts)
      
      // 如果当前选中的区县不在新的区县列表中，清空区县
      if (!districts.includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: '' }))
      }
    } else {
      setAvailableDistricts([])
    }
  }, [formData.city])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const required = ['name', 'phone', 'province', 'city', 'district', 'detailAddress']
    const missing = required.filter(field => !formData[field as keyof typeof formData])
    
    if (missing.length > 0) {
      toast.error('请填写所有必填项')
      return false
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('请输入正确的手机号码')
      return false
    }

    // 验证邮编格式（如果填写了）
    if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) {
      toast.error('请输入正确的邮政编码')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const addressData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        province: formData.province,
        city: formData.city,
        district: formData.district,
        street: formData.street.trim(),
        detailAddress: formData.detailAddress.trim(),
        postalCode: formData.postalCode.trim() || undefined,
        isDefault: formData.isDefault,
        tag: formData.tag
      }

      if (address) {
        // 更新地址
        updateAddress(address.id, addressData)
        toast.success('地址更新成功')
      } else {
        // 添加新地址
        addAddress(addressData)
        toast.success('地址添加成功')
      }

      onSuccess()
    } catch (error) {
      toast.error('操作失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 姓名和手机号 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">收货人姓名 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="请输入收货人姓名"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">手机号码 *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="请输入手机号码"
            className="mt-1"
          />
        </div>
      </div>

      {/* 省市区 */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="province">省份 *</Label>
          <Select
            value={formData.province}
            onValueChange={(value) => handleInputChange('province', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择省份" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="city">城市 *</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => handleInputChange('city', value)}
            disabled={!formData.province}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择城市" />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="district">区县 *</Label>
          <Select
            value={formData.district}
            onValueChange={(value) => handleInputChange('district', value)}
            disabled={!formData.city}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="选择区县" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 街道 */}
      <div>
        <Label htmlFor="street">街道/乡镇</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          placeholder="请输入街道或乡镇名称"
          className="mt-1"
        />
      </div>

      {/* 详细地址 */}
      <div>
        <Label htmlFor="detailAddress">详细地址 *</Label>
        <Textarea
          id="detailAddress"
          value={formData.detailAddress}
          onChange={(e) => handleInputChange('detailAddress', e.target.value)}
          placeholder="请输入详细地址，如门牌号、楼层、房间号等"
          className="mt-1"
          rows={3}
        />
      </div>

      {/* 邮编和标签 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postalCode">邮政编码</Label>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="请输入邮政编码"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="tag">地址标签</Label>
          <Select
            value={formData.tag}
            onValueChange={(value) => handleInputChange('tag', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tagOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 设为默认地址 */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isDefault"
          checked={formData.isDefault}
          onCheckedChange={(checked) => handleInputChange('isDefault', checked)}
        />
        <Label htmlFor="isDefault">设为默认地址</Label>
      </div>

      {/* 按钮 */}
      <div className="flex space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          取消
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-rose-500 hover:bg-rose-600"
        >
          {isSubmitting ? '保存中...' : (address ? '更新地址' : '添加地址')}
        </Button>
      </div>
    </form>
  )
} 