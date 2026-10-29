import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, drawFn) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  function makeChunk(type, data) {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = zlib.crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw DemaQ icon: Dark slate / warm amber background with DemaQ cyan and golden amber shield/LED hexagon
function drawDemaqIcon(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const maxR = w / 2;

  // Background: Deep sleek obsidian with warm gradient
  const bgR = 15;
  const bgG = 23;
  const bgB = 42;

  // Maskable keeps padding, any has rounded squircle
  if (!isMaskable) {
    // Round icon corners with border
    const cornerR = w * 0.22;
    const dx = Math.max(0, Math.abs(x - cx) - (cx - cornerR));
    const dy = Math.max(0, Math.abs(y - cy) - (cy - cornerR));
    if (Math.sqrt(dx * dx + dy * dy) > cornerR) {
      return [0, 0, 0, 0]; // Transparent outside squircle
    }
  }

  // Hexagon / Shield outer ring: scale factor
  const scale = (w / 180) * (isMaskable ? 0.72 : 0.82);
  const relX = (x - cx) / scale;
  const relY = (y - cy) / scale;

  // Outer shield distance estimate
  const dist = Math.abs(relX) * 0.866 + Math.abs(relY) * 0.5;
  const inOuterHex = dist < 65 && Math.abs(relY) < 68 && Math.abs(relX) < 68;
  const inInnerHex = dist < 42 && Math.abs(relY) < 46 && Math.abs(relX) < 46;

  if (inOuterHex && !inInnerHex) {
    // Shield gradient: Amber to Cyan
    const t = (relY + 68) / 136;
    const sr = Math.round(229 * (1 - t) + 2 * t);
    const sg = Math.round(167 * (1 - t) + 132 * t);
    const sb = Math.round(59 * (1 - t) + 199 * t);
    return [sr, sg, sb, 255];
  }

  // Center display area: Robot LED face
  if (Math.abs(relX) < 26 && Math.abs(relY) < 22) {
    // Eye positions
    const isLeftEye = Math.abs(relX + 11) < 4 && Math.abs(relY - 1) < 4;
    const isRightEye = Math.abs(relX - 11) < 4 && Math.abs(relY - 1) < 4;
    if (isLeftEye || isRightEye) {
      return [56, 189, 248, 255]; // Cyan eye pixel
    }
    return [2, 6, 23, 255]; // Dark screen face
  }

  // Inner background fill
  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. pwa-192x192.png
const pwa192 = createPng(192, 192, (x, y, w, h) => drawDemaqIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// 2. pwa-512x512.png
const pwa512 = createPng(512, 512, (x, y, w, h) => drawDemaqIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// 3. pwa-maskable-512x512.png
const pwaMaskable512 = createPng(512, 512, (x, y, w, h) => drawDemaqIcon(x, y, w, h, true));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable512);

// 4. apple-touch-icon.png (180x180)
const appleIcon = createPng(180, 180, (x, y, w, h) => drawDemaqIcon(x, y, w, h, false));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// 5. icon.svg
if (fs.existsSync(path.join(publicDir, 'favicon.svg'))) {
  fs.copyFileSync(path.join(publicDir, 'favicon.svg'), path.join(publicDir, 'icon.svg'));
}

console.log('PWA icons successfully generated in public/ directory!');
