/**
 * PVSize Share Card - 计算结果卡片下载 & 分享
 * 纯 JavaScript IIFE，不依赖任何框架
 * 适用于 pvsize.com 城市页面（896 个城市，结构一致）
 */
(function () {
  'use strict';

  // ============================================================
  // 1. 数据提取
  // ============================================================
  function extractData() {
    var data = {};

    // --- 城市名：从 document.title 提取 ---
    // 格式 "Solar Calculator in City, State (2026)..."
    var titleMatch = document.title.match(/Solar Calculator in (.+?) \(\d{4}/);
    if (titleMatch) {
      data.cityName = titleMatch[1].trim();
    } else {
      // 兜底：从 h1 提取
      var h1 = document.querySelector('article h1');
      data.cityName = h1 ? h1.textContent.trim() : 'Unknown City';
    }

    // --- 第一个 <p>（概览段落） ---
    var firstP = document.querySelector('article > p:first-of-type, article p:first-of-type');
    var pText = firstP ? firstP.innerText : '';
    var strongs = firstP ? firstP.querySelectorAll('strong') : [];

    // --- 系统规模关键词：匹配 "7kW" 等 ---
    var kwMatch = pText.match(/(\d+(?:\.\d+)?)\s*kW/i);
    data.systemSize = kwMatch ? kwMatch[1] + 'kW' : '';

    // --- 核心数值（strong 依次） ---
    // 结构：日照小时、电价、年节省、净成本(ITC后)、回收期
    data.peakSunHours = strongs.length > 0 ? strongs[0].textContent.trim() : '';
    data.electricityRate = strongs.length > 1 ? strongs[1].textContent.trim() : '';
    data.annualSavings = strongs.length > 2 ? strongs[2].textContent.trim() : '';
    data.netCost = strongs.length > 3 ? strongs[3].textContent.trim() : '';
    data.paybackPeriod = strongs.length > 4 ? strongs[4].textContent.trim() : '';

    // --- 三档表格数据 ---
    var table = document.querySelector('article table');
    var tableRows = table ? table.querySelectorAll('tr') : [];
    data.tableData = [];
    // 跳过表头，取 3 行数据（5kW / 7kW / 10kW）
    for (var i = 1; i < tableRows.length && data.tableData.length < 3; i++) {
      var cells = tableRows[i].querySelectorAll('td, th');
      if (cells.length >= 4) {
        data.tableData.push({
          size: cells[0].textContent.trim(),
          grossCost: cells[1].textContent.trim(),
          afterITC: cells[2].textContent.trim(),
          annualSavings: cells[3].textContent.trim()
        });
      }
    }

    // --- 终身节省：最后一个 <p> 内的 <strong> ---
    var allP = document.querySelectorAll('article p');
    if (allP.length > 0) {
      var lastP = allP[allP.length - 1];
      var lastStrong = lastP.querySelector('strong');
      data.lifetimeSavings = lastStrong ? lastStrong.textContent.trim() : '';
    }

    return data;
  }

  // ============================================================
  // 2. 创建隐藏的结果卡片 DOM
  // ============================================================
  function createResultCard(data) {
    // 清理已存在的卡片
    var existing = document.getElementById('pvsize-result-card');
    if (existing) existing.remove();

    var card = document.createElement('div');
    card.id = 'pvsize-result-card';
    card.style.cssText =
      'position:absolute;left:-9999px;top:0;' +
      'width:600px;height:800px;' +
      'background:#141C28;' +
      'color:#ffffff;' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
      'box-sizing:border-box;' +
      'padding:40px 48px;' +
      'display:flex;flex-direction:column;' +
      'overflow:hidden;';

    // 辅助函数：格式化金额（去掉 $ 和逗号，保留纯数字）
    function parseAmount(str) {
      if (!str) return '';
      var cleaned = str.replace(/[^0-9.]/g, '');
      var num = parseFloat(cleaned);
      if (isNaN(num)) return str;
      return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    var netCostFormatted = parseAmount(data.netCost);
    var annualSavingsFormatted = parseAmount(data.annualSavings);
    var lifetimeSavingsFormatted = parseAmount(data.lifetimeSavings);

    // 构建卡片 HTML
    var cardHTML = '';

    // --- 顶部 Logo + 分隔线 ---
    cardHTML += '<div style="display:flex;align-items:center;margin-bottom:16px;">';
    cardHTML += '<span style="font-size:28px;font-weight:700;letter-spacing:1px;color:#ffffff;">PVSize</span>';
    cardHTML += '</div>';
    cardHTML += '<div style="width:60px;height:3px;background:#F7931E;margin-bottom:32px;"></div>';

    // --- 标题区：城市名 + 系统规模 ---
    cardHTML += '<div style="margin-bottom:28px;">';
    cardHTML += '<div style="font-size:24px;font-weight:700;color:#ffffff;margin-bottom:4px;">' +
      escapeHTML(data.cityName) + '</div>';
    if (data.systemSize) {
      cardHTML += '<div style="font-size:16px;color:#8892A4;">Typical System: ' +
        escapeHTML(data.systemSize) + '</div>';
    }
    cardHTML += '</div>';

    // --- 中部数据卡片 ---
    cardHTML += '<div style="display:flex;gap:16px;margin-bottom:28px;">';

    // 卡片1：净成本
    cardHTML += '<div style="flex:1;background:rgba(255,255,255,0.08);border-radius:12px;padding:20px 16px;text-align:center;">';
    cardHTML += '<div style="font-size:13px;color:#8892A4;margin-bottom:8px;">Net Cost (after ITC)</div>';
    cardHTML += '<div style="font-size:36px;font-weight:700;color:#F7931E;">' +
      (netCostFormatted || data.netCost || '--') + '</div>';
    cardHTML += '</div>';

    // 卡片2：年节省
    cardHTML += '<div style="flex:1;background:rgba(255,255,255,0.08);border-radius:12px;padding:20px 16px;text-align:center;">';
    cardHTML += '<div style="font-size:13px;color:#8892A4;margin-bottom:8px;">Annual Savings</div>';
    cardHTML += '<div style="font-size:36px;font-weight:700;color:#00C853;">' +
      (annualSavingsFormatted || data.annualSavings || '--') + '</div>';
    cardHTML += '</div>';

    cardHTML += '</div>';

    // --- 回收期 + 终身节省 ---
    cardHTML += '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px 24px;margin-bottom:auto;">';
    cardHTML += '<div style="display:flex;justify-content:space-between;align-items:center;">';
    cardHTML += '<div>';
    cardHTML += '<div style="font-size:12px;color:#8892A4;margin-bottom:4px;">Payback Period</div>';
    cardHTML += '<div style="font-size:20px;font-weight:600;color:#ffffff;">' +
      escapeHTML(data.paybackPeriod || '--') + '</div>';
    cardHTML += '</div>';
    cardHTML += '<div style="text-align:right;">';
    cardHTML += '<div style="font-size:12px;color:#8892A4;margin-bottom:4px;">25-Year Lifetime Savings</div>';
    cardHTML += '<div style="font-size:20px;font-weight:600;color:#00C853;">' +
      (lifetimeSavingsFormatted || data.lifetimeSavings || '--') + '</div>';
    cardHTML += '</div>';
    cardHTML += '</div>';
    cardHTML += '</div>';

    // --- 底部 CTA + 小字 ---
    cardHTML += '<div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:24px;">';
    cardHTML += '<div style="font-size:18px;font-weight:600;color:#ffffff;">pvsize.com</div>';
    cardHTML += '<div style="font-size:11px;color:#667080;">Scan to calculate yours</div>';
    cardHTML += '</div>';

    card.innerHTML = cardHTML;
    document.body.appendChild(card);

    return card;
  }

  // HTML 转义辅助
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ============================================================
  // 3. 创建操作按钮
  // ============================================================
  function createActionButtons() {
    var article = document.querySelector('article');
    if (!article) return;

    // 找到 article 的最后一个 <p> 之后插入
    var paragraphs = article.querySelectorAll('p');
    var lastP = paragraphs[paragraphs.length - 1];
    if (!lastP) return;

    var container = document.createElement('div');
    container.id = 'pvsize-action-buttons';
    container.style.cssText =
      'display:flex;gap:4%;margin-top:24px;margin-bottom:16px;';

    // 下载按钮
    var downloadBtn = document.createElement('button');
    downloadBtn.id = 'pvsize-download-btn';
    downloadBtn.textContent = '下载结果';
    downloadBtn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;' +
      'width:48%;padding:12px 0;' +
      'background:#141C28;color:#ffffff;' +
      'border:none;border-radius:8px;' +
      'font-size:15px;font-weight:600;' +
      'cursor:pointer;' +
      'transition:opacity 0.2s;';

    // 分享按钮
    var shareBtn = document.createElement('button');
    shareBtn.id = 'pvsize-share-btn';
    shareBtn.textContent = '分享给朋友';
    shareBtn.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;' +
      'width:48%;padding:12px 0;' +
      'background:#F7931E;color:#ffffff;' +
      'border:none;border-radius:8px;' +
      'font-size:15px;font-weight:600;' +
      'cursor:pointer;' +
      'transition:opacity 0.2s;';

    container.appendChild(downloadBtn);
    container.appendChild(shareBtn);

    // 插入到 lastP 之后
    lastP.insertAdjacentElement('afterend', container);
  }

  // ============================================================
  // 4. html2canvas 懒加载
  // ============================================================
  var html2canvasReady = false;
  var html2canvasLoading = false;
  var html2canvasCallbacks = [];

  function ensureHtml2canvas(callback) {
    if (html2canvasReady) {
      callback();
      return;
    }

    html2canvasCallbacks.push(callback);

    if (html2canvasLoading) return;
    html2canvasLoading = true;

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = function () {
      html2canvasReady = true;
      html2canvasLoading = false;
      var cbs = html2canvasCallbacks;
      html2canvasCallbacks = [];
      for (var i = 0; i < cbs.length; i++) {
        cbs[i]();
      }
    };
    script.onerror = function () {
      html2canvasLoading = false;
      alert('加载渲染组件失败，请检查网络连接后刷新页面重试。');
    };
    document.head.appendChild(script);
  }

  // ============================================================
  // 5. 渲染卡片为 PNG Blob
  // ============================================================
  function renderCardToBlob(card, callback) {
    // 将卡片移入可视区域以正确渲染
    card.style.left = '0';
    card.style.top = '0';
    card.style.position = 'fixed';
    card.style.zIndex = '-1';

    // 等待一帧确保布局生效
    requestAnimationFrame(function () {
      html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#141C28'
      }).then(function (canvas) {
        // 恢复隐藏
        card.style.position = 'absolute';
        card.style.left = '-9999px';
        card.style.top = '0';
        card.style.zIndex = '';

        canvas.toBlob(function (blob) {
          callback(null, blob);
        }, 'image/png');
      }).catch(function (err) {
        // 恢复隐藏
        card.style.position = 'absolute';
        card.style.left = '-9999px';
        card.style.top = '0';
        card.style.zIndex = '';
        callback(err, null);
      });
    });
  }

  // ============================================================
  // 6. 下载功能
  // ============================================================
  function handleDownload(data) {
    var btn = document.getElementById('pvsize-download-btn');
    var originalText = btn.textContent;
    btn.textContent = '生成中...';
    btn.disabled = true;

    ensureHtml2canvas(function () {
      var card = createResultCard(data);
      renderCardToBlob(card, function (err, blob) {
        btn.textContent = originalText;
        btn.disabled = false;

        if (err) {
          alert('生成图片失败，请重试。');
          return;
        }

        // 触发下载
        var fileName = 'PVSize_' + data.cityName.replace(/\s+/g, '_') + '_solar_savings.png';
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  }

  // ============================================================
  // 7. 分享功能
  // ============================================================
  function handleShare(data) {
    var btn = document.getElementById('pvsize-share-btn');
    var originalText = btn.textContent;
    btn.textContent = '生成中...';
    btn.disabled = true;

    ensureHtml2canvas(function () {
      var card = createResultCard(data);
      renderCardToBlob(card, function (err, blob) {
        if (err) {
          btn.textContent = originalText;
          btn.disabled = false;
          // 即使渲染失败也尝试降级分享链接
          fallbackCopyLink(btn, originalText);
          return;
        }

        // 尝试 Web Share API 分享文件
        var fileName = 'PVSize_' + data.cityName.replace(/\s+/g, '_') + '_solar_savings.png';
        var file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'PVSize Solar Savings - ' + data.cityName,
            text: 'Check out solar savings in ' + data.cityName + '!'
          }).then(function () {
            btn.textContent = originalText;
            btn.disabled = false;
          }).catch(function () {
            // 用户取消分享或失败，降级
            fallbackCopyLink(btn, originalText);
          });
        } else {
          // 不支持 Web Share API 文件分享，降级
          fallbackCopyLink(btn, originalText);
        }
      });
    });
  }

  // 降级：复制当前页面链接
  function fallbackCopyLink(btn, originalText) {
    var url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function () {
        showToast('链接已复制，去粘贴给朋友吧');
        btn.textContent = originalText;
        btn.disabled = false;
      }).catch(function () {
        showToast('链接已复制，去粘贴给朋友吧');
        btn.textContent = originalText;
        btn.disabled = false;
      });
    } else {
      // 旧浏览器 fallback
      var textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showToast('链接已复制，去粘贴给朋友吧');
      } catch (e) {
        showToast('复制失败，请手动分享链接：' + url);
      }
      document.body.removeChild(textarea);
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  // Toast 提示
  function showToast(message) {
    var existing = document.querySelector('.pvsize-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'pvsize-toast';
    toast.textContent = message;
    toast.style.cssText =
      'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
      'background:rgba(0,0,0,0.82);color:#ffffff;' +
      'padding:12px 24px;border-radius:8px;' +
      'font-size:14px;font-weight:500;' +
      'z-index:99999;' +
      'white-space:nowrap;' +
      'animation:pvsize-fade-in 0.3s ease;';

    // 注入 keyframes
    if (!document.getElementById('pvsize-toast-style')) {
      var style = document.createElement('style');
      style.id = 'pvsize-toast-style';
      style.textContent =
        '@keyframes pvsize-fade-in{from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 2000);
  }

  // ============================================================
  // 8. 响应式适配
  // ============================================================
  function applyResponsiveStyles() {
    var container = document.getElementById('pvsize-action-buttons');
    if (!container) return;

    if (window.innerWidth < 768) {
      container.style.flexDirection = 'column';
      container.style.gap = '8px';
      var btns = container.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) {
        btns[i].style.width = '100%';
      }
    } else {
      container.style.flexDirection = '';
      container.style.gap = '4%';
      var btns2 = container.querySelectorAll('button');
      for (var j = 0; j < btns2.length; j++) {
        btns2[j].style.width = '48%';
      }
    }
  }

  // ============================================================
  // 9. 入口：初始化
  // ============================================================
  function init() {
    var data = extractData();

    // 验证关键数据
    if (!data.cityName || data.cityName === 'Unknown City') {
      console.warn('[PVSize] 无法提取城市名，跳过按钮注入。');
      return;
    }

    createActionButtons();
    applyResponsiveStyles();

    // 绑定事件
    document.getElementById('pvsize-download-btn').addEventListener('click', function () {
      handleDownload(data);
    });

    document.getElementById('pvsize-share-btn').addEventListener('click', function () {
      handleShare(data);
    });

    // 响应式监听
    window.addEventListener('resize', function () {
      applyResponsiveStyles();
    });
  }

  // DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
