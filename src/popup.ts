/// <reference types="chrome"/>

// DOM元素
const loginForm = document.getElementById('login-form') as HTMLDivElement
const loggedInView = document.getElementById('logged-in-view') as HTMLDivElement
const usernameInput = document.getElementById('username') as HTMLInputElement
const passwordInput = document.getElementById('password') as HTMLInputElement
const loginButton = document.getElementById('login-button') as HTMLButtonElement
const logoutButton = document.getElementById(
  'logout-button'
) as HTMLButtonElement
const statusMessage = document.getElementById(
  'status-message'
) as HTMLDivElement
const loggedUsername = document.getElementById(
  'logged-username'
) as HTMLSpanElement

// 简单的身份验证模拟（实际应用中应该使用更安全的方式）
interface User {
  username: string
  isLoggedIn: boolean
}

// 保存用户登录状态
function saveUserState(user: User): void {
  chrome.storage.local.set({ user: user }, () => {
    console.log('用户状态已保存')
  })
}

// 加载用户登录状态
function loadUserState(): void {
  chrome.storage.local.get(['user'], result => {
    const user = result.user as User | undefined
    if (user && user.isLoggedIn) {
      showLoggedInView(user.username)
    } else {
      showLoginForm()
    }
  })
}

// 显示登录表单
function showLoginForm(): void {
  loginForm.style.display = 'block'
  loggedInView.style.display = 'none'
}

// 显示已登录界面
function showLoggedInView(username: string): void {
  loginForm.style.display = 'none'
  loggedInView.style.display = 'block'
  loggedUsername.textContent = username
}

// 处理登录
function handleLogin(): void {
  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()

  if (!username || !password) {
    statusMessage.textContent = '请输入用户名和密码'
    statusMessage.classList.add('error')
    return
  }

  // 这里应该是实际的身份验证逻辑
  // 这里只是一个示例，任何用户名和密码组合都会通过
  statusMessage.textContent = '登录中...'
  statusMessage.classList.remove('error')

  // 模拟网络请求延迟
  setTimeout(() => {
    // 登录成功
    const user: User = { username, isLoggedIn: true }
    saveUserState(user)
    showLoggedInView(username)
  }, 1000)
}

// 处理退出登录
function handleLogout(): void {
  // 清除用户状态
  saveUserState({ username: '', isLoggedIn: false })
  // 重置表单
  usernameInput.value = ''
  passwordInput.value = ''
  statusMessage.textContent = ''
  // 显示登录表单
  showLoginForm()
}

// 事件监听器
loginButton.addEventListener('click', handleLogin)
logoutButton.addEventListener('click', handleLogout)

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', loadUserState)
