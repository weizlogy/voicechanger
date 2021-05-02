var isRunning = false;

window.addEventListener('DOMContentLoaded', (_) => {
  console.log('loaded.');

  const mic = new Tone.UserMedia();

  //** Effect Choose Action */
  document.querySelector('select[name="effect-chooser"]').addEventListener('change', (e) => {
    const editor = document.querySelector('div[name="effect-editor"]');
    editor.innerHTML = '';

    const mode = e.target.value;
    const clone = document.querySelector(`#clone-${mode}`).cloneNode(true);
    clone.id = '';
    clone.setAttribute('name', mode);
    editor.appendChild(clone);
  });

  //** Effect Add Action */
  document.querySelector('div[name="vc-effect-add"]').onclick = (_) => {
    const effectList = document.querySelector('div[name="effect-list"]');

    const clone = document.querySelector('div[name="effect-editor"] > div').cloneNode(true);
    clone.id = Date.now();
    clone.setAttribute('draggable', 'true');
    clone.setAttribute('ondragstart', 'EffectDragstart(event)');

    effectList.appendChild(clone);
    effectList.querySelectorAll('input').forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });
  };

  //** Mic-on Effect Start */
  document.querySelector('div[name="vc-submit"]').onclick = (_) => {
    if (isRunning) {
      console.log('mic close.');
      mic.close();
      isRunning = !isRunning;
      return;
    }

    mic.open();
    console.log('mic start.');
    isRunning = !isRunning;

// let a = [
//   new Tone.Gate(-35),
//   new Tone.BiquadFilter(300, 'lowpass'),
//   new Tone.BiquadFilter(50, 'highpass'),
//   new Tone.BiquadFilter(120, 'peaking'),
//   new Tone.PitchShift(11), Tone.Destination]

// mic.chain(...a)

    document.querySelectorAll('div[name="effect-list"] > div').forEach(el => {
      const effectName = el.getAttribute('name');
      console.log(effectName);

      let effectArray = [];
      let effectObj;

      switch(effectName) {
        case 'biquadfilter':
          effectObj = new Tone.BiquadFilter(
            el.querySelector('input[name="effect-biquadfilter-freq"]').value,
            el.querySelector('input[name="effect-biquadfilter-type"]').value);
          effectArray.push(effectObj);
          break;
        case 'gate':
          effectObj = new Tone.BiquadFilter(
            el.querySelector('input[name="effect-gate-threshold"]').value,
            el.querySelector('input[name="effect-gate-smoothing"]').value);
          effectArray.push(effectObj);
          break;
        case 'pitchshift':
          effectObj = new Tone.PitchShift(
            el.querySelector('input[name="effect-pitchsift-pitch"]').value);
          effectArray.push(effectObj);
          break;
      }

      effectArray.push(Tone.Destination);
      mic.chain(...effectArray);
    });
  };
});

function EffectDragstart(event) {
  event.dataTransfer.setData('text', event.target.id);
}
function EffectDragover(event) {
  event.preventDefault();
}
function EffectDrop(event) {
  event.currentTarget.appendChild(
    document.getElementById(event.dataTransfer.getData('text')));
  event.preventDefault();
}
