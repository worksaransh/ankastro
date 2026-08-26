// Generate a 1080x1080 shareable PNG card (WhatsApp/Instagram).
// Pure HTML Canvas — no external libs, no html2canvas.

import type { NumerologyProfile } from './numerology';
import type { VedicProfile } from './vedicNumerology';

interface ShareCardInput {
  fullName: string;
  profile: NumerologyProfile;
  vedicProfile: VedicProfile;
  archetypeTitle?: string;
  language?: 'en' | 'hi' | 'hinglish';
}

const ROYAL_PURPLE = '#5F4B8B';
const ROYAL_LIGHT = '#F3E7FF';
const GOLD = '#E6C849';
const INK = '#1F1A2E';

const labels = {
  en: {
    brand: 'Ankjyotish AI',
    tagline: 'Your Cosmic Blueprint',
    mulank: 'Mulank',
    bhagyank: 'Bhagyank',
    lifePath: 'Life Path',
    archetype: 'Archetype',
    footer: 'Discover yours →  ankjyotish.ai',
  },
  hi: {
    brand: 'अंकज्योतिष AI',
    tagline: 'आपका कॉस्मिक ब्लूप्रिंट',
    mulank: 'मूलांक',
    bhagyank: 'भाग्यांक',
    lifePath: 'जीवन पथ',
    archetype: 'व्यक्तित्व',
    footer: 'अपना देखें →  ankjyotish.ai',
  },
  hinglish: {
    brand: 'Ankjyotish AI',
    tagline: 'Aapka Cosmic Blueprint',
    mulank: 'Mulank',
    bhagyank: 'Bhagyank',
    lifePath: 'Life Path',
    archetype: 'Archetype',
    footer: 'Apna dekhein →  ankjyotish.ai',
  },
} as const;

export async function generateShareableImage(input: ShareCardInput): Promise<Blob> {
  const { fullName, profile, vedicProfile, archetypeTitle, language = 'en' } = input;
  const t = labels[language];

  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!;

  // Royal Aura gradient background
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, '#2A1B4A');
  grad.addColorStop(0.55, ROYAL_PURPLE);
  grad.addColorStop(1, '#8B6FB8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Soft radial glow (top-right)
  const glow = ctx.createRadialGradient(SIZE * 0.78, SIZE * 0.18, 20, SIZE * 0.78, SIZE * 0.18, 520);
  glow.addColorStop(0, 'rgba(243,231,255,0.45)');
  glow.addColorStop(1, 'rgba(243,231,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Decorative dots pattern
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 60; i++) {
    const x = (i * 137) % SIZE;
    const y = (i * 211) % SIZE;
    ctx.beginPath();
    ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  // Top brand bar
  ctx.fillStyle = GOLD;
  ctx.font = '600 36px "Inter", system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('✦  ' + t.brand, 80, 110);

  // Tagline
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '400 28px "Inter", system-ui, sans-serif';
  ctx.fillText(t.tagline, 80, 155);

  // Name (centered, large)
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  const displayName = fullName.length > 26 ? fullName.slice(0, 24) + '…' : fullName;
  ctx.font = '700 64px "Playfair Display", Georgia, serif';
  ctx.fillText(displayName, SIZE / 2, 280);

  // Three big numbers row
  const numbers = [
    { label: t.mulank, value: vedicProfile.mulank },
    { label: t.lifePath, value: profile.lifePath },
    { label: t.bhagyank, value: vedicProfile.bhagyank },
  ];

  const colY = 470;
  const colW = SIZE / 3;
  numbers.forEach((n, i) => {
    const cx = colW * i + colW / 2;

    // Circle backdrop
    ctx.beginPath();
    ctx.arc(cx, colY, 110, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Number
    ctx.fillStyle = GOLD;
    ctx.font = '700 120px "Playfair Display", Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(n.value), cx, colY + 4);
    ctx.textBaseline = 'alphabetic';

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '500 30px "Inter", sans-serif';
    ctx.fillText(n.label, cx, colY + 175);
  });

  // Archetype card
  if (archetypeTitle) {
    const cardY = 740;
    const cardH = 180;
    const cardX = 80;
    const cardW = SIZE - 160;

    ctx.fillStyle = 'rgba(243,231,255,0.95)';
    roundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fill();

    ctx.fillStyle = ROYAL_PURPLE;
    ctx.font = '500 28px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦  ' + t.archetype + '  ✦', SIZE / 2, cardY + 56);

    ctx.fillStyle = INK;
    ctx.font = '700 46px "Playfair Display", Georgia, serif';
    const archShort = archetypeTitle.length > 32 ? archetypeTitle.slice(0, 30) + '…' : archetypeTitle;
    ctx.fillText(archShort, SIZE / 2, cardY + 122);
  }

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 26px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t.footer, SIZE / 2, SIZE - 60);

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob failed'))), 'image/png', 0.95);
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function downloadShareableImage(input: ShareCardInput, filename = 'ankjyotish-summary.png') {
  const blob = await generateShareableImage(input);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareImageNative(input: ShareCardInput): Promise<boolean> {
  const blob = await generateShareableImage(input);
  const file = new File([blob], 'ankjyotish-summary.png', { type: 'image/png' });
  const nav = navigator as any;
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: 'My Ankjyotish AI Summary',
        text: 'My cosmic blueprint from Ankjyotish AI',
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
