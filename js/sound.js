/**
 * Little synthesised sound effects. Everything is generated with WebAudio so
 * the app stays a handful of text files with no media to download.
 *
 * iOS keeps the audio context suspended until a real user gesture, so the
 * context is created lazily on the first tap.
 */
window.Sound = (function () {
  var ctx = null;

  function context() {
    if (!ctx) {
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** One note. `type` shapes the timbre, `at` is an offset in seconds. */
  function note(freq, at, duration, type, gainPeak) {
    var audio = context();
    if (!audio) return;
    var start = audio.currentTime + at;
    var osc = audio.createOscillator();
    var gain = audio.createGain();

    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // Quick attack, exponential decay — reads as "playful" rather than "alarm".
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.2, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  function play(notes) {
    if (!window.Store.isSoundOn()) return;
    try {
      notes.forEach(function (n) {
        note(n[0], n[1], n[2], n[3], n[4]);
      });
    } catch (err) {
      // Audio is a nice-to-have; never let it break a tap.
      console.warn('Sound failed.', err);
    }
  }

  return {
    /** Food added to the order. */
    tap: function () {
      play([[660, 0, 0.12, 'triangle', 0.18]]);
    },
    /** Item taken back off the order. */
    remove: function () {
      play([[330, 0, 0.12, 'sine', 0.15]]);
    },
    /** Order sent to the kitchen — a happy little arpeggio. */
    send: function () {
      play([
        [523, 0, 0.14, 'triangle', 0.2],
        [659, 0.09, 0.14, 'triangle', 0.2],
        [784, 0.18, 0.14, 'triangle', 0.2],
        [1047, 0.27, 0.3, 'triangle', 0.22]
      ]);
    },
    /** Kitchen bell: food is ready. */
    bell: function () {
      play([
        [1568, 0, 0.5, 'sine', 0.25],
        [2093, 0.02, 0.4, 'sine', 0.12]
      ]);
    },
    /** Pan on the stove: cooking started. */
    cooking: function () {
      play([
        [392, 0, 0.16, 'square', 0.1],
        [523, 0.1, 0.2, 'square', 0.1]
      ]);
    },
    /** Generic UI click for tabs and toggles. */
    click: function () {
      play([[880, 0, 0.06, 'sine', 0.1]]);
    },

    /** Warm the audio context up during the first user gesture. */
    unlock: function () {
      context();
    }
  };
})();
