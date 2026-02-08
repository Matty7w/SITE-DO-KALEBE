/* Intro Logic - Robust Version */
(function () {
    const STORAGE_KEY = 'kalebie_intro_session_v5'; // Changed key to force new intro experience
    const DURATION_TEXT_SHOW = 1700; // Time text is visible before fadeout
    const DURATION_CURTAIN = 1500; // CSS Transition duration match
    const DURATION_TOTAL_FADE = 2000; // Music fade-in duration

    // Check if seen in this session
    if (sessionStorage.getItem(STORAGE_KEY)) {
        console.log('[Intro] Already seen this session.');
        return;
    }

    // Set flag immediately so reload works correctly
    sessionStorage.setItem(STORAGE_KEY, 'true');

    // Block Scroll
    document.body.style.overflow = 'hidden';

    // Create Intro Overlays
    // We add them directly to body, ensuring they are on top.
    const container = document.createElement('div');
    container.id = 'intro-overlay';
    container.innerHTML = `
        <div class="curtain curtain-left"></div>
        <div class="curtain curtain-right"></div>
        <div class="intro-text-container">
            <h1 class="intro-text">
                NÃO É SORTE.<br>
                É <span style="color: #E10600;">TÉCNICA</span>.
            </h1>
        </div>
    `;
    document.body.prepend(container); // Prepend to be safe, but z-index handles it

    // Timers
    let musicInterval = null;

    // Trigger Animation Sequence
    requestAnimationFrame(() => {
        // Step 1: Text Entrance
        const text = container.querySelector('.intro-text');
        text.classList.add('visible');

        // Step 2: Try to Play Music (Immediate Start)
        attemptMusicPlay();

        // Step 3: Text Fade Out
        setTimeout(() => {
            text.classList.remove('visible'); // If wanted to keep visible until curtains open? No, fade out feels cleaner.
            text.classList.add('fade-out');
        }, DURATION_TEXT_SHOW);

        // Step 4: Curtain Open
        setTimeout(() => {
            const left = container.querySelector('.curtain-left');
            const right = container.querySelector('.curtain-right');

            left.style.transform = 'translateX(-100%)';
            right.style.transform = 'translateX(100%)';

            // Step 5: Cleanup & Scroll Restore
            setTimeout(() => {
                container.style.opacity = '0'; // Extra safe fade
                setTimeout(() => {
                    if (container.parentNode) container.parentNode.removeChild(container);
                    document.body.style.overflow = '';
                }, 500);
            }, DURATION_CURTAIN);

        }, DURATION_TEXT_SHOW + 500); // 500ms after text starts fading
    });

    function attemptMusicPlay() {
        console.log('[Intro] Attempting music playback...');
        let attempts = 0;
        const maxAttempts = 20; // 5 seconds (250ms * 20)

        const checkPlayer = setInterval(() => {
            attempts++;
            if (window.musicApp && window.musicApp.player && typeof window.musicApp.player.playVideo === 'function') {
                clearInterval(checkPlayer);
                startMusicFadeIn();
            } else if (attempts > maxAttempts) {
                console.warn('[Intro] Music player not ready in time. Skipping audio intro.');
                clearInterval(checkPlayer);
            }
        }, 250);
    }

    function startMusicFadeIn() {
        try {
            console.log('[Intro] Music player found. Starting fade-in.');
            const p = window.musicApp.player;
            p.setVolume(0);
            p.playVideo(); // Browser might block unmuted autoplay without interaction, but setVolume(0) helps? 
            // Actually YT API usually allows muted autoplay. Then we ramp up volume.

            let vol = 0;
            const targetVol = parseInt(localStorage.getItem('kalebie_volume')) || 50;
            const step = targetVol / 20; // 2 seconds fade (100ms * 20 steps)

            musicInterval = setInterval(() => {
                if (vol < targetVol) {
                    vol += step;
                    p.setVolume(Math.min(vol, 100)); // Cap at 100 or target
                } else {
                    clearInterval(musicInterval);
                }
            }, 100);
        } catch (e) {
            console.error('[Intro] Music error:', e);
        }
    }
})();
