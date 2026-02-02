/**
 * Google Chat Shortcut for Google Sheets
 * 
 * GoogleスプレッドシートにGoogle Chatへのショートカットボタンを追加します。
 * 方式: 画面右端に固定のフローティングボタンを表示
 */

(function () {
  'use strict';

  // ================================
  // 定数定義
  // ================================
  const BUTTON_ID = 'google-chat-shortcut-btn';
  const CHAT_URL = 'https://chat.google.com/';

  // ポップアップウィンドウの設定
  const POPUP_CONFIG = {
    width: 400,
    height: Math.floor(window.screen.availHeight * 0.9),
  };

  // Google Chat風SVGアイコン
  const CHAT_ICON_SVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H6L2 24V6C2 4.9 2.9 4 4 4Z" fill="#00AC47"/>
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="white"/>
    </svg>
  `;

  // デバッグログ
  function log(msg, ...args) {
    console.log(`%c[Chat Shortcut] ${msg}`, 'color: #00AC47; font-weight: bold;', ...args);
  }

  // ================================
  // ボタンが既に存在するかチェック
  // ================================
  function isButtonAlreadyAdded() {
    return document.getElementById(BUTTON_ID) !== null;
  }

  // ================================
  // ボタン作成
  // ================================
  function createChatButton() {
    const button = document.createElement('div');
    button.id = BUTTON_ID;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-label', 'Google Chatを開く');
    button.setAttribute('title', 'Google Chat');

    // CSSスタイルを直接注入（確実に適用されるように）
    button.style.cssText = `
      position: fixed !important;
      right: 60px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      width: 44px !important;
      height: 44px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      background-color: white !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      transition: all 0.2s ease !important;
      z-index: 999999 !important;
      border: none !important;
    `;

    // SVGアイコンを挿入
    button.innerHTML = CHAT_ICON_SVG;

    // ホバー時のスタイル変更
    button.addEventListener('mouseenter', () => {
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      button.style.transform = 'translateY(-50%) scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      button.style.transform = 'translateY(-50%) scale(1)';
    });

    // クリック時にポップアップウィンドウを開く
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openChatPopup();
    });

    // キーボードアクセシビリティ
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChatPopup();
      }
    });

    return button;
  }

  // ================================
  // Google Chatをポップアップウィンドウで開く
  // ================================
  function openChatPopup() {
    const { width, height } = POPUP_CONFIG;

    // 画面の右端に配置
    const left = window.screen.availWidth - width;
    const top = Math.floor((window.screen.availHeight - height) / 2);

    const features = [
      `width=${width}`,
      `height=${height}`,
      `left=${left}`,
      `top=${top}`,
      'menubar=no',
      'toolbar=no',
      'location=no',
      'status=no',
      'resizable=yes',
      'scrollbars=yes',
    ].join(',');

    window.open(CHAT_URL, 'GoogleChatSidebar', features);
    log('ポップアップウィンドウを開きました');
  }

  // ================================
  // ボタンを追加
  // ================================
  function addButton() {
    // 既にボタンが追加されている場合はスキップ
    if (isButtonAlreadyAdded()) {
      log('ボタンは既に追加されています');
      return;
    }

    // トップフレームのみで実行（iframeでは実行しない）
    if (window.self !== window.top) {
      log('iframeでは実行しません');
      return;
    }

    const chatButton = createChatButton();
    document.body.appendChild(chatButton);
    log('フローティングボタンを追加しました');
  }

  // ================================
  // 初期化
  // ================================
  function init() {
    log('初期化開始...');

    // ページの読み込み状態をチェック
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(addButton, 1000);
      });
    } else {
      // 少し遅延させてから追加（スプレッドシートの初期レンダリングを待つ）
      setTimeout(addButton, 1000);
    }

    // ボタンが削除された場合に再追加する監視
    const observer = new MutationObserver(() => {
      if (!isButtonAlreadyAdded() && window.self === window.top) {
        log('ボタンが削除されたため再追加します');
        addButton();
      }
    });

    // body が存在すれば監視開始
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: false });
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: false });
      });
    }

    log('初期化完了');
  }

  // 初期化を実行
  init();

})();
