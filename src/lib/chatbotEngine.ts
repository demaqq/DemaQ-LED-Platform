export interface ChatbotSpecResult {
  width: number;
  height: number;
  area: number;
  pitch: string;
  pitchMm: number;
  resW: number;
  resH: number;
  totalPixels: number;
  cabinets: number;
  modules32x16: number;
  avgWatts: number;
  peakWatts: number;
  peakAmps220V: string;
  breakerRec: string;
  generatorKva: string;
  controller: string;
  availability: string;
}

export interface ChatActionChip {
  label: string;
  actionType: 'prompt' | 'navigate' | 'external';
  target: string;
}

export interface ChatbotResponse {
  reply: string;
  chips: ChatActionChip[];
}

/**
 * Computes exact engineering display specifications for any dimension and pitch.
 */
export function computeLedSpecs(w: number, h: number, pitchMm = 2.5): ChatbotSpecResult {
  const area = w * h;
  const resW = Math.round((w * 1000) / pitchMm);
  const resH = Math.round((h * 1000) / pitchMm);
  const totalPixels = resW * resH;

  // 640x480mm die-cast aluminum cabinets
  const cabCols = Math.ceil(w / 0.64);
  const cabRows = Math.ceil(h / 0.48);
  const cabinets = cabCols * cabRows;

  // 320x160mm modules
  const modCols = Math.ceil(w / 0.32);
  const modRows = Math.ceil(h / 0.16);
  const modules32x16 = modCols * modRows;

  const isCob = pitchMm < 2.0;
  const isOutdoor = pitchMm >= 3.9;

  // Power calculations (W/m2)
  const avgWPerM2 = isCob ? 95 : isOutdoor ? 145 : 120;
  const peakWPerM2 = isCob ? 240 : isOutdoor ? 380 : 300;

  const avgWatts = Math.round(area * avgWPerM2);
  const peakWatts = Math.round(area * peakWPerM2);
  const peakAmps = (peakWatts / 220).toFixed(1);

  const breakerRec = peakWatts > 7000
    ? `${(peakWatts / 3 / 220 * 1.25).toFixed(0)}A 3-Phase`
    : `${Math.ceil(parseFloat(peakAmps) * 1.25)}A Single-Phase (220V)`;

  const generatorKva = ((peakWatts * 1.35) / 1000).toFixed(1);

  let controller = 'NovaStar VX400 (4-Port All-in-One)';
  if (totalPixels > 6500000) {
    controller = 'NovaStar NovaPro UHD / VX16s';
  } else if (totalPixels > 3900000) {
    controller = 'NovaStar VX1000 (10-Port, 6.5M px)';
  } else if (totalPixels > 2300000) {
    controller = 'NovaStar VX600 / Huidu VP820';
  } else if (totalPixels > 1300000) {
    controller = 'NovaStar VX400';
  } else {
    controller = 'NovaStar Taurus TB30/TB50 (Cloud/4G)';
  }

  const availability = isCob
    ? 'Custom Air Import (14-21 Days)'
    : 'In-Stock Bole Addis Ababa (24-48h Setup)';

  return {
    width: w,
    height: h,
    area,
    pitch: `P${pitchMm}`,
    pitchMm,
    resW,
    resH,
    totalPixels,
    cabinets,
    modules32x16,
    avgWatts,
    peakWatts,
    peakAmps220V: peakAmps,
    breakerRec,
    generatorKva,
    controller,
    availability
  };
}

/**
 * Detect language from text or user preference.
 */
export function detectLanguage(text: string, currentLang = 'en'): string {
  const query = text.toLowerCase().trim();

  // Ethiopic script check
  if (/[\u1200-\u137F]/.test(text)) {
    if (query.includes('ከመይ') || query.includes('እንታይ') || query.includes('ዋጋኡ') || query.includes('ክንደይ') || query.includes('ስክሪንካ') || query.includes('ጸብጽብ')) {
      return 'ti';
    }
    return 'am';
  }

  // Oromo keyword check
  if (/\b(akkam|akkamitti|maaloo|meeqa|gatii|eessatti|iskiriinii|eessa|akkamiin|wabiin|sagadaa|dhaabuu|bittaa|shallagaa)\b/i.test(query)) {
    return 'om';
  }

  // Somali keyword check
  if (/\b(sidee|maxaa|waa|intee|lacagta|shaashadda|fadlan|halkee|dayactir|xisaabi|qiimaha)\b/i.test(query)) {
    return 'so';
  }

  // Arabic script check
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar';
  }

  return currentLang || 'en';
}

/**
 * Extract pixel pitch number if user typed something like P1.8, P2.5, P3.9, P4, P10
 */
function extractPitch(text: string, defaultPitch = 2.5): number {
  const match = text.match(/\bp\s*([0-9]+(?:\.[0-9]+)?)\b/i);
  if (match) {
    const val = parseFloat(match[1]);
    if (val >= 0.7 && val <= 20) return val;
  }
  if (text.includes('cob')) return 1.5;
  if (text.includes('outdoor') || text.includes('billboard') || text.includes('የውጭ')) return 3.9;
  return defaultPitch;
}

/**
 * Comprehensive, trained multilingual engine for instant, precise, concise answers.
 */
export function getExtensiveChatbotReply(userQuery: string, currentLang = 'en'): ChatbotResponse {
  const query = userQuery.trim().toLowerCase();
  const lang = detectLanguage(userQuery, currentLang);

  // 1. DIMENSION CALCULATIONS (e.g., 4x3, 6x4m, 10 by 5, 4 በ 3, 3x2, 2.5x1.5, 300sqm)
  const dimMatch = userQuery.match(/(\d+(?:\.\d+)?)\s*(?:x|×|\*|by|በ|fi|iyo)\s*(\d+(?:\.\d+)?)(?:\s*(?:m|meter|meters|ሜትር|mitira|mitir))?/i);
  if (dimMatch) {
    const w = parseFloat(dimMatch[1]);
    const h = parseFloat(dimMatch[2]);
    if (w > 0 && h > 0) {
      const pitch = extractPitch(userQuery, 2.5);
      const spec = computeLedSpecs(w, h, pitch);

      if (lang === 'am') {
        return {
          reply: `📐 **የስክሪን ስሌት (${w}m × ${h}m · ${spec.area.toFixed(1)} m² · ${spec.pitch})**\n` +
            `• **ሬዞሉሽን**፡ ${spec.resW} × ${spec.resH} px (${spec.totalPixels.toLocaleString()} ዳዮዶች)\n` +
            `• **ካቢኔቶች (640×480mm)**፡ ~${spec.cabinets} ካቢኔቶች (${spec.modules32x16} ሞጁሎች)\n` +
            `• **የኤሌክትሪክ ፍጆታ**፡ ${(spec.avgWatts / 1000).toFixed(1)} kW መደበኛ | ${(spec.peakWatts / 1000).toFixed(1)} kW ከፍተኛ (${spec.peakAmps220V}A @ 220V)\n` +
            `• **የሚመከር ጀነሬተር / ብሬከር**፡ ${spec.generatorKva} kVA ጀነሬተር | ${spec.breakerRec}\n` +
            `• **ኮንትሮለር**፡ ${spec.controller}\n` +
            `• **አቅርቦት**፡ ${spec.availability}\n` +
            `• **ፕሮፎርማ**፡ በ WhatsApp (+251 942 992 799) ወይም በፕሮፎርማ ማውጫው በ 2 ሰዓት ውስጥ ይደርሳል።`,
          chips: [
            { label: 'በ AR ካሜራ ሞክር', actionType: 'navigate', target: 'ar-visualizer' },
            { label: 'ፕሮፎርማ ማውጫ', actionType: 'navigate', target: 'proforma-matrix' },
            { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
          ]
        };
      }

      if (lang === 'om') {
        return {
          reply: `📐 **Shallaggii Iskiriinii (${w}m × ${h}m · ${spec.area.toFixed(1)} m² · ${spec.pitch})**\n` +
            `• **Reezolushinii**: ${spec.resW} × ${spec.resH} px (${spec.totalPixels.toLocaleString()} piksilii)\n` +
            `• **Kaabineetii**: ~${spec.cabinets} (640×480mm) | Modiyulii: ${spec.modules32x16}\n` +
            `• **Humna Elektiriikii**: ${(spec.avgWatts / 1000).toFixed(1)} kW giddu-galeessa | ${(spec.peakWatts / 1000).toFixed(1)} kW ol'aanaa (${spec.peakAmps220V}A @ 220V)\n` +
            `• **Jeneretara**: ${spec.generatorKva} kVA | Breaker: ${spec.breakerRec}\n` +
            `• **Tooftuu (Controller)**: ${spec.controller}\n` +
            `• **Kuusaa**: ${spec.availability}\n` +
            `• **Proforma**: WhatsApp (+251 942 992 799) ykn proforma jeneretariin gaafadhaa.`,
          chips: [
            { label: 'AR Kaameraa', actionType: 'navigate', target: 'ar-visualizer' },
            { label: 'Proforma Generator', actionType: 'navigate', target: 'proforma-matrix' },
            { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
          ]
        };
      }

      if (lang === 'ti') {
        return {
          reply: `📐 **ስሌት ስክሪን (${w}m × ${h}m · ${spec.area.toFixed(1)} m² · ${spec.pitch})**\n` +
            `• **ሬዞሉሽን**: ${spec.resW} × ${spec.resH} px (${spec.totalPixels.toLocaleString()} ዳዮድ)\n` +
            `• **ካቢኔት (640×480mm)**: ~${spec.cabinets} (${spec.modules32x16} ሞጁላት)\n` +
            `• **ሓይሊ ኤሌክትሪክ**: ${(spec.avgWatts / 1000).toFixed(1)} kW | ${(spec.peakWatts / 1000).toFixed(1)} kW (${spec.peakAmps220V}A @ 220V)\n` +
            `• **ጀነሬተር**: ${spec.generatorKva} kVA | ብሬከር: ${spec.breakerRec}\n` +
            `• **ኮንትሮለር**: ${spec.controller}\n` +
            `• **ህላወ**: ${spec.availability}\n` +
            `• **ፕሮፎርማ**: ብ WhatsApp (+251 942 992 799) ሕተቱ።`,
          chips: [
            { label: 'AR ካሜራ', actionType: 'navigate', target: 'ar-visualizer' },
            { label: 'ፕሮፎርማ ሕተት', actionType: 'navigate', target: 'proforma-matrix' },
            { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
          ]
        };
      }

      if (lang === 'so') {
        return {
          reply: `📐 **Faahfaahinta Shaashadda (${w}m × ${h}m · ${spec.area.toFixed(1)} m² · ${spec.pitch})**\n` +
            `• **Qaraarka (Resolution)**: ${spec.resW} × ${spec.resH} px (${spec.totalPixels.toLocaleString()} pixels)\n` +
            `• **Golaha (Cabinets)**: ~${spec.cabinets} unugyo (640×480mm)\n` +
            `• **Awoodda Korontada**: ${(spec.avgWatts / 1000).toFixed(1)} kW dhexe | ${(spec.peakWatts / 1000).toFixed(1)} kW ugu sarreeya (${spec.peakAmps220V}A)\n` +
            `• **Jeneraalka**: ${spec.generatorKva} kVA | Breaker: ${spec.breakerRec}\n` +
            `• **Koontaroolka**: ${spec.controller}\n` +
            `• **Kaydka**: ${spec.availability}\n` +
            `• **Qaansheegta Proforma**: WhatsApp (+251 942 992 799) nala soo xiriir.`,
          chips: [
            { label: 'Qalabka AR', actionType: 'navigate', target: 'ar-visualizer' },
            { label: 'Soo saar Proforma', actionType: 'navigate', target: 'proforma-matrix' },
            { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
          ]
        };
      }

      if (lang === 'ar') {
        return {
          reply: `📐 **مواصفات الشاشة (${w}م × ${h}م · ${spec.area.toFixed(1)} م² · ${spec.pitch})**\n` +
            `• **الدقة**: ${spec.resW} × ${spec.resH} بكسل (${spec.totalPixels.toLocaleString()} بكسل)\n` +
            `• **الكبائن**: ~${spec.cabinets} كابينة (640×480 مم)\n` +
            `• **استهلاك الطاقة**: ${(spec.avgWatts / 1000).toFixed(1)} ك.و متوسط | ${(spec.peakWatts / 1000).toFixed(1)} ك.و أقصى (${spec.peakAmps220V} أمبير)\n` +
            `• **المولد الموصى به**: ${spec.generatorKva} kVA | القاطع: ${spec.breakerRec}\n` +
            `• **المعالج الموصى به**: ${spec.controller}\n` +
            `• **التوفر**: ${spec.availability}\n` +
            `• **عرض السعر الرسمي**: عبر واتساب (+251 942 992 799).`,
          chips: [
            { label: 'معاينة AR', actionType: 'navigate', target: 'ar-visualizer' },
            { label: 'واتساب مباشر', actionType: 'external', target: 'https://wa.me/251942992799' }
          ]
        };
      }

      // Default English
      return {
        reply: `📐 **Display Engineering Specs: ${w}m × ${h}m (${spec.area.toFixed(1)} m² · ${spec.pitch})**\n` +
          `• **Native Resolution**: ${spec.resW} × ${spec.resH} px (${spec.totalPixels.toLocaleString()} diodes)\n` +
          `• **Cabinet Array**: ~${spec.cabinets} units (640×480mm die-cast aluminum) | ${spec.modules32x16} modules\n` +
          `• **Power Consumption**: ${(spec.avgWatts / 1000).toFixed(1)} kW avg | ${(spec.peakWatts / 1000).toFixed(1)} kW peak (${spec.peakAmps220V}A @ 220V)\n` +
          `• **Generator & Breaker**: ${spec.generatorKva} kVA generator | ${spec.breakerRec}\n` +
          `• **Recommended Processor**: ${spec.controller}\n` +
          `• **Local Status**: ${spec.availability}\n` +
          `• **Proforma Invoice**: Quoted with 15% VAT upon request via WhatsApp (+251 942 992 799).`,
        chips: [
          { label: 'Preview in AR Room', actionType: 'navigate', target: 'ar-visualizer' },
          { label: 'Generate Proforma', actionType: 'navigate', target: 'proforma-matrix' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
  }

  // 2. POWER & GENERATOR SIZING (Electricity, Grid, Voltage, Generator, kVA, 220V, Breaker)
  if (query.includes('generator') || query.includes('power') || query.includes('watt') || query.includes('kva') || query.includes('amp') || query.includes('voltage') || query.includes('breaker') || query.includes('ጀነሬተር') || query.includes('ኤሌክትሪክ') || query.includes('ፍጆታ') || query.includes('humna') || query.includes('koronto')) {
    if (lang === 'am') {
      return {
        reply: `⚡ **የ LED ስክሪን ኤሌክትሪክ እና የጀነሬተር ስሌት መመሪያ፡**\n` +
          `• **የስሌት ቀመር**፡ የስክሪኑ ከፍተኛ ዋት (Peak kW) × 1.35 = የሚመከር የጀነሬተር መጠን (kVA)።\n` +
          `• **ለምሳሌ (4×3 ሜትር ስክሪን)**፡ 3.6 kW ከፍተኛ ፍጆታ → **5 kVA** ወይም ከዚያ በላይ ጀነሬተር ያስፈልጋል።\n` +
          `• **የመብራት መለዋወጥ ጥበቃ**፡ ሁሉም የ DemaQ ስክሪኖች የኢትዮጵያን 180V–265V መዋዠቅ የሚቋቋሙ MeanWell 5V 60A PSUs የተገጠመላቸው ናቸው።\n` +
          `• **የመሬት መስመር (Grounding)**፡ ከ 4Ω በታች የሆነ የኮፐር ሮድ ተከላ ይመከራል።`,
        chips: [
          { label: 'የ 4x3m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `⚡ **Power Load & Generator Sizing Guide:**\n` +
        `• **Sizing Formula**: Screen Peak kW × 1.35 = Minimum Required Generator kVA.\n` +
        `• **Example (4×3m screen)**: 3.6 kW peak draw → Requires a **5.0 kVA** continuous generator.\n` +
        `• **Grid Fluctuation Protection**: Equipped with MeanWell 5V 60A supplies with active PFC (>0.95), safely handling 180V–265V Ethiopian grid transients.\n` +
        `• **Grounding**: Standard <4Ω dedicated earth rod recommended to prevent EMI diode flicker.`,
      chips: [
        { label: 'Calculate 4×3m Load', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 3. REFRESH RATE, SCANLINES & CAMERA RECORDING (3840Hz, 1920Hz, flickering, phone video)
  if (query.includes('refresh') || query.includes('flicker') || query.includes('camera') || query.includes('3840') || query.includes('scan') || query.includes('ቪዲዮ') || query.includes('ካሜራ') || query.includes('መብረቅረቅ')) {
    if (lang === 'am') {
      return {
        reply: `🎥 **የስክሪን ሪፍሬሽ ሬት (Refresh Rate) እና የካሜራ ጥራት፡**\n` +
          `• **3,840Hz Ultra-High Refresh**፡ በስልክ ወይም በ 4K ካሜራ ሲቀረጽ የሚታዩ ጥቁር የሚንሸራተቱ መስመሮችን (Moire/scanlines) 100% ያስቀራል።\n` +
          `• **1/16 vs 1/32 Scan Rate**፡ ዝቅተኛ የስካን መጠን ከፍተኛ ብሩህነት እና የተረጋጋ ምስል ይሰጣል።\n` +
          `• **የቀጥታ ስርጭት (Livestream)**፡ ለቤተክርስቲያን፣ ለቴሌቪዥን ስቱዲዮ እና ለኮንፈረንስ 3,840Hz DemaQ Shield-GOB መደበኛ ምርጫችን ነው።`,
        chips: [
          { label: 'የቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `🎥 **Refresh Rate & Camera Recording Standards:**\n` +
        `• **3,840Hz High Refresh**: Completely eliminates rolling shutter scanlines, dark bars, and moiré when filmed on smartphones or 4K broadcast cameras.\n` +
        `• **Low Scan Ratios**: 1/16 and 1/8 scan rates maintain constant diode luminosity with zero perceptible flicker.\n` +
        `• **Live Broadcast Ready**: DEMAQ Shield-GOB screens are calibrated for YouTube/TV livestreams, worship services, and conference presentations.`,
      chips: [
        { label: 'Church Sanctuary Specs', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 4. CHURCH & WORSHIP SANCTUARIES
  if (query.includes('church') || query.includes('worship') || query.includes('sanctuary') || query.includes('pastor') || query.includes('choir') || query.includes('ቤተክርስቲያን') || query.includes('ህብረት') || query.includes('sagadaa') || query.includes('kaniisad')) {
    if (lang === 'am') {
      return {
        reply: `⛪ **ለቤተክርስቲያን DEMAQ Shield-GOB P2.5 ስክሪን፡**\n` +
          `• **የ GOB ጥበቃ**፡ በመድረክ ላይ የዘማሪዎች፣ ማይክሮፎን ወይም ሰው ንክኪ ቢኖርም ዳዮዶች አይረግፉም (100% በጠንካራ ኢፖክሲ የተጠበቀ)።\n` +
          `• **የካሜራ ጥራት**፡ 3,840Hz ሪፍሬሽ ሬት ስላለው በቀጥታ ስርጭት ላይ ምንም አይነት ጥቁር መስመር አይታይም።\n` +
          `• **የእይታ ማዕዘን**፡ 160° ሰፊ እይታ ከጎን ላሉ ተሰብሳቢዎች ግልፅ እይታ ይሰጣል።\n` +
          `• **ተወዳጅ ስፋቶች**፡ 4.8m × 2.88m (1080p HD) እና 6.4m × 3.84m። በአዲስ አበባ መጋዘን ዝግጁ ነው።`,
        chips: [
          { label: 'የ 4.8x2.88m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4.8x2.88m' },
          { label: 'በ AR ካሜራ ሞክር', actionType: 'navigate', target: 'ar-visualizer' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `⛪ **House of Worship Standards (DEMAQ Shield-GOB P2.5):**\n` +
        `• **Collision-Proof GOB**: Hardened optical epoxy protects diodes against choir bumps, stage movement, and liquid wipes.\n` +
        `• **Livestream Camera Ready**: 3,840Hz high refresh rate eliminates rolling shutter scanlines on 4K cameras.\n` +
        `• **Wide 160° Viewing**: Side-aisle congregants see vivid colors with zero color wash-out.\n` +
        `• **Popular Formats**: 4.8m × 2.88m (16:9 1080p) and 6.4m × 3.84m. Ready in Addis Ababa for 24-48h setup.`,
      chips: [
        { label: 'Calculate 4.8×2.88m', actionType: 'prompt', target: 'Calculate 4.8x2.88m' },
        { label: 'Preview in AR Room', actionType: 'navigate', target: 'ar-visualizer' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 5. CONTROLLERS: NOVASTAR, HUIDU, COLORLIGHT
  if (query.includes('controller') || query.includes('processor') || query.includes('novastar') || query.includes('huidu') || query.includes('colorlight') || query.includes('vx400') || query.includes('vx1000') || query.includes('tb30') || query.includes('tb50') || query.includes('ኮንትሮለር') || query.includes('ኖቫስታር')) {
    if (lang === 'am') {
      return {
        reply: `⚙️ **የሚደገፉ የ LED ኮንትሮለሮች (በአዲስ አበባ መጋዘን ዝግጁ)፡**\n` +
          `• **NovaStar VX400**፡ 4 Gigabit ፖርቶች (እስከ 2.6 ሚሊዮን ፒክስል)፣ HDMI/DVI ግብዓት፣ ለቤተክርስቲያንና ለአዳራሾች ምርጥ።\n` +
          `• **NovaStar VX1000**፡ 10 ፖርቶች (እስከ 6.5 ሚሊዮን ፒክስል)፣ 4K×1K ለትላልቅ ስክሪኖች።\n` +
          `• **NovaStar Taurus TB30/TB50**፡ ያለ ኮምፒውተር በፍላሽ (USB) ወይም በስልክ Wi-Fi በቀጥታ የሚያጫውቱ ክላውድ ማጫወቻዎች።\n` +
          `• **Huidu C16/C36**፡ በ LedArt አፕሊኬሽን ከስልክ የሚቆጣጠሩ ወጪ ቆጣቢ ክላውድ ኮንትሮለሮች።`,
        chips: [
          { label: 'የፍላሽ እና ዋይፋይ አጠቃቀም', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `⚙️ **Certified Controllers (In-Stock Addis Ababa):**\n` +
        `• **NovaStar VX400**: 4 Gigabit output ports (up to 2.6M pixels), HDMI/DVI ingest, all-in-one video processing.\n` +
        `• **NovaStar VX1000**: 10 Gigabit ports (up to 6.5M pixels), 4K×1K support for large arena walls.\n` +
        `• **Taurus TB30/TB50**: Standalone cloud multimedia players for auto-looping USB/Wi-Fi playback without a PC.\n` +
        `• **Huidu C16/C36**: Mobile-controlled async media controllers configured via LedArt app.`,
      chips: [
        { label: 'USB & Wi-Fi Setup', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 6. PLAYBACK: USB FLASH, WI-FI PHONE, LAPTOP HDMI
  if (query.includes('usb') || query.includes('flash') || query.includes('wifi') || query.includes('wi-fi') || query.includes('phone') || query.includes('mobile') || query.includes('hdmi') || query.includes('ፍላሽ') || query.includes('ስልክ') || query.includes('ኮምፒውተር') || query.includes('play')) {
    if (lang === 'am') {
      return {
        reply: `📱 **የቪዲዮ እና ምስል ማጫወቻ አማራጮች፡**\n` +
          `• **በፍላሽ (USB)**፡ ቪዲዮዎችን በፍላሽ ላይ ጭነው በ NovaStar Taurus TB30/TB50 ወይም Huidu C16 በቀጥታ ኮምፒውተር ሳያስፈልግ ማጫወት ይችላሉ።\n` +
          `• **በሞባይል Wi-Fi**፡ በ ViPlex Handy ወይም LedArt አፕሊኬሽን ከስልክዎ ቪዲዮዎችን እና ፅሁፎችን በቀጥታ ማስተላለፍ ይቻላል።\n` +
          `• **በላፕቶፕ (HDMI)**፡ በቀጥታ ስርጭት ወቅት ከኮምፒውተር ጋር በ HDMI ገመድ ይገናኛል።`,
        chips: [
          { label: 'ኖቫስታር VS ሁይዱ', actionType: 'prompt', target: 'NovaStar vs Huidu' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `📱 **Playback & Control Modes:**\n` +
        `• **USB Flash Drive**: Plug any USB flash drive into NovaStar TB30/TB50 or Huidu players for automatic video loop without a PC.\n` +
        `• **Mobile Phone Wi-Fi**: Upload videos and text schedules directly from your iPhone/Android via ViPlex Handy or LedArt apps.\n` +
        `• **Live Ingest (HDMI/DVI)**: Connect laptops or live cameras for zero-latency presentation and church broadcasting.`,
      chips: [
        { label: 'NovaStar vs Huidu', actionType: 'prompt', target: 'NovaStar vs Huidu' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 7. GOB VS COB VS SMD
  if (query.includes('gob') || query.includes('cob') || query.includes('smd') || query.includes('ልዩነት') || query.includes('difference') || query.includes('ኢፖክሲ') || query.includes('ጥንካሬ')) {
    if (lang === 'am') {
      return {
        reply: `🔍 **የ GOB እና COB ቴክኖሎጂ ልዩነት፡**\n` +
          `• **DEMAQ Shield-GOB (P2.5 & P3.0)**፡ በ SMD ዳዮዶች ላይ የፈሰሰ መስታወት መሰል ጠንካራ ኢፖክሲ ነው። 100% ከመመታት፣ ከውሃ እና ከአቧራ የተጠበቀ (በአዲስ አበባ መጋዘን ዝግጁ)።\n` +
          `• **DEMAQ Flip-Chip COB (<P2.0)**፡ ማይክሮ-ቺፖች በቀጥታ በቦርዱ ላይ የተገጠሙበት ሲሆን 10,000:1 ጥቁረት እና 12°C ቅዝቃዜ ይሰጣል። ለባንክ መቆጣጠሪያ ክፍል እና ለቦርድ ሩም ተመራጭ ነው።\n` +
          `• **SMD (ባህላዊ)**፡ ዳዮዶቹ ክፍት ስለሆኑ በቀላሉ ሊረግፉ ይችላሉ። DemaQ ለዘላቂነት GOB ወይም COB ብቻ ይመክራል።`,
        chips: [
          { label: 'የቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `🔍 **GOB vs COB vs Standard SMD Technology:**\n` +
        `• **DEMAQ Shield-GOB (P2.5 / P3.0)**: Optical epoxy encapsulant over SMD diodes. 100% collision-proof, moisture-proof, wipe-clean. In-stock Addis Ababa (24-48h setup).\n` +
        `• **DEMAQ Flip-Chip COB (<P2.0)**: Wireless micro-LED chips bonded directly to PCB. 10,000:1 contrast, runs 12°C cooler. Custom air import for executive boardrooms & SOC.\n` +
        `• **Traditional SMD**: Exposed bare diodes vulnerable to accidental bumps. DemaQ standardizes on GOB and COB for durability.`,
      chips: [
        { label: 'Church Sanctuary Screen', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 8. PIXEL PITCH & VIEWING DISTANCE GUIDE
  if (query.includes('pitch') || query.includes('distance') || query.includes('እይታ') || query.includes('ርቀት') || query.includes('p2.5') || query.includes('p1.8') || query.includes('p3') || query.includes('p4') || query.includes('1080p') || query.includes('4k')) {
    if (lang === 'am') {
      return {
        reply: `👁️ **የፒክሰል ፒች (Pixel Pitch) እና ዝቅተኛ የእይታ ርቀት መመሪያ፡**\n` +
          `• **የስሌት ህግ**፡ ፒች (mm) × 1.0 ሜትር = ፒክሰሉ ሳይቆራረጥ ጥራት ያለው ምስል የሚታይበት ዝቅተኛ ርቀት።\n` +
          `• **P1.5 - P1.8 COB**፡ ከ 1.5 ሜትር ጀምሮ ጥርት ያለ (ለቦርድ ሩምና ለመቆጣጠሪያ ማዕከላት)።\n` +
          `• **P2.5 GOB (በመጋዘን ዝግጁ)**፡ ከ 2.5 ሜትር ጀምሮ ድንቅ እይታ (ለቤተክርስቲያን፣ ለአዳራሽ፣ ለንግድ ሱቆች)።\n` +
          `• **P3.9 - P4.8 DOOH**፡ ከ 4 እስከ 40 ሜትር (ለመድረክ ኪራይ እና ለውጭ ማስታወቂያ ሰሌዳዎች)።`,
        chips: [
          { label: 'የ 4x3m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `👁️ **Pixel Pitch & Minimum Retina Viewing Distance:**\n` +
        `• **Formula**: Pitch (mm) × 1.0m = Minimum unpixelated retina viewing distance.\n` +
        `• **P1.5 - P1.8 COB**: Sharp from 1.5m (Executive boardrooms, command centers, broadcast sets).\n` +
        `• **P2.5 Shield-GOB (In-Stock)**: Crystal clear from 2.5m (Churches, retail malls, auditoriums).\n` +
        `• **P3.9 - P4.8 DOOH**: Optimal from 4m to 40m (Event stage rentals, outdoor billboards).`,
      chips: [
        { label: 'Calculate 4×3m Wall', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 9. OUTDOOR DOOH BILLBOARDS
  if (query.includes('outdoor') || query.includes('dooh') || query.includes('billboard') || query.includes('የውጭ') || query.includes('ማስታወቂያ') || query.includes('nits') || query.includes('weatherproof')) {
    if (lang === 'am') {
      return {
        reply: `☀️ **የውጭ ዲጂታል ማስታወቂያ ሰሌዳዎች (DEMAQ Horizon DOOH)፡**\n` +
          `• **የቀን ብሩህነት**፡ 8,500 - 10,000 Nits የፀሐይ ብርሃን ዘልቆ የሚታይ ብሩህነት።\n` +
          `• **የአየር ሁኔታ መከላከያ**፡ IP66 የዝናብ እና የአቧራ መከላከያ፣ 120 km/h የንፋስ ግፊት የሚቋቋም።\n` +
          `• **የኃይል ቆጣቢነት (Common-Cathode)**፡ 35% የኤሌክትሪክ ፍጆታ የሚቀንስ እና 15°C ቀዝቃዛ አሰራር።\n` +
          `• **የኢትዮጵያ ሚዲያ ባለስልጣን ደንብ**፡ በራስ-ሰር በምሽት ብሩህነቱን ወደ 1,200 ኒትስ የሚቀንስ ዳሳሽ (Photodiode) ተገጥሞለታል።`,
        chips: [
          { label: 'የ 6x4m የውጭ ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 6x4m outdoor' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `☀️ **Outdoor DOOH Billboards (DEMAQ Horizon Series):**\n` +
        `• **Daylight Penetration**: 8,500 to 10,000 Nits sunlight brightness with auto-dimming sensors.\n` +
        `• **Weatherproofing**: IP66 waterproof and dust-tight, certified for 120 km/h storm shear.\n` +
        `• **Common-Cathode Efficiency**: Dual-rail voltage (2.8V / 3.8V) cuts electricity costs by 35% and runs 15°C cooler.\n` +
        `• **Regulatory Compliance**: Integrated photodiode sensor auto-dims to 1,200 nits at night adhering to Ethiopian Media Authority signage guidelines.`,
      chips: [
        { label: 'Calculate 6×4m Outdoor', actionType: 'prompt', target: 'Calculate 6x4m outdoor' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 10. REPAIRS, TROUBLESHOOTING & MAINTENANCE
  if (query.includes('repair') || query.includes('troubleshoot') || query.includes('broken') || query.includes('dead pixel') || query.includes('dark module') || query.includes('ጥገና') || query.includes('ብልሽት') || query.includes('ተበላሸ') || query.includes('suphaa') || query.includes('dayactir')) {
    if (lang === 'am') {
      return {
        reply: `🔧 **የስክሪን ብልሽት መመርመሪያ እና ፈጣን ጥገና፡**\n` +
          `• **ጥቁር ሞጁል (Dark Module)**፡ የ 16-pin ሪበን ዳታ ኬብል ማስተካከል እና የ 5V DC መስመር ከ MeanWell ኃይል ሰጪ ጋር መገናኘቱን ማረጋገጥ (90% የብልሽት መንስኤ)።\n` +
          `• **የረገፉ ዳዮዶች (Dead Pixels)**፡ በ 260°C ማይክሮ-ሶልደሪንግ ማስተካከል ወይም በ 3% ነፃ መለዋወጫ ሞጁል መቀየር።\n` +
          `• **ምስል አለመምጣት (No Signal)**፡ የኮንትሮለሩ አረንጓዴ መብራት መብራቱንና የ Cat6 ላን ገመድ መያያዙን ማረጋገጥ።\n` +
          `🚨 **የ 4 ሰዓት ድንገተኛ የጥገና ቡድን**፡ በአዲስ አበባ ውስጥ በ 4 ሰዓት ውስጥ ደርሰን እንጠግናለን (+251 942 992 799)።`,
        chips: [
          { label: 'የጥገና ፖርታል ክፈት', actionType: 'navigate', target: 'maintenance' },
          { label: 'ድንገተኛ ጥገና WhatsApp', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `🔧 **Display Troubleshooting & Rapid Repair Protocol:**\n` +
        `• **Dark Module**: Reseat the 16-pin ribbon data cable and check 5V DC line from the MeanWell power supply (solves 90% of issues).\n` +
        `• **Dead Pixels**: Replace module with included 3% free spares, or micro-solder replacement diodes at 260°C.\n` +
        `• **No Signal / Black Screen**: Check Gigabit Cat6 cable continuity and verify receiving card blinking green status LED.\n` +
        `🚨 **4-Hour Emergency Dispatch**: Rapid technician van dispatches across Addis Ababa (+251 942 992 799).`,
      chips: [
        { label: 'Open Maintenance Portal', actionType: 'navigate', target: 'maintenance' },
        { label: 'Emergency Hotline WhatsApp', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 11. LOCATION, WAREHOUSE, REGIONAL DELIVERIES
  if (query.includes('location') || query.includes('where') || query.includes('address') || query.includes('office') || query.includes('bole') || query.includes('hawassa') || query.includes('adama') || query.includes('bahir dar') || query.includes('mekelle') || query.includes('dire dawa') || query.includes('አድራሻ') || query.includes('ቦታ') || query.includes('መጋዘን') || query.includes('ክልሎች') || query.includes('eessa')) {
    if (lang === 'am') {
      return {
        reply: `📍 **የ DemaQ አድራሻ እና ሀገር አቀፍ የስራ ክልል፡**\n` +
          `• **ዋና መጋዘንና ቢሮ**፡ ቦሌ ክፍለ ከተማ፣ አዲስ አበባ፣ ኢትዮጵያ።\n` +
          `• **ቀጥታ ግንኙነት**፡ ስልክ / WhatsApp: +251 942 992 799 | ኢሜይል፡ contact@demaqdigital.com\n` +
          `• **አቅርቦትና ተከላ**፡ በአዲስ አበባ በ 24-48 ሰዓት ውስጥ፤ በክልል ከተሞች (ሀዋሳ፣ አዳማ፣ ባህር ዳር፣ ጎንደር፣ መቀሌ፣ ድሬዳዋ፣ ጅማ ወዘተ) በ 2-4 ቀናት ውስጥ ደርሰን እንገጥማለን።`,
        chips: [
          { label: 'ስልክ ደውል: +251 942 992 799', actionType: 'external', target: 'tel:+251942992799' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `📍 **DemaQ Office & Nationwide Dispatch:**\n` +
        `• **Headquarters & Warehouse**: Bole Sub-City, Addis Ababa, Ethiopia.\n` +
        `• **Direct Contact**: Phone / WhatsApp: +251 942 992 799 | Email: contact@demaqdigital.com\n` +
        `• **Turnkey Deployment**: 24-48 hours in Addis Ababa. Certified engineering crews deployed to all Ethiopian regional cities (Hawassa, Adama, Bahir Dar, Gondar, Mekelle, Dire Dawa, Jimma).`,
      chips: [
        { label: 'Call Hotline', actionType: 'external', target: 'tel:+251942992799' },
        { label: 'WhatsApp Direct', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 12. WARRANTY & FREE SPARES
  if (query.includes('warranty') || query.includes('spare') || query.includes('guarantee') || query.includes('ዋስትና') || query.includes('መለዋወጫ') || query.includes('wabiin') || query.includes('damaanad')) {
    if (lang === 'am') {
      return {
        reply: `🛡️ **የ DemaQ የንግድ ዋስትና እና ነፃ መለዋወጫዎች፡**\n` +
          `• **ዋስትና**፡ ከ 3 እስከ 5 ዓመት ሙሉ የንግድ ዋስትና (Full Commercial Warranty)።\n` +
          `• **ነፃ መለዋወጫዎች**፡ ለእያንዳንዱ ፕሮጀክት 3% ነፃ ተጨማሪ ሞጁሎች፣ ሪበን ኬብሎች እና MeanWell ኃይል ሰጪዎች አብረው ይሰጣሉ።\n` +
          `• **የአካባቢ ድጋፍ**፡ በአዲስ አበባ መጋዘን ሙሉ እቃዎች ስላሉ ከውጭ ሀገር እቃ መጠበቅ ሳያስፈልግ ወዲያውኑ ይተካልና ይጠገናል::`,
        chips: [
          { label: 'የጥገና ፖርታል', actionType: 'navigate', target: 'maintenance' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `🛡️ **DemaQ Warranty & Free Spares Package:**\n` +
        `• **Commercial Warranty**: 3 to 5-Year Full Commercial Hardware Warranty.\n` +
        `• **3% Free Backup Stock**: Every installation includes 3% free replacement modules, ribbon cables, receiving cards, and MeanWell power supplies.\n` +
        `• **Local Addis Stock**: Instant component replacement from our Bole warehouse with zero international shipping wait.`,
      chips: [
        { label: 'Maintenance Portal', actionType: 'navigate', target: 'maintenance' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 13. PRICING & PROFORMA INVOICE
  if (query.includes('price') || query.includes('cost') || query.includes('quote') || query.includes('proforma') || query.includes('birr') || query.includes('ዋጋ') || query.includes('ፕሮፎርማ') || query.includes('gatii') || query.includes('qiimeyn')) {
    if (lang === 'am') {
      return {
        reply: `📄 **ኦፊሴላዊ ፕሮፎርማ ኢንቮይስ እና ዋጋ፡**\n` +
          `• **ብጁ ስሌት**፡ የ LED ስክሪን ዋጋ በስፋቱ (ስኩዌር ሜትር)፣ በፒክሰል ፒቹ (P2.5 vs P1.8) እና በተከላው መንገድ መሰረት ይሰላል።\n` +
          `• **ጥቅሉ የሚያካትተው**፡ ስክሪን፣ NovaStar ኮንትሮለር፣ MeanWell PSUs፣ 3% ነፃ መለዋወጫ፣ ተከላ እና የ 3-5 ዓመት ዋስትና።\n` +
          `• **ፕሮፎርማ በ 2 ሰዓት**፡ የ 15% VAT ህጋዊ ፕሮፎርማ በ WhatsApp (+251 942 992 799) ወይም በድረ-ገጻችን ፕሮፎርማ ማውጫ ወዲያውኑ ይጠይቁ።`,
        chips: [
          { label: 'ፕሮፎርማ ማውጫ', actionType: 'navigate', target: 'proforma-matrix' },
          { label: 'የ 4x3m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
          { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
        ]
      };
    }
    return {
      reply: `📄 **Official Proforma Invoice & Pricing:**\n` +
        `• **Customized Quotes**: Pricing is tailored to exact dimensions, pixel pitch (P2.5 vs COB sub-P2.0), video processor, and structural framing.\n` +
        `• **All-Inclusive Package**: Screen, NovaStar controller, MeanWell power supplies, 3% free spare modules, turnkey mounting, and 3-5 year warranty.\n` +
        `• **Official 15% VAT Proforma**: Issued within 2 hours via WhatsApp (+251 942 992 799) or via the Proforma Generator above.`,
      chips: [
        { label: 'Generate Proforma', actionType: 'navigate', target: 'proforma-matrix' },
        { label: 'Calculate 4×3m Wall', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // 14. DEFAULT GREETINGS / ASSISTANCE
  if (lang === 'am') {
    return {
      reply: `ሰላም! እንኳን ወደ DemaQ Digital Solution በደህና መጡ።\n` +
        `የስክሪን ስፋት (ለምሳሌ፡ '4x3 ስክሪን አስላ')፣ ስለ ኖቫስታር ኮንትሮለር፣ ስለ GOB/COB ስክሪኖች ወይም ማንኛውንም የቴክኒክ ጥያቄ ይጠይቁኝ።`,
      chips: [
        { label: '📐 የ 4x3m ስክሪን አስላ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ የቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: '⚙️ ኖቫስታር VS ሁይዱ', actionType: 'prompt', target: 'NovaStar vs Huidu' },
        { label: '📱 በፍላሽና በዋይፋይ ማጫወት', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }
  if (lang === 'om') {
    return {
      reply: `Akkam! Baga nagaan gara DemaQ Digital Solution dhuftan.\n` +
        `Bal'ina iskiriinii (fakkeenyaaf '4x3m shallagaa'), controller NovaStar ykn suphaa gaafachuu dandeessu. Maal isiniif hojjedhu?`,
      chips: [
        { label: '📐 Iskiriinii 4x3m shallagaa', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ Mana Sagadaa', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: 'AR Kaameraa', actionType: 'navigate', target: 'ar-visualizer' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }
  if (lang === 'ti') {
    return {
      reply: `ሰላም! ናብ DemaQ Digital Solution ብደሓን መጻእኩም።\n` +
        `ስፍሓት ስክሪን (ንኣብነት '4x3m ጸብጽብ')፣ ኮንትሮለር ወይ ዝኾነ ናይ ቴክኒክ ሕቶ ሕተቱ።`,
      chips: [
        { label: '📐 ስፍሓት 4x3m ጸብጽብ', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ ናይ ቤተክርስቲያን ስክሪን', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: 'AR ካሜራ', actionType: 'navigate', target: 'ar-visualizer' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }
  if (lang === 'so') {
    return {
      reply: `Ku soo dhowow DemaQ Digital Solution.\n` +
        `Waxaad weydiin kartaa cabbirka shaashadda (tusaale '4x3m'), koontaroolka NovaStar ama dayactirka.`,
      chips: [
        { label: '📐 Xisaabi 4x3m', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⛪ Shaashadda Kaniisadda', actionType: 'prompt', target: 'Church Sanctuary Screen' },
        { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }
  if (lang === 'ar') {
    return {
      reply: `مرحباً بك في ديماك (DemaQ Digital Solution) في أديس أبابا.\n` +
        `يمكنك إدخال أبعاد الشاشة (مثال: '4x3m') أو السؤال عن وحدات التحكم NovaStar والصيانة ومولدات الكهرباء.`,
      chips: [
        { label: '📐 حساب شاشة 4×3 م', actionType: 'prompt', target: 'Calculate 4x3m wall' },
        { label: '⚡ استهلاك الكهرباء والمولدات', actionType: 'prompt', target: 'Power & Generator sizing' },
        { label: 'واتساب مباشر', actionType: 'external', target: 'https://wa.me/251942992799' }
      ]
    };
  }

  // Default English
  return {
    reply: `ሰላም! Welcome to DemaQ Digital Solution in Addis Ababa.\n` +
      `Enter screen dimensions (e.g. 'Calculate 4x3m'), or ask about NovaStar controllers, power & generators, USB playback, GOB vs COB, or repairs. How can I engineer your display today?`,
    chips: [
      { label: '📐 Calculate 4×3m Wall', actionType: 'prompt', target: 'Calculate 4x3m wall' },
      { label: '⛪ Church Sanctuary Screen', actionType: 'prompt', target: 'Church Sanctuary Screen' },
      { label: '⚡ Power & Generator Sizing', actionType: 'prompt', target: 'Power and generator sizing' },
      { label: '⚙️ NovaStar vs Huidu', actionType: 'prompt', target: 'NovaStar vs Huidu' },
      { label: '📱 USB & Wi-Fi Playback', actionType: 'prompt', target: 'USB and Wi-Fi playback' },
      { label: 'WhatsApp +251 942 992 799', actionType: 'external', target: 'https://wa.me/251942992799' }
    ]
  };
}
