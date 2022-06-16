import './style.css';

const MAX_LEVELS = 5;

window.addEventListener('load', run);

const sizeInput =
  document.querySelector<HTMLInputElement>('input[name="size"]')!;
const sidesInput = document.querySelector<HTMLInputElement>(
  'input[name="sides"]'
)!;
const levelsInput = document.querySelector<HTMLInputElement>(
  'input[name="levels"]'
)!;
const scaleInput = document.querySelector<HTMLInputElement>(
  'input[name="scale"]'
)!;
const spreadInput = document.querySelector<HTMLInputElement>(
  'input[name="spread"]'
)!;
const branchesInput = document.querySelector<HTMLInputElement>(
  'input[name="branches"]'
)!;
const branchWidthInput = document.querySelector<HTMLInputElement>(
  'input[name="branch-width"]'
)!;
const colorInput = document.querySelector<HTMLInputElement>(
  'input[name="color"]'
)!;

sizeInput.addEventListener('input', run);
colorInput.addEventListener('input', run);

function run(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // config
  let size = Number(sizeInput.value) ?? 0;
  let sides = Number(sidesInput.value) ?? 0;
  let levels = Number(levelsInput.value) ?? 0;
  let scale = Number(scaleInput.value) ?? 0;
  let spread = Number(spreadInput.value) ?? 0;
  let branches = Number(branchesInput.value) ?? 0;

  ctx.strokeStyle = colorInput.value ?? 'white';
  ctx.lineWidth = Number(branchWidthInput.value) ?? 0;
  ctx.lineCap = 'round';

  function drawBranch(level: number): void {
    if (level > Math.min(levels, MAX_LEVELS)) return;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    for (let i = 0; i < branches; i += 1) {
      const translate = size - (size / branches) * i;

      ctx.save();
      ctx.translate(translate, 0);
      ctx.rotate(spread);
      ctx.scale(scale, scale);
      drawBranch(level + 1);
      ctx.restore();

      ctx.save();
      ctx.translate(translate, 0);
      ctx.rotate(-spread);
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

    for (let i = 0; i < sides; i += 1) {
      ctx.rotate((Math.PI * 2) / sides);
      drawBranch(0);
    }

    ctx.restore();
  }

  drawFractal();
}
