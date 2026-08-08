/**
 * Little synthesised sound effects. Everything is generated with WebAudio so
 * the app stays a handful of text files with no media to download.
 *
 * Two ingredients: `note` for pitched tones and `noise` for the clicks and
 * clacks that make a thing feel physical. Mechanical sounds are mostly filtered
 * noise — a pure sine never sounds like plastic hitting plastic.
 *
 * iOS keeps the audio context suspended until a real user gesture, so the
 * context is created lazily on the first tap.
 */
window.Sound = (function () {
  var ctx = null;
  var master = null;
  var noiseBuf = null;
  var keeper = null;

  /**
   * iPadOS 13+ reports itself as a Mac, so touch support is the giveaway.
   */
  function isAppleTouch() {
    var ua = navigator.userAgent;
    return /iP(hone|ad|od)/.test(ua) ||
      (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
  }

  /** A few hundredths of a second of silence, built without shipping a file. */
  function silentWavUrl() {
    var rate = 8000;
    var samples = 400;
    var buf = new ArrayBuffer(44 + samples);
    var view = new DataView(buf);

    function tag(offset, text) {
      for (var i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
    }

    tag(0, 'RIFF');
    view.setUint32(4, 36 + samples, true);
    tag(8, 'WAVE');
    tag(12, 'fmt ');
    view.setUint32(16, 16, true);      // PCM header length
    view.setUint16(20, 1, true);       // format: PCM
    view.setUint16(22, 1, true);       // mono
    view.setUint32(24, rate, true);
    view.setUint32(28, rate, true);    // byte rate
    view.setUint16(32, 1, true);       // block align
    view.setUint16(34, 8, true);       // bits per sample
    tag(36, 'data');
    view.setUint32(40, samples, true);
    for (var i = 0; i < samples; i++) view.setUint8(44 + i, 128);  // 128 = silence

    return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
  }

  /**
   * On iOS the hardware ring/silent switch mutes Web Audio, which makes the app
   * look broken to anyone whose phone happens to be on silent. A playing
   * <audio> element moves the page to the "playback" audio session, which the
   * switch does not silence, so a looping scrap of silence keeps the effects
   * audible. The in-app speaker button is still the way to turn sound off.
   */
  function holdAudioSession() {
    if (!isAppleTouch()) return;
    try {
      if (!keeper) {
        keeper = document.createElement('audio');
        keeper.src = silentWavUrl();
        keeper.loop = true;
        keeper.setAttribute('playsinline', '');
        keeper.setAttribute('aria-hidden', 'true');
        // Has to be in the document: Safari will not reliably play a media
        // element that is only held in a variable. It renders nothing without
        // `controls`, and `display: none` would stop playback, so it just sits
        // there invisibly.
        document.body.appendChild(keeper);
      }
      var playing = keeper.play();
      if (playing && playing.catch) playing.catch(function () {});
    } catch (err) {
      console.warn('Could not hold the audio session.', err);
    }
  }

  function context() {
    if (!ctx) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Half a second of white noise, reused by every click. */
  function noiseBuffer(audio) {
    if (!noiseBuf) {
      var frames = Math.floor(audio.sampleRate * 0.5);
      noiseBuf = audio.createBuffer(1, frames, audio.sampleRate);
      var data = noiseBuf.getChannelData(0);
      for (var i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }

  /**
   * One note. `glideTo` bends the pitch over the note's life, which is what
   * gives the coins and the bell their sparkle.
   */
  function note(freq, at, duration, type, peak, glideTo) {
    var audio = context();
    if (!audio) return;
    var start = audio.currentTime + at;
    var osc = audio.createOscillator();
    var gain = audio.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + duration);

    // Quick attack, exponential decay — reads as "playful" rather than "alarm".
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak || 0.2, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  /** A burst of filtered noise: taps, clicks, the clack of a card on a reader. */
  function noise(at, duration, peak, centre, q) {
    var audio = context();
    if (!audio) return;
    var start = audio.currentTime + at;

    var src = audio.createBufferSource();
    src.buffer = noiseBuffer(audio);

    var filter = audio.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = centre || 2000;
    filter.Q.value = q || 1;

    var gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak || 0.2, start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    src.start(start);
    src.stop(start + duration + 0.02);
  }

  function enabled() {
    return window.Store.isSoundOn();
  }

  /** Everything below is wrapped so a broken sound can never break a tap. */
  function safely(fn) {
    if (!enabled()) return;
    try {
      fn();
    } catch (err) {
      console.warn('Sound failed.', err);
    }
  }

  return {
    /**
     * Food added to the order. `step` is how many of that item were already on
     * the ticket, so a second and third portion climb the scale — stacking up
     * the same food turns into a little tune.
     */
    tap: function (step) {
      safely(function () {
        var semitones = Math.min(step || 0, 7);
        var freq = 587 * Math.pow(2, semitones / 12);
        noise(0, 0.03, 0.09, 2600, 1.2);
        note(freq, 0.005, 0.16, 'triangle', 0.22);
        note(freq * 2, 0.005, 0.09, 'sine', 0.07);
      });
    },

    /** Item taken back off the order — the same idea, falling. */
    remove: function () {
      safely(function () {
        noise(0, 0.03, 0.07, 1400, 1.2);
        note(392, 0.005, 0.16, 'triangle', 0.16, 294);
      });
    },

    /** Order sent to the kitchen — a happy little arpeggio. */
    send: function () {
      safely(function () {
        [523, 659, 784, 1047].forEach(function (f, i) {
          note(f, i * 0.09, i === 3 ? 0.32 : 0.15, 'triangle', 0.22);
        });
      });
    },

    /** Kitchen bell: food is ready. */
    bell: function () {
      safely(function () {
        noise(0, 0.04, 0.12, 5000, 2);
        note(1568, 0, 0.55, 'sine', 0.26);
        note(2093, 0.02, 0.45, 'sine', 0.14);
        note(3136, 0.02, 0.3, 'sine', 0.06);
      });
    },

    /** Pan on the stove: cooking started. */
    cooking: function () {
      safely(function () {
        noise(0, 0.12, 0.09, 900, 0.7);
        note(392, 0, 0.16, 'square', 0.12);
        note(523, 0.1, 0.2, 'square', 0.12);
      });
    },

    /** Generic UI click for tabs and toggles. */
    click: function () {
      safely(function () {
        noise(0, 0.02, 0.06, 3000, 1.5);
        note(880, 0.004, 0.07, 'sine', 0.12);
      });
    },

    /** Flat keypad blip, the sound a card reader makes on a button press. */
    terminal: function () {
      safely(function () {
        noise(0, 0.015, 0.05, 3500, 2);
        note(1200, 0.004, 0.08, 'square', 0.1);
      });
    },

    /**
     * The card meeting the reader: a plastic clack with a low body to it.
     * Fired mid-animation, at the moment the card actually lands.
     */
    cardClick: function () {
      safely(function () {
        noise(0, 0.035, 0.3, 2400, 0.8);     // contact
        note(190, 0, 0.09, 'square', 0.14, 120);  // the thunk underneath
        noise(0.05, 0.02, 0.14, 3800, 2);    // the latch settling
      });
    },

    /** Payment accepted: the two-tone chirp every card reader in the world uses. */
    approved: function () {
      safely(function () {
        note(1047, 0, 0.13, 'sine', 0.24);
        note(1568, 0.13, 0.3, 'sine', 0.26);
        note(3136, 0.13, 0.16, 'sine', 0.06);
      });
    },

    /** Coins into the till, with the drawer landing under them. */
    coins: function () {
      safely(function () {
        noise(0, 0.05, 0.14, 5200, 1.2);
        note(1760, 0, 0.09, 'triangle', 0.16, 2200);
        note(2093, 0.07, 0.09, 'triangle', 0.13, 2600);
        note(1568, 0.15, 0.12, 'triangle', 0.14, 1900);
        note(140, 0.2, 0.14, 'sine', 0.16);   // drawer shutting
      });
    },

    /** Warm the audio context up during the first user gesture. */
    unlock: function () {
      context();
      holdAudioSession();
    },

    /** iOS drops the session when the app is backgrounded; take it back. */
    resumeSession: function () {
      context();
      holdAudioSession();
    }
  };
})();
