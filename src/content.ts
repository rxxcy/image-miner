/// <reference types="chrome"/>

// 监听来自后台脚本的消息
chrome.runtime.onMessage.addListener(
  (
    message: { action: string; imageUrl?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.action === 'copyImageLink' && message.imageUrl) {
      // 复制图片URL到剪贴板
      copyToClipboard(message.imageUrl)

      // 显示一个简短的通知
      showNotification('图片链接已复制到剪贴板！')
    }
  }
)

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 */
function copyToClipboard(text: string): void {
  // 创建一个临时的文本区域元素
  const textarea = document.createElement('textarea')
  textarea.value = text

  // 确保元素不可见
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'

  document.body.appendChild(textarea)
  textarea.select()

  // 执行复制命令
  document.execCommand('copy')

  // 清理DOM
  document.body.removeChild(textarea)
}

/**
 * 显示一个简单的通知
 * @param message 通知消息
 */
function showNotification(message: string): void {
  // 创建通知元素
  const notification = document.createElement('div')

  // 设置样式
  notification.textContent = message
  notification.style.position = 'fixed'
  notification.style.top = '10px'
  notification.style.left = '50%'
  notification.style.transform = 'translateX(-50%)'
  notification.style.backgroundColor = '#4CAF50'
  notification.style.color = 'white'
  notification.style.padding = '10px 20px'
  notification.style.borderRadius = '4px'
  notification.style.zIndex = '10000'
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'

  // 添加到DOM
  document.body.appendChild(notification)

  // 2秒后移除通知
  setTimeout(() => {
    document.body.removeChild(notification)
  }, 2000)
}
