'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Home, Building, GraduationCap, MapPinIcon } from "lucide-react"
import { useAddress, type Address } from "@/hooks/use-address"
import { AddressForm } from "./address-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AddressSelectorProps {
  className?: string
}

// 地址标签图标映射
const tagIcons = {
  '家': Home,
  '公司': Building,
  '学校': GraduationCap,
  '其他': MapPinIcon
}

export function AddressSelector({ className }: AddressSelectorProps) {
  const {
    addresses,
    selectedAddressId,
    isLoading,
    selectAddress,
    deleteAddress,
    getFullAddress
  } = useAddress()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleAddressAdded = () => {
    setIsAddDialogOpen(false)
    setEditingAddress(null)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setIsAddDialogOpen(true)
  }

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId)
  }

  const getTagIcon = (tag?: string) => {
    const IconComponent = tagIcons[tag as keyof typeof tagIcons] || tagIcons['其他']
    return IconComponent
  }

  return (
    <div className={className}>
      <div className="space-y-3 mb-4">
        {addresses.map((address) => {
          const IconComponent = getTagIcon(address.tag)
          const isSelected = selectedAddressId === address.id
          
          return (
            <div
              key={address.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => selectAddress(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      isSelected
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{address.name}</span>
                    <span className="text-gray-600 text-sm">{address.phone}</span>
                    {address.isDefault && (
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        默认
                      </Badge>
                    )}
                    {address.tag && (
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {address.tag}
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed ml-7">
                    {getFullAddress(address)}
                  </p>
                  {address.postalCode && (
                    <p className="text-gray-500 text-xs mt-1 ml-7">
                      邮编：{address.postalCode}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 ml-4">
                  {/* 编辑按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  
                  {/* 删除按钮 */}
                  {addresses.length > 1 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>确认删除地址</AlertDialogTitle>
                          <AlertDialogDescription>
                            确定要删除这个收货地址吗？此操作无法撤销。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddress(address.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            删除
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 添加新地址按钮 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50"
            onClick={() => setEditingAddress(null)}
          >
            <Plus className="w-4 h-4 mr-2" />
            添加新地址
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? '编辑地址' : '添加新地址'}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSuccess={handleAddressAdded}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}