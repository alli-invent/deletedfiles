export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 8
}

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]{10,}$/
  return re.test(phone)
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateNumber = (value) => {
  return !isNaN(value) && value !== ''
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
