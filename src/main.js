// 图片链接复制器前端入口文件
// 注意：CSS已通过HTML中的link标签引入，不需要在这里导入
// import './styles/main.css'

// API基础URL
const API_BASE_URL = 'http://localhost:3000'

// 存储用户信息和令牌
let userInfo = null
let token = localStorage.getItem('token')

// 全局状态
const state = {
  isAuthenticated: !!token,
  loading: false,
  stats: {
    requestCount: 0,
    uptime: '',
  },
  categories: [],
  pictures: [],
}

// API请求工具
const api = {
  /**
   * 发送API请求
   * @param {string} endpoint - API端点
   * @param {Object} options - 请求选项
   * @returns {Promise<any>} 响应数据
   */
  async request(endpoint, options = {}) {
    state.loading = true

    const url = `${API_BASE_URL}${endpoint}`

    // 默认请求头
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // 如果有token，添加到请求头
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      // 检查API响应状态
      if (data.code !== 200) {
        throw new Error(data.message || '请求失败')
      }

      return data.data
    } catch (error) {
      console.error('API请求错误:', error)
      showMessage(error.message || '网络错误', 'error')
      throw error
    } finally {
      state.loading = false
    }
  },

  // 获取API状态信息
  async getStats() {
    const data = await this.request('/')
    state.stats = data.stats
    updateStatsDisplay()
    return data
  },

  // 用户登录
  async login(username, password) {
    const data = await this.request('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    // 保存token和用户信息
    token = data.token
    userInfo = data.user
    localStorage.setItem('token', token)
    state.isAuthenticated = true

    return data
  },

  // 用户注册
  async register(username, password, email) {
    return await this.request('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    })
  },

  // 获取分类列表
  async getCategories() {
    const data = await this.request('/api/categories')
    state.categories = data.categories
    return data
  },

  // 获取图片列表
  async getPictures(categoryId = null) {
    let endpoint = '/api/pictures'
    if (categoryId) {
      endpoint += `?categoryId=${categoryId}`
    }

    const data = await this.request(endpoint)
    state.pictures = data.pictures
    return data
  },

  // 上传图片
  async uploadPicture(formData) {
    return await this.request('/api/pictures', {
      method: 'POST',
      headers: {}, // 让浏览器自动设置multipart/form-data
      body: formData,
    })
  },
}

// UI更新函数
function updateStatsDisplay() {
  const statsElement = document.getElementById('server-stats')
  if (statsElement) {
    statsElement.innerHTML = `
      <p>请求次数: ${state.stats.requestCount}</p>
      <p>在线时长: ${state.stats.uptime}</p>
    `
  }
}

// 显示消息提示
function showMessage(message, type = 'info') {
  const messageElement = document.createElement('div')
  messageElement.className = `message message-${type}`
  messageElement.textContent = message

  document.body.appendChild(messageElement)

  // 3秒后自动移除
  setTimeout(() => {
    messageElement.remove()
  }, 3000)
}

// 初始化应用
async function initApp() {
  try {
    // 获取服务器状态
    await api.getStats()

    // 检查用户是否已登录
    if (token) {
      try {
        // 验证token有效性
        const userData = await api.request('/api/users/profile')
        userInfo = userData.user
        renderAuthenticatedUI()
      } catch (error) {
        // Token无效
        localStorage.removeItem('token')
        token = null
        state.isAuthenticated = false
        renderLoginUI()
      }
    } else {
      renderLoginUI()
    }

    // 设置定期刷新服务器状态
    setInterval(() => {
      api.getStats()
    }, 30000) // 每30秒更新一次
  } catch (error) {
    console.error('初始化应用失败:', error)
    showMessage('连接服务器失败，请稍后再试', 'error')
  }
}

// 渲染已登录界面
function renderAuthenticatedUI() {
  const appContainer = document.getElementById('app')
  if (!appContainer) return

  appContainer.innerHTML = `
    <header>
      <h1>图片链接复制器</h1>
      <div class="user-info">
        欢迎，${userInfo.username} | <button id="logout-btn">登出</button>
      </div>
    </header>
    
    <div class="stats-container" id="server-stats"></div>
    
    <main>
      <div class="categories" id="categories-list"></div>
      <div class="pictures" id="pictures-list"></div>
    </main>
  `

  // 更新状态显示
  updateStatsDisplay()

  // 绑定登出按钮事件
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token')
    token = null
    userInfo = null
    state.isAuthenticated = false
    renderLoginUI()
  })

  // 加载分类和图片
  loadCategoriesAndPictures()
}

// 渲染登录界面
function renderLoginUI() {
  const appContainer = document.getElementById('app')
  if (!appContainer) return

  appContainer.innerHTML = `
    <header>
      <h1>图片链接复制器</h1>
    </header>
    
    <div class="stats-container" id="server-stats"></div>
    
    <main class="auth-container">
      <div class="tabs">
        <button class="tab-btn active" id="login-tab">登录</button>
        <button class="tab-btn" id="register-tab">注册</button>
      </div>
      
      <div class="tab-content active" id="login-form">
        <form id="login">
          <div class="form-group">
            <label for="login-username">用户名</label>
            <input type="text" id="login-username" required>
          </div>
          <div class="form-group">
            <label for="login-password">密码</label>
            <input type="password" id="login-password" required>
          </div>
          <button type="submit">登录</button>
        </form>
      </div>
      
      <div class="tab-content" id="register-form">
        <form id="register">
          <div class="form-group">
            <label for="register-username">用户名</label>
            <input type="text" id="register-username" required>
          </div>
          <div class="form-group">
            <label for="register-email">邮箱</label>
            <input type="email" id="register-email" required>
          </div>
          <div class="form-group">
            <label for="register-password">密码</label>
            <input type="password" id="register-password" required>
          </div>
          <button type="submit">注册</button>
        </form>
      </div>
    </main>
  `

  // 更新状态显示
  updateStatsDisplay()

  // 绑定表单切换事件
  document.getElementById('login-tab').addEventListener('click', () => {
    document.getElementById('login-tab').classList.add('active')
    document.getElementById('register-tab').classList.remove('active')
    document.getElementById('login-form').classList.add('active')
    document.getElementById('register-form').classList.remove('active')
  })

  document.getElementById('register-tab').addEventListener('click', () => {
    document.getElementById('login-tab').classList.remove('active')
    document.getElementById('register-tab').classList.add('active')
    document.getElementById('login-form').classList.remove('active')
    document.getElementById('register-form').classList.add('active')
  })

  // 绑定登录表单提交事件
  document.getElementById('login').addEventListener('submit', async e => {
    e.preventDefault()

    const username = document.getElementById('login-username').value
    const password = document.getElementById('login-password').value

    try {
      await api.login(username, password)
      renderAuthenticatedUI()
      showMessage('登录成功')
    } catch (error) {
      showMessage('登录失败: ' + error.message, 'error')
    }
  })

  // 绑定注册表单提交事件
  document.getElementById('register').addEventListener('submit', async e => {
    e.preventDefault()

    const username = document.getElementById('register-username').value
    const email = document.getElementById('register-email').value
    const password = document.getElementById('register-password').value

    try {
      await api.register(username, password, email)
      showMessage('注册成功，请登录')

      // 切换到登录标签
      document.getElementById('login-tab').click()

      // 自动填充用户名
      document.getElementById('login-username').value = username
    } catch (error) {
      showMessage('注册失败: ' + error.message, 'error')
    }
  })
}

// 加载分类和图片
async function loadCategoriesAndPictures() {
  try {
    // 加载分类
    await api.getCategories()

    const categoriesElement = document.getElementById('categories-list')
    if (categoriesElement) {
      categoriesElement.innerHTML = `
        <h2>分类</h2>
        <ul>
          <li><button class="category-btn active" data-id="all">所有图片</button></li>
          ${state.categories
            .map(
              category => `
            <li><button class="category-btn" data-id="${category.id}">${category.name}</button></li>
          `
            )
            .join('')}
        </ul>
        <button id="add-category-btn" class="add-btn">添加分类</button>
      `

      // 绑定分类点击事件
      document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          // 更新活动状态
          document
            .querySelectorAll('.category-btn')
            .forEach(b => b.classList.remove('active'))
          btn.classList.add('active')

          // 加载该分类下的图片
          const categoryId = btn.dataset.id === 'all' ? null : btn.dataset.id
          await api.getPictures(categoryId)
          renderPictures()
        })
      })

      // 绑定添加分类按钮事件
      document
        .getElementById('add-category-btn')
        .addEventListener('click', () => {
          // 显示添加分类表单
          // TODO: 实现添加分类功能
        })
    }

    // 加载所有图片
    await api.getPictures()
    renderPictures()
  } catch (error) {
    console.error('加载数据失败:', error)
    showMessage('加载数据失败，请稍后再试', 'error')
  }
}

// 渲染图片列表
function renderPictures() {
  const picturesElement = document.getElementById('pictures-list')
  if (!picturesElement) return

  if (state.pictures.length === 0) {
    picturesElement.innerHTML = `
      <h2>图片</h2>
      <div class="empty-state">
        <p>没有找到图片</p>
        <button id="upload-btn" class="add-btn">上传图片</button>
      </div>
    `
  } else {
    picturesElement.innerHTML = `
      <h2>图片</h2>
      <div class="pictures-grid">
        ${state.pictures
          .map(
            picture => `
          <div class="picture-card">
            <img src="${picture.url}" alt="${picture.title}" />
            <div class="picture-info">
              <h3>${picture.title}</h3>
              <p>${picture.description || ''}</p>
              <button class="copy-btn" data-url="${
                picture.url
              }">复制链接</button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
      <button id="upload-btn" class="add-btn">上传图片</button>
    `
  }

  // 绑定复制链接按钮事件
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showMessage('链接已复制到剪贴板')
        })
        .catch(() => {
          showMessage('复制失败，请手动复制', 'error')
        })
    })
  })

  // 绑定上传图片按钮事件
  document.getElementById('upload-btn').addEventListener('click', () => {
    // 显示上传图片表单
    // TODO: 实现上传图片功能
  })
}

// 在DOM加载完毕后初始化应用
document.addEventListener('DOMContentLoaded', initApp)
