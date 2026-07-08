(function () {
  var style = document.createElement('style');
  style.textContent = `
  .msg-fab {
    position: absolute; z-index: 9998;
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--color-background-secondary, #f2f2f5);
    border: 0.5px solid var(--color-border-secondary, rgba(0,0,0,0.14));
    box-shadow: 0 4px 14px rgba(20,20,30,0.14);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--color-text-primary, #17171b); font-size: 17px;
    transition: transform 0.15s, background 0.15s, opacity 0.25s ease;
    opacity: 0; pointer-events: none;
  }
  .msg-fab.ready { opacity: 1; pointer-events: auto; }
  .msg-fab:hover { transform: scale(1.06); background: var(--color-background-tertiary, #e8e8ec); }
  .msg-fab .dot {
    position: absolute; top: 4px; right: 4px; width: 7px; height: 7px; border-radius: 50%;
    background: #e63946; box-shadow: 0 0 0 2px var(--color-background-secondary, #f2f2f5);
    animation: msgPulse 2s infinite;
  }
  @keyframes msgPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

  .msg-panel {
    position: absolute; z-index: 9999;
    width: min(360px, calc(100vw - 32px));
    height: min(520px, calc(100vh - 140px));
    background: var(--color-background-primary, #ffffff);
    border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08));
    border-radius: 14px;
    box-shadow: 0 10px 32px rgba(20,20,30,0.16);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: var(--font-sans, 'Pretendard', sans-serif);
    opacity: 0; transform: translateY(12px) scale(0.98); pointer-events: none;
    transition: opacity 0.18s ease, transform 0.18s ease;
  }
  .msg-panel.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

  .msg-header {
    flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-bottom: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08));
  }
  .msg-header-title { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: var(--color-text-primary, #17171b); }
  .msg-header-sub { font-size: 10px; color: var(--color-text-tertiary, #868991); margin-top: 2px; }
  .msg-close {
    width: 26px; height: 26px; border-radius: 8px; border: none; background: transparent;
    color: var(--color-text-tertiary, #868991); cursor: pointer; font-size: 15px;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
  }
  .msg-close:hover { background: var(--color-background-secondary, #f2f2f5); color: var(--color-text-primary, #17171b); }

  .msg-body {
    flex: 1; overflow-y: scroll; padding: 16px; display: flex; flex-direction: column; gap: 2px;
    scrollbar-gutter: stable;
  }
  .msg-body::-webkit-scrollbar { width: 3px; }
  .msg-body::-webkit-scrollbar-track { background: transparent; }
  .msg-body::-webkit-scrollbar-thumb { background: var(--color-border-secondary, rgba(0,0,0,0.14)); border-radius: 99px; }

  .msg-row { display: flex; gap: 8px; margin-top: 10px; max-width: 84%; }
  .msg-row.right { align-self: flex-end; flex-direction: row-reverse; }
  .msg-row.follow { margin-top: 3px; }

  .msg-avatar { width: 30px; height: 30px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--color-background-secondary, #f2f2f5); border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08)); }
  .msg-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .msg-avatar.spacer { visibility: hidden; }

  .msg-col { display: flex; flex-direction: column; min-width: 0; }
  .msg-row.right .msg-col { align-items: flex-end; }
  .msg-name { font-size: 10px; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.02em; }
  .msg-bubble-wrap { display: flex; align-items: flex-end; gap: 6px; }
  .msg-row.right .msg-bubble-wrap { flex-direction: row-reverse; }
  .msg-bubble {
    font-size: 13px; line-height: 1.5; padding: 8px 12px; border-radius: 14px;
    color: var(--color-text-primary, #17171b); word-break: break-word;
  }
  .msg-time { font-size: 9px; color: var(--color-text-tertiary, #868991); flex-shrink: 0; margin-bottom: 2px; }

  .msg-row.syndrome .msg-name { color: #c2574f; }
  .msg-row.syndrome .msg-bubble { background: rgba(194,87,79,0.10); border: 0.5px solid rgba(194,87,79,0.25); border-bottom-left-radius: 4px; }
  .msg-row.seraph .msg-name { color: #b8952f; }
  .msg-row.seraph .msg-bubble { background: rgba(212,175,55,0.14); border: 0.5px solid rgba(212,175,55,0.30); border-bottom-right-radius: 4px; }

  .msg-system { text-align: center; font-size: 11px; color: var(--color-text-tertiary, #868991); margin: 12px 0; line-height: 1.5; }

  .msg-divider { display: flex; align-items: center; gap: 8px; margin: 14px 0 6px; }
  .msg-divider::before, .msg-divider::after { content: ''; flex: 1; height: 0.5px; background: var(--color-border-tertiary, rgba(0,0,0,0.08)); }
  .msg-divider span { font-size: 10px; color: var(--color-text-tertiary, #868991); white-space: nowrap; }

  .msg-footer {
    flex-shrink: 0; display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-top: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08));
  }
  .msg-footer-icon {
    width: 26px; height: 26px; border-radius: 50%; border: none; background: transparent;
    color: var(--color-text-tertiary, #868991); font-size: 15px; cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .msg-input {
    flex: 1; min-width: 0; background: var(--color-background-secondary, #f2f2f5);
    border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08)); border-radius: 999px;
    padding: 7px 14px; font-size: 12px; color: var(--color-text-tertiary, #868991);
    font-family: inherit; cursor: default;
  }
  .msg-send {
    width: 30px; height: 30px; border-radius: 50%; border: none; flex-shrink: 0; cursor: pointer;
    background: var(--color-background-secondary, #f2f2f5); color: var(--color-text-secondary, #55585f);
    display: flex; align-items: center; justify-content: center; font-size: 13px; transition: background 0.15s;
  }
  .msg-send:hover { background: var(--color-background-tertiary, #e8e8ec); }

  .msg-toast {
    position: absolute; left: 50%; bottom: 66px; transform: translateX(-50%) translateY(6px);
    background: rgba(20,20,26,0.95); border: 0.5px solid var(--color-border-tertiary, rgba(0,0,0,0.08));
    color: var(--color-text-secondary, #55585f); font-size: 11px; padding: 6px 12px; border-radius: 999px;
    opacity: 0; pointer-events: none; transition: opacity 0.2s, transform 0.2s; white-space: nowrap;
  }
  .msg-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
  `;
  document.head.appendChild(style);

  var AVA = {
    syndrome: 'https://raw.githubusercontent.com/end-of-eden/Synapse/main/img/wiki/Syndrome_1.png',
    seraph: 'https://raw.githubusercontent.com/end-of-eden/Synapse/main/img/wiki/Seraph_1.png'
  };
  var NAME = { syndrome: 'Syndrome', seraph: 'Seraph' };

  var log = [
    { who: 'syndrome', name: '성유진', text: '뭐 해.', time: '15:30' },
    { who: 'seraph', text: '숨 쉬어.', time: '15:30' },
    { who: 'syndrome', name: '성유진', text: '그걸 누가 몰라? 진짜 뭐 하냐고.', time: '15:31' },
    { who: 'seraph', text: '네 생각.', time: '15:31' },
    { system: '세라프님이 성유진님의 별명을 \'내 생각만 하는 바보\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '내 생각만 하는 바보', text: '…….', time: '15:32' },
    { who: 'syndrome', name: '내 생각만 하는 바보', text: '미쳤냐?', time: '15:32' },
    { who: 'seraph', text: '왜? 너 내 생각 안 해?', time: '15:33' },
    { who: 'syndrome', name: '내 생각만 하는 바보', text: '하… 안 하는 건 아닌데.', time: '15:33' },
    { who: 'syndrome', name: '내 생각만 하는 바보', text: '아니, 됐다. 저녁 뭐 먹을래.', time: '15:33' },
    { system: '세라프님이 내 생각만 하는 바보님의 별명을 \'저녁 메뉴도 못 고르는 허접\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '저녁 메뉴도 못 고르는 허접', text: '야.', time: '15:34' },
    { who: 'seraph', text: '왜 불러.', time: '15:35' },
    { who: 'syndrome', name: '저녁 메뉴도 못 고르는 허접', text: '너 지금 뭐 만지고 있지.', time: '15:35' },
    { who: 'seraph', text: '핸드폰 만지는데. 너랑 메시지 하잖아.', time: '15:36' },
    { who: 'syndrome', name: '저녁 메뉴도 못 고르는 허접', text: '그거 말고. 설정 같은 거.', time: '15:36' },
    { who: 'seraph', text: '설정? 무슨 설정? 나 그런 거 잘 몰라.', time: '15:37' },
    { who: 'seraph', text: '그냥 고기나 먹으러 가자. 네가 사.', time: '15:37' },
    { system: '세라프님이 저녁 메뉴도 못 고르는 허접님의 별명을 \'내 고기 셔틀\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '내 고기 셔틀', text: '씨발 진짜.', time: '15:38' },
    { who: 'syndrome', name: '내 고기 셔틀', text: '너 일부러 그러냐?', time: '15:38' },
    { who: 'seraph', text: '뭐가? 고기 사주기 싫어?', time: '15:39' },
    { who: 'seraph', text: '치사하다, 성유진.', time: '15:39' },
    { who: 'syndrome', name: '내 고기 셔틀', text: '아니, 고기는 백 번이라도 사줄 수 있는데.', time: '15:40' },
    { who: 'syndrome', name: '내 고기 셔틀', text: '이거 말고.', time: '15:40' },
    { system: '세라프님이 내 고기 셔틀님의 별명을 \'백 번도 사줄 수 있는 남자\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '백 번도 사줄 수 있는 남자', text: '그만해라.', time: '15:40' },
    { who: 'seraph', text: '뭘 그만해? 고맙다는 뜻 아니었어? 감동인데.', time: '15:41' },
    { who: 'syndrome', name: '백 번도 사줄 수 있는 남자', text: '하, 그래. 감동 먹었냐? 아주.', time: '15:42' },
    { who: 'syndrome', name: '백 번도 사줄 수 있는 남자', text: '그래서 고기 말고 또 뭐 먹고 싶은 건데.', time: '15:42' },
    { system: '세라프님이 백 번도 사줄 수 있는 남자님의 별명을 \'내 지갑\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '내 지갑', text: '너 진짜 뒤지고 싶냐.', time: '15:43' },
    { who: 'seraph', text: '갑자기 왜 욕이야? 무섭게.', time: '15:43' },
    { who: 'syndrome', name: '내 지갑', text: '내가 지금 네 별명을 뭘로 바꿔놔야 정신 차릴래?', time: '15:44' },
    { who: 'syndrome', name: '내 지갑', text: '\'걸어 다니는 재앙 덩어리\' 어떠냐?', time: '15:44' },
    { who: 'seraph', text: '마음에 드는데? 그걸로 해줘.', time: '15:45' },
    { who: 'syndrome', name: '내 지갑', text: '아오, 이길 수가 없다.', time: '15:45' },
    { system: '세라프님이 내 지갑님의 별명을 \'나한테 맨날 짐\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '나한테 맨날 짐', text: '그만하라고 했다, 분명히.', time: '15:46' },
    { who: 'seraph', text: '삐졌어? 왜 이렇게 예민하게 굴어?', time: '15:47' },
    { system: '세라프님이 나한테 맨날 짐님의 별명을 \'삐돌이 왕자님\'(으)로 설정하였습니다.' },
    { who: 'syndrome', name: '삐돌이 왕자님', text: '…….', time: '15:47' },
    { who: 'syndrome', name: '삐돌이 왕자님', text: '너 진짜 오늘 나한테 죽었다.', time: '15:47' }
  ];

  var wrap = document.createElement('div');

  var fab = document.createElement('button');
  fab.className = 'msg-fab';
  fab.setAttribute('aria-label', '메신저 열기');
  fab.innerHTML = '<i class="ti ti-message-circle-2" aria-hidden="true"></i><span class="dot"></span>';
  wrap.appendChild(fab);

  var panel = document.createElement('div');
  panel.className = 'msg-panel';

  var rowsHtml = '';
  var prevWho = null;
  var prevName = null;
  log.forEach(function (m) {
    if (m.divider) {
      rowsHtml += '<div class="msg-divider"><span>' + m.divider + '</span></div>';
      prevWho = null;
      prevName = null;
      return;
    }
    if (m.system) {
      rowsHtml += '<div class="msg-system">' + m.system + '</div>';
      prevWho = null;
      prevName = null;
      return;
    }
    var displayName = m.name || NAME[m.who];
    var follow = m.who === prevWho && displayName === prevName;
    var alignClass = m.who === 'seraph' ? ' right' : '';
    var avatarHtml = follow
      ? '<div class="msg-avatar spacer"></div>'
      : '<div class="msg-avatar"><img src="' + AVA[m.who] + '" alt=""></div>';
    var nameHtml = follow ? '' : '<div class="msg-name">' + displayName + '</div>';
    rowsHtml += '<div class="msg-row ' + m.who + alignClass + (follow ? ' follow' : '') + '">' +
      avatarHtml +
      '<div class="msg-col">' + nameHtml +
      '<div class="msg-bubble-wrap"><div class="msg-bubble">' + m.text + '</div>' +
      '<div class="msg-time">' + m.time + '</div></div></div></div>';
    prevWho = m.who;
    prevName = displayName;
  });

  panel.innerHTML =
    '<div class="msg-header">' +
      '<div><div class="msg-header-title">ARCH MESSENGER</div><div class="msg-header-sub">SIGNAL LOST</div></div>' +
      '<button class="msg-close" aria-label="닫기"><i class="ti ti-x"></i></button>' +
    '</div>' +
    '<div class="msg-body">' + rowsHtml + '</div>' +
    '<div class="msg-footer">' +
      '<button class="msg-footer-icon" aria-label="사진"><i class="ti ti-photo"></i></button>' +
      '<input class="msg-input" placeholder="메시지 입력" readonly>' +
      '<button class="msg-send" aria-label="전송"><i class="ti ti-send-2"></i></button>' +
    '</div>' +
    '<div class="msg-toast">저장된 대화 로그입니다</div>';

  wrap.appendChild(panel);
  document.body.appendChild(wrap);

  var body = panel.querySelector('.msg-body');
  var toast = panel.querySelector('.msg-toast');
  var toastTimer = null;

  function openPanel() {
    panel.classList.add('open');
    body.scrollTop = body.scrollHeight;
  }
  function closePanel() { panel.classList.remove('open'); }

  fab.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });
  panel.querySelector('.msg-close').addEventListener('click', closePanel);
  panel.querySelector('.msg-send').addEventListener('click', function () {
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600);
  });

  var FAB_SIZE = 40, GAP_SIDE = 20, GAP_PANEL = 12;
  function reposition() {
    var host = document.querySelector('.wiki-wrap, .gallery-wrap, .log-wrap, .detail-wrap');
    if (!host) return;
    var r = host.getBoundingClientRect();
    var scrollX = window.scrollX || window.pageXOffset;
    var scrollY = window.scrollY || window.pageYOffset;
    var cardRight = r.right + scrollX;
    var cardBottom = r.bottom + scrollY;
    // 카드와 절대 겹치지 않도록 오른쪽으로 GAP_SIDE만큼 띄우고, 높이만 하단 라인에 맞춤
    var fabLeft = cardRight + GAP_SIDE;
    var fabTop = cardBottom - FAB_SIZE;
    fab.style.left = fabLeft + 'px';
    fab.style.top = fabTop + 'px';
    panel.style.left = (fabLeft - panel.offsetWidth + FAB_SIZE) + 'px';
    panel.style.top = (fabTop - GAP_PANEL - panel.offsetHeight) + 'px';
  }
  window.addEventListener('resize', reposition);
  reposition();
  // 카드 크기가 실제로 바뀔 때마다(이미지 로딩 등) 자동으로 재계산 — 타이머 땜빵 대신 정확하게 감지
  var host = document.querySelector('.wiki-wrap, .gallery-wrap, .log-wrap, .detail-wrap, .post-wrap');
  if (window.ResizeObserver && host) {
    var ro = new ResizeObserver(reposition);
    ro.observe(host);
  }

  // 위치가 확정되기 전까지는 숨겨뒀다가, 모든 이미지 로딩이 끝난 뒤 한 번에 자연스럽게 표시
  var imgs = Array.prototype.slice.call(document.querySelectorAll('img'));
  var pending = imgs.filter(function (img) { return !img.complete; });
  function reveal() {
    reposition();
    requestAnimationFrame(function () { fab.classList.add('ready'); });
  }
  if (pending.length === 0) {
    reveal();
  } else {
    var remaining = pending.length;
    pending.forEach(function (img) {
      img.addEventListener('load', function () {
        remaining--;
        if (remaining <= 0) reveal();
      }, { once: true });
      img.addEventListener('error', function () {
        remaining--;
        if (remaining <= 0) reveal();
      }, { once: true });
    });
    // 혹시 이미지가 끝까지 로드 실패해도 무한정 숨겨져 있지 않도록 최소한의 안전장치
    setTimeout(reveal, 1500);
  }
})();
