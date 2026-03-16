(function () {
    'use strict';

    window.__WheelRigger__ = {
        enabled: false,
        targetIndex: -1, 
        targetName: null,
        totalEntries: 0,
        triggered: false,
    };

    const state = window.__WheelRigger__;

    window.addEventListener('WheelRiggerSet', (e) => {
        const { enabled, targetIndex, totalEntries, targetName } = e.detail;
        state.enabled = !!enabled;
        state.targetIndex = targetIndex ?? -1;
        state.targetName = targetName ?? null;
        state.totalEntries = totalEntries ?? 0;
        state.triggered = false;
        console.debug('[WheelRigger] state updated', state);
    });

    function getWheelEntries() {
        const editor = document.querySelector('.basic-editor');
        if (!editor) return [];
        return Array.from(editor.querySelectorAll('div'))
            .map(el => el.innerText.trim())
            .filter(Boolean);
    }

    function getOffset(n) {
        
        if (n < 7)  return 0.5;
        if (n < 13) return 0.5;
        if (n < 15) return 1.75;
        if (n < 17) return 2.5;
        if (n < 19) return 3.0;
        if (n < 20) return 3.5;
        if (n < 22) return 4.0;
        if (n < 24) return 5.0;
        if (n < 26) return 5.5;
        if (n < 28) return 6.0;
        if (n < 30) return 6.75;
        if (n < 32) return 7.5;
        if (n < 34) return 8.25;
        if (n < 36) return 9.0;
        if (n < 38) return 9.75;
        if (n < 40) return 10.5;
        if (n < 41) return 11.0;
        if (n < 42) return 11.5;
        if (n < 43) return 12.0;
        if (n < 44) return 12.5;
        if (n < 45) return 12.75;  
        if (n < 46) return 13.0;
        if (n < 47) return 13.25;
        if (n < 48) return 13.5;
        if (n < 49) return 14.0;
        if (n < 50) return 14.25;
        if (n < 51) return 14.5;
        if (n < 52) return 15.0;
        if (n < 53) return 15.25;
        if (n < 54) return 15.5;
        if (n < 55) return 16.0;
        if (n < 56) return 16.25;
        if (n < 57) return 16.5;
        if (n < 58) return 17.0;
        if (n < 59) return 17.25;
        if (n < 60) return 17.5;
        if (n < 61) return 18.0;
        if (n < 62) return 18.25;
        if (n < 63) return 18.5;
        if (n < 64) return 19.0;
        if (n < 65) return 19.25;
        if (n < 66) return 19.5;
        if (n < 67) return 20.0;
        if (n < 68) return 20.25;
        if (n < 69) return 20.5;
        if (n < 70) return 21.0;
        if (n < 71) return 21.25;
        if (n < 72) return 21.5;
        if (n < 73) return 22.0;
        if (n < 74) return 22.25;
        if (n < 75) return 22.5;
        if (n < 76) return 23.0;
        if (n < 77) return 23.25;
        if (n < 78) return 23.5;
        if (n < 79) return 24.0;
        if (n < 80) return 24.25;
        if (n < 81) return 24.5;
        if (n < 82) return 25.0;
        if (n < 83) return 25.25;
        if (n < 84) return 25.5;
        if (n < 85) return 26.0;
        if (n < 86) return 26.25;
        if (n < 87) return 26.5;
        if (n < 88) return 27.0;
        if (n < 89) return 27.5;
        if (n < 90) return 27.75;
        if (n < 91) return 28.5;
        if (n < 92) return 28.75;
        if (n < 93) return 29.5;
if (n < 94) return 29.75;
if (n < 95) return 30.0;
if (n < 96) return 30.25;
if (n < 97) return 30.5;
if (n < 98) return 30.75;
if (n < 99) return 31.0;
if (n < 100) return 31.25;

return 31.5;
    }

    const _origGetRV = crypto.getRandomValues.bind(crypto);

    crypto.getRandomValues = function (array) {
        if (
            state.enabled &&
            state.targetIndex >= 0 &&
            state.totalEntries > 1 &&
            array instanceof Uint32Array &&
            array.length === 1
        ) {
            state.triggered = true;
            window.dispatchEvent(new CustomEvent('WheelRiggerTriggered'));

            let entries = getWheelEntries();
            let n = entries.length;
            let i = state.targetIndex;

            if (state.targetName) {
                const resolved = entries.findIndex(
                    e => e.trim().toLowerCase() === state.targetName.trim().toLowerCase()
                );
                if (resolved !== -1) {
                    i = resolved;
                    n = entries.length;
                }
            }

            const offset = getOffset(n);
            let fraction = (i - 2.5 - 0.5 - offset) / n;
            fraction = (fraction % 1 + 1) % 1;

            const rigged = Math.round(fraction * 0xFFFFFFFF) >>> 0;
            array[0] = rigged;

            return array;
        }

        return _origGetRV(array);
    };

    console.debug('[WheelRigger] crypto.getRandomValues overridden ✓');
})();
