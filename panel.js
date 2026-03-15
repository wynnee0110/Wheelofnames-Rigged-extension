/**
 * panel.js  –  isolated-world content script
 */

(function () {
    'use strict';

    /* ── helpers ──────────────────────────────────────────────────────────── */

    function getEntries() {
        const editor = document.querySelector('.basic-editor');
        if (!editor) return [];

        const divs = Array.from(editor.querySelectorAll('div'));
        if (divs.length > 0) {
            return divs
                .map(el => el.innerText.trim())
                .filter(t => t !== "");
        }

        if (editor.innerText) {
            return editor.innerText
                .split('\n')
                .map(t => t.trim())
                .filter(t => t !== "");
        }

        return [];
    }

    function sendToMain(payload) {
        window.dispatchEvent(new CustomEvent('WheelRiggerSet', { detail: payload }));
    }

    /* ── styles ───────────────────────────────────────────────────────────── */

    const style = document.createElement('style');
    style.textContent = `
        #wr-tab {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 2147483647;
            width: 18px;
            height: 64px;
            background: rgba(30, 30, 50, 0.55);
            border: 1px solid rgba(255,255,255,0.08);
            border-right: none;
            border-radius: 6px 0 0 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            writing-mode: vertical-rl;
            font-size: 9px;
            letter-spacing: 0.1em;
            color: rgba(255,255,255,0.25);
            font-family: monospace;
            backdrop-filter: blur(4px);
            transition: background 0.2s, color 0.2s, width 0.2s;
            user-select: none;
        }
        #wr-tab:hover {
            background: rgba(124,108,255,0.25);
            color: rgba(255,255,255,0.6);
            width: 22px;
        }
        #wr-tab.armed {
            background: rgba(61,255,160,0.2);
            color: #3dffa0;
        }

        #wr-panel {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%) translateX(100%);
            z-index: 2147483647;
            width: 220px;
            background: rgba(10, 10, 20, 0.92);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px 0 0 10px;
            box-shadow: -6px 0 32px rgba(0,0,0,0.5);
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #ccc8ee;
            backdrop-filter: blur(8px);
            transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
            overflow: hidden;
        }
        #wr-panel.open {
            transform: translateY(-50%) translateX(0);
        }

        #wr-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 9px 12px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            font-size: 10px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: rgba(180,170,255,0.7);
            cursor: move;
        }
        #wr-close {
            background: none;
            border: none;
            color: rgba(255,255,255,0.3);
            cursor: pointer;
            font-size: 14px;
            padding: 0;
            line-height: 1;
        }
        #wr-close:hover { color: rgba(255,255,255,0.7); }

        #wr-body {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        #wr-input {
            width: 100%;
            padding: 7px 9px;
            background: rgba(255,255,255,0.04);
            color: #ddd8ff;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 6px;
            font-family: inherit;
            font-size: 11px;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        #wr-input:focus { border-color: rgba(124,108,255,0.6); }
        #wr-input:disabled { opacity: 0.35; cursor: not-allowed; }
        #wr-input::placeholder { color: rgba(255,255,255,0.2); }

        #wr-btn {
            width: 100%;
            padding: 7px;
            border: none;
            border-radius: 6px;
            font-family: inherit;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: opacity 0.15s;
        }
        #wr-btn.enable  { background: rgba(124,108,255,0.8); color: #fff; }
        #wr-btn.disable { background: rgba(255,79,106,0.8);  color: #fff; }
        #wr-btn:hover   { opacity: 0.85; }
        #wr-btn:active  { opacity: 0.7; }

        #wr-status {
            font-size: 10px;
            padding: 6px 9px;
            border-radius: 6px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            gap: 6px;
            overflow: hidden;
        }
        .wr-dot {
            width: 5px; height: 5px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        #wr-status.idle  .wr-dot { background: rgba(255,255,255,0.2); }
        #wr-status.armed .wr-dot { background: #3dffa0; box-shadow: 0 0 4px #3dffa0; animation: wr-blink 1.4s infinite; }
        #wr-status.error .wr-dot { background: #ff4f6a; }
        .wr-msg { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        #wr-status.idle  .wr-msg { color: rgba(255,255,255,0.25); }
        #wr-status.armed .wr-msg { color: #3dffa0; }
        #wr-status.error .wr-msg { color: #ff4f6a; }

        @keyframes wr-blink {
            0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
    `;
    document.head.appendChild(style);

    /* ── build DOM ───────────────────────────────────────────────────────── */

    // Tiny side tab — always visible, barely noticeable
    const tab = document.createElement('div');
    tab.id = 'wr-tab';
    tab.textContent = '· · ·';
    document.body.appendChild(tab);

    // Panel — hidden off-screen to the right, slides in on click
    const panel = document.createElement('div');
    panel.id = 'wr-panel';
    panel.innerHTML = `
        <div id="wr-head">
            <span>🎯 wr</span>
            <button id="wr-close" title="Close">×</button>
        </div>
        <div id="wr-body">
            <input type="text" id="wr-input" placeholder="target name…" autocomplete="off" spellcheck="false">
            <button id="wr-btn" class="enable">Enable</button>
            <div id="wr-status" class="idle">
                <div class="wr-dot"></div>
                <span class="wr-msg">idle</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    const input    = panel.querySelector('#wr-input');
    const button   = panel.querySelector('#wr-btn');
    const statusEl = panel.querySelector('#wr-status');
    const msgEl    = panel.querySelector('.wr-msg');
    const closeBtn = panel.querySelector('#wr-close');

    let enabled = false;
    let open    = false;

    /* ── helpers ─────────────────────────────────────────────────────────── */

    function setStatus(cls, msg) {
        statusEl.className = cls;
        msgEl.textContent  = msg;
    }

    function togglePanel() {
        open = !open;
        panel.classList.toggle('open', open);
    }

    /* ── tab & close ─────────────────────────────────────────────────────── */

    tab.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);

    /* ── enable / disable (ORIGINAL LOGIC UNCHANGED) ─────────────────────── */

    button.addEventListener('click', () => {
        if (!enabled) {
            const target = input.value.trim().toLowerCase();
            if (!target) {
                setStatus('error', '⚠ enter a name first');
                return;
            }

            const entries = getEntries();
            const idx = entries.findIndex(e => e.toLowerCase() === target);

            if (idx === -1) {
                setStatus('error', '⚠ "' + input.value.trim() + '" not found');
                return;
            }

            enabled = true;
            button.textContent = 'Disable';
            button.className   = 'disable';
            input.disabled     = true;
            tab.classList.add('armed');
            setStatus('armed', '🔒 → "' + entries[idx] + '"');

            sendToMain({
                enabled:      true,
                targetIndex:  idx,
                targetName:   entries[idx],
                totalEntries: entries.length
            });

        } else {
            enabled = false;
            button.textContent = 'Enable';
            button.className   = 'enable';
            input.disabled     = false;
            tab.classList.remove('armed');
            setStatus('idle', 'idle');

            sendToMain({
                enabled:      false,
                targetIndex:  -1,
                targetName:   null,
                totalEntries: 0
            });
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') button.click();
    });

    /* ── drag ────────────────────────────────────────────────────────────── */

    let dragging = false, ox = 0, oy = 0;
    const head = panel.querySelector('#wr-head');

    head.addEventListener('mousedown', (e) => {
        if (e.target.id === 'wr-close') return;
        dragging = true;
        ox = e.clientX - panel.offsetLeft;
        oy = e.clientY - panel.offsetTop;
        panel.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        panel.style.left      = (e.clientX - ox) + 'px';
        panel.style.top       = (e.clientY - oy) + 'px';
        panel.style.right     = 'unset';
        panel.style.transform = 'none';
    });
    document.addEventListener('mouseup', () => { dragging = false; });
    // Auto-reset after each spin
window.addEventListener('WheelRiggerTriggered', () => {
    enabled = false;
    button.textContent = 'Enable';
    button.className   = 'enable';
    input.disabled     = false;
    tab.classList.remove('armed');
    setStatus('idle', 'spin done — re-arm to use again');
});

})();