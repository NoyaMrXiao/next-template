// 表单验证工具
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 6) {
    return { isValid: false, message: '密码至少需要6个字符' }
  }
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return { isValid: false, message: '密码必须包含至少一个字母' }
  }
  return { isValid: true }
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

export function validateUsername(username: string): { isValid: boolean; message?: string } {
  if (username.length < 2) {
    return { isValid: false, message: '用户名至少需要2个字符' }
  }
  if (username.length > 20) {
    return { isValid: false, message: '用户名不能超过20个字符' }
  }
  if (!/^[a-zA-Z0-9\u4e00-\u9fa5_]+$/.test(username)) {
    return { isValid: false, message: '用户名只能包含字母、数字、中文和下划线' }
  }
  return { isValid: true }
}