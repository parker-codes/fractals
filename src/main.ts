import './style.css';

window.addEventListener('load', run);

console.log('script running');

function run(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // config
  let size = 200;
  let sides = 5;
  let maxLevel = 3;
  let scale = 0.5;
  let spread = 0.8;
  let branches = 2;

  ctx.strokeStyle = '#6D28D9';
  ctx.lineWidth = 30;
  ctx.lineCap = 'round';

  function drawBranch(level: number): void {
    if (level > maxLevel) return;

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
