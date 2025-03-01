/// <reference types="chrome"/>

// 定义菜单项ID
const CONTEXT_MENU_ID = 'copyImageLink'

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: '获取图片链接',
    contexts: ['image'],
  })
})

// 监听菜单点击事件
chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID && tab?.id) {
      // 获取图片URL
      const imageUrl = info.srcUrl

      // 向内容脚本发送消息，请求复制链接
      chrome.tabs.sendMessage(tab.id, {
        action: 'copyImageLink',
        imageUrl: imageUrl,
      })
    }
  }
)
