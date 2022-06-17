import './style.css';

window.addEventListener('load', () => {
  loadURLParams();
  paint();
});

/**
 * Controls toggle
 */

const controlsShow = document.querySelector<HTMLButtonElement>(
  'button#controls-show'
)!;
const controlsHide = document.querySelector<HTMLButtonElement>(
  'button#controls-hide'
)!;

controlsShow.addEventListener('click', () => {
  controlsShow.setAttribute('aria-expanded', String(true));
});
controlsHide.addEventListener('click', () => {
  controlsShow.setAttribute('aria-expanded', String(false));
});

/**
 * Controls inputs
 */

const sizeInput =
  document.querySelector<HTMLInputElement>('input[name="size"]')!;
const branchesInput = document.querySelector<HTMLInputElement>(
  'input[name="branches"]'
)!;
const levelsInput = document.querySelector<HTMLInputElement>(
  'input[name="levels"]'
)!;
const offshootsInput = document.querySelector<HTMLInputElement>(
  'input[name="offshoots"]'
)!;
const scaleInput = document.querySelector<HTMLInputElement>(
  'input[name="scale"]'
)!;
const angleInput = document.querySelector<HTMLInputElement>(
  'input[name="angle"]'
)!;
const branchWidthInput = document.querySelector<HTMLInputElement>(
  'input[name="branch-width"]'
)!;
const colorInput = document.querySelector<HTMLInputElement>(
  'input[name="color"]'
)!;

[
  sizeInput,
  branchesInput,
  offshootsInput,
  levelsInput,
  scaleInput,
  angleInput,
  branchWidthInput,
  colorInput,
].forEach((input) => input.addEventListener('input', paint));

/**
 * Main logic
 */

const MAX_LEVELS = 5;

function paint(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // config
  let size = Number(sizeInput.value) ?? 0;
  let branches = Number(branchesInput.value) ?? 0;
  let offshoots = Number(offshootsInput.value) ?? 0;
  let levels = Number(levelsInput.value) ?? 0;
  let scale = Number(scaleInput.value) ?? 0;
  let angle = Number(angleInput.value) ?? 0;

  ctx.strokeStyle = colorInput.value ?? 'white';
  ctx.lineWidth = Number(branchWidthInput.value) ?? 0;
  ctx.lineCap = 'round';

  function drawBranch(level: number): void {
    if (level > Math.min(levels, MAX_LEVELS)) return;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    for (let i = 0; i < offshoots; i += 1) {
      const translate = size - (size / offshoots) * i;

      ctx.save();
      ctx.translate(translate, 0);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      drawBranch(level + 1);
      ctx.restore();

      ctx.save();
      ctx.translate(translate, 0);
      ctx.rotate(-angle);
      ctx.scale(scale, scale);
      drawBranch(level + 1);
      ctx.restore();
    }
  }

  function drawFractal(): void {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, 1);
    ctx.rotate(0);

    for (let i = 0; i < branches; i += 1) {
      ctx.rotate((Math.PI * 2) / branches);
      drawBranch(0);
    }

    ctx.restore();
  }

  drawFractal();
}

/**
 * Sharing
 */

const shareButton = document.querySelector<HTMLButtonElement>('button#share')!;

shareButton.addEventListener('click', copyConfigToClipboard);

function loadURLParams() {
  const params = new URLSearchParams(
    decodeURIComponent(window.location.search)
  );

  const size = params.get('sz');
  const branches = params.get('b');
  const offshoots = params.get('o');
  const levels = params.get('l');
  const scale = params.get('sc');
  const angle = params.get('a');
  const branchWidth = params.get('bw');
  const color = params.get('c');

  if (size) sizeInput.value = size;
  if (branches) branchesInput.value = branches;
  if (offshoots) offshootsInput.value = offshoots;
  if (levels) levelsInput.value = levels;
  if (scale) scaleInput.value = scale;
  if (angle) angleInput.value = angle;
  if (branchWidth) branchWidthInput.value = branchWidth;
  if (color) colorInput.value = color;
}

// Produces a URL like http://localhost:3000?sz%3D340%26b%3D5%26o%3D3%26l%3D3%26sc%3D0.5%26a%3D0.8%26bw%3D10%26c%3D%2523fa28d9
function copyConfigToClipboard() {
  const config = {
    sz: sizeInput.value,
    b: branchesInput.value,
    o: offshootsInput.value,
    l: levelsInput.value,
    sc: scaleInput.value,
    a: angleInput.value,
    bw: branchWidthInput.value,
    c: colorInput.value,
  };
  const params = new URLSearchParams(config);
  const encoded = encodeURIComponent(params.toString());

  const fullUrl = `${window.location.origin}?${encoded.toString()}`;

  navigator.clipboard
    .writeText(fullUrl)
    .then(() => {
      window.alert('Copied to clipboard!');
    })
    .catch(() => {
      window.alert('Error: Could not copy to clipboard!');
    });
}
