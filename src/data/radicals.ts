export interface Radical {
  char: string;
  pinyin: string;
  meaning: string;
  emoji: string;
  category: string;
  story: string;
  formula: string;
  examples: string[];
  chapter?: number;
}

export const RADICALS: Radical[] = [
  {
    char: "口",
    pinyin: "kǒu",
    meaning: "입",
    emoji: "👄",
    category: "신체",
    story: "□처럼 생긴 입을 위에서 본 모양! 입과 관련된 글자에는 꼭 口가 들어가요.",
    formula: "mouth = 口 → 口罩(마스크=입+덮개), 唱(노래하다=입+번창), 喝(마시다=입+들이키다)",
    examples: ["口罩(마스크)", "唱歌(노래하다)", "喝(마시다)", "哇(와!)"],
  },
  {
    char: "足 / ⻊",
    pinyin: "zú",
    meaning: "발",
    emoji: "🦶",
    category: "신체",
    story: "위에 무릎(口), 아래 발가락 모양! 발로 하는 동작에 등장해요. 글자 왼쪽에 붙으면 ⻊로 변해요.",
    formula: "foot = 足 → 足球(축구=발+공), 踢(차다=발+치다)",
    examples: ["足球(축구)", "踢(차다)", "踢毽子(제기차기)"],
  },
  {
    char: "扌(手)",
    pinyin: "shǒu",
    meaning: "손",
    emoji: "✋",
    category: "신체",
    story: "손가락 5개를 펼친 모양! 글자 왼쪽에 붙을 때는 扌로 줄어들어요. 손으로 하는 동작 모두 여기서 출발!",
    formula: "hand = 扌 → 打(치다=손+정), 捡(줍다=손+모두), 弹(연주하다=활+하나)",
    examples: ["打(치다/하다)", "捡(줍다)", "弹(연주하다)"],
  },
  {
    char: "火 / 灬",
    pinyin: "huǒ",
    meaning: "불",
    emoji: "🔥",
    category: "자연",
    story: "불꽃이 타오르는 모양! 글자 아래에 붙을 때는 灬(네 점)로 변해요. 불, 열, 빛과 관련된 글자에 등장!",
    formula: "fire = 火/灬 → 火锅(훠궈=불+냄비), 灯(등불=불+오르다)",
    examples: ["火锅(훠궈)", "灯(등불)"],
  },
  {
    char: "氵(水)",
    pinyin: "shuǐ",
    meaning: "물",
    emoji: "💧",
    category: "자연",
    story: "물이 세 갈래로 흘러내리는 모양! 글자 왼쪽에 붙으면 氵(삼수변=물 세 방울)이 돼요.",
    formula: "water = 氵 → 游(헤엄치다=물+깃발), 泳(수영=물+영원히)",
    examples: ["水(물)", "游泳(수영하다)", "游(헤엄치다)", "泳(수영)"],
  },
  {
    char: "艹",
    pinyin: "cǎo",
    meaning: "풀·식물",
    emoji: "🌿",
    category: "자연",
    story: "글자 맨 위에 자라는 풀 두 포기 모양 ⊤⊤! 식물·채소 관련 글자 위에 꼭 있어요.",
    formula: "plant = 艹 → 菜(채소=풀+따다), 茶(차=풀+나무+사람)",
    examples: ["菜(요리/채소)", "茶(차음료)"],
  },
  {
    char: "心",
    pinyin: "xīn",
    meaning: "마음·심장",
    emoji: "❤️",
    category: "감정",
    story: "심장 박동 모양을 그대로 본떠 만든 글자! 감정·생각·의지와 관련된 글자에 등장해요.",
    formula: "heart = 心 → 想(~하고싶다=서로+마음), 爱(사랑=발톱+마음+친구)",
    examples: ["想(~하고 싶다)", "爱好(취미)"],
  },
  {
    char: "亻(人)",
    pinyin: "rén",
    meaning: "사람",
    emoji: "🧍",
    category: "사람",
    story: "사람이 두 다리로 서 있는 옆모습! 글자 왼쪽에 붙으면 亻로 줄어들어요. 사람의 행동·관계에 등장!",
    formula: "person = 亻 → 保(보호하다=사람+아이), 使(시키다=사람+임무)",
    examples: ["保护(보호하다)", "使用(사용하다)", "保温杯(텀블러)"],
  },
  {
    char: "讠(言)",
    pinyin: "yán",
    meaning: "말하다",
    emoji: "💬",
    category: "행동",
    story: "혀에서 말이 나오는 모양! 간체자(현대 중국어)에서는 讠로 줄여 씁니다. 말·언어 관련 글자에 등장!",
    formula: "speak = 讠 → 说(말하다=말+기뻐하다)",
    examples: ["说(말하다)"],
  },
  {
    char: "木",
    pinyin: "mù",
    meaning: "나무",
    emoji: "🌳",
    category: "자연",
    story: "뿌리(아래 선)와 가지(위 선)가 있는 나무 모양 그대로! 나무·목재 관련 글자에 등장해요.",
    formula: "wood = 木 → 棒(몽둥이=나무+받들다), 棒球(야구=몽둥이+공)",
    examples: ["棒(훌륭하다/몽둥이)", "棒球(야구)"],
  },
  {
    char: "球",
    pinyin: "qiú",
    meaning: "공·구형",
    emoji: "⚽",
    category: "스포츠",
    story: "王(옥처럼 귀한 것)+求(구하다)→ 옥처럼 둥근 것=공! 이 글자가 붙으면 무조건 공 관련 스포츠예요.",
    formula: "ball = 球 → 足球(축구) 篮球(농구) 排球(배구) 棒球(야구) 乒乓球(탁구) 羽毛球(배드민턴)",
    examples: ["足球(축구)", "篮球(농구)", "排球(배구)", "棒球(야구)", "乒乓球(탁구)", "羽毛球(배드민턴)"],
  },
  {
    char: "家",
    pinyin: "jiā",
    meaning: "집 / 전문가",
    emoji: "🏠",
    category: "사람",
    story: "지붕(宀) 아래 돼지(豕)→ 옛날에 집 안에 가축을 키웠어요! 직업 명사 뒤에 붙으면 '~분야 전문가'라는 뜻!",
    formula: "expert = 家 → 作家(작가=만들다+전문가), 漫画家(만화가=만화+전문가)",
    examples: ["作家(작가)", "漫画家(만화가)"],
  },
  {
    char: "师",
    pinyin: "shī",
    meaning: "스승 / 전문가",
    emoji: "👨‍🏫",
    category: "사람",
    story: "군대의 최고 지도자→ 전문 지식을 가진 사람! 家처럼 직업 명사 뒤에 붙어 '전문 직종'을 나타내요.",
    formula: "specialist = 师 → 设计师(디자이너=설계+전문가), 工程师(엔지니어=공학+전문가)",
    examples: ["设计师(디자이너)", "工程师(엔지니어)"],
  },
  {
    char: "保",
    pinyin: "bǎo",
    meaning: "보호하다",
    emoji: "🛡️",
    category: "행동",
    story: "亻(사람)이 子(아이)를 등에 업고 있는 모습→ 안전하게 지켜준다=보호! 保가 앞에 붙으면 '보호·유지' 의미예요.",
    formula: "protect = 保 → 保护(보호=보호+지키다), 保温杯(텀블러=보호+따뜻함+컵)",
    examples: ["保护(보호하다)", "保温杯(텀블러)"],
  },
  {
    char: "电",
    pinyin: "diàn",
    meaning: "전기 / 번개",
    emoji: "⚡",
    category: "과학",
    story: "번개가 구름에서 내리치는 모양에서 유래→ 전기! 电이 붙으면 전기로 작동하는 기기들이에요.",
    formula: "electric = 电 → 电视(TV=전기+보다), 电话(전화=전기+말하다)",
    examples: ["电(전기)", "电视(텔레비전)"],
  },
  {
    char: "节",
    pinyin: "jié",
    meaning: "절제 / 마디",
    emoji: "🎋",
    category: "개념",
    story: "대나무(竹)의 마디(即)→ 마디마디 조절한다=절제·절약! 낭비 없이 아끼는 것을 뜻해요.",
    formula: "save = 节 → 节约(절약하다=절제+줄이다)",
    examples: ["节约(절약하다)"],
  },
  {
    char: "운(运)+동(动)",
    pinyin: "yùn + dòng",
    meaning: "움직이다",
    emoji: "🏃",
    category: "행동",
    story: "运=车(수레)가 길 위를 굴러가다→움직이다 / 动=重(무겁다)+力(힘)→ 힘을 써서 움직이다! 합치면 운동(运动)!",
    formula: "move = 运+动 → 运动(운동=움직이다+움직임)",
    examples: ["运动(운동하다)"],
  },
  {
    char: "车",
    pinyin: "chē",
    meaning: "차 / 수레",
    emoji: "🚗",
    category: "교통",
    chapter: 6,
    story: "수레 바퀴와 축을 위에서 내려다본 상형자! 6장에 나오는 탈것 대부분에 车가 들어가요. 车=탈것의 핵심 글자!",
    formula: "vehicle = 车 → 地铁(지하철) 火车(기차) 汽车(자동차) 公交车(버스) 出租车(택시) 自行车(자전거) 摩托车(오토바이) 车站(정류장)",
    examples: ["地铁(지하철)", "火车(기차)", "汽车(자동차)", "公交车(버스)", "出租车(택시)", "自行车(자전거)", "摩托车(오토바이)", "车站(정류장)"],
  },
  {
    char: "飞",
    pinyin: "fēi",
    meaning: "날다",
    emoji: "✈️",
    category: "교통",
    chapter: 6,
    story: "새가 날개를 활짝 펼치고 하늘을 나는 모양을 그대로 본뜬 상형자! 飞가 있으면 '하늘을 나는' 것이에요.",
    formula: "fly = 飞 → 飞机(비행기=날다+기계) ← 날아다니는(飞) 기계(机)!",
    examples: ["飞机(비행기)"],
  },
  {
    char: "馆/院/厅",
    pinyin: "guǎn / yuàn / tīng",
    meaning: "건물 / 시설",
    emoji: "🏢",
    category: "장소",
    chapter: 6,
    story: "馆=여러 사람이 모이는 건물(도서관·박물관) / 院=마당이 있는 건물(병원·법원) / 厅=홀·청 → 세 글자 모두 '공공 건물'에 붙어요!",
    formula: "facility = 馆→图书馆(도서관), 院→医院(병원), 厅→咖啡厅(카페)",
    examples: ["图书馆(도서관)", "医院(병원)", "咖啡厅(카페)"],
  },
  {
    char: "↑上 ↓下 →前 ←后 ←左 →右",
    pinyin: "shàng xià qián hòu zuǒ yòu",
    meaning: "방향어 6개 세트",
    emoji: "🧭",
    category: "방향",
    chapter: 6,
    story: "上(위)·下(아래)·前(앞)·后(뒤)·左(왼쪽)·右(오른쪽) — 세트로 한 번에 외우면 끝! 길 찾기 필수 단어들이에요.",
    formula: "direction = 上↑ 下↓ 前→ 后← 左↙ 右↗ → 왼손(左)오른손(右)로 방향 외우기!",
    examples: ["上(위)", "下(아래)", "前(앞)", "后(뒤)", "左(왼쪽)", "右(오른쪽)"],
  },
  {
    char: "节",
    pinyin: "jié",
    meaning: "기념일 / 마디 / 절약",
    emoji: "🎊",
    category: "행동",
    chapter: 4,
    story: "절(节)은 대나무의 마디 모양! 마디마디 특별한 순간=기념일, 마디마디 아끼다=절약. 두 가지 뜻을 함께 기억하자!",
    formula: "festival = 节 → 儿童节(어린이날) 劳动节(노동절) 教师节(스승의날) 圣诞节(크리스마스)",
    examples: ["儿童节(어린이날)", "劳动节(노동절)", "教师节(스승의날)", "圣诞节(크리스마스)", "节约(절약)"],
  },
  {
    char: "日/月/星",
    pinyin: "rì / yuè / xīng",
    meaning: "날 / 달 / 별 (날짜·요일)",
    emoji: "📅",
    category: "시간",
    chapter: 4,
    story: "日(태양☀️)=날·일요일 / 月(달🌙)=월·달 / 星(별⭐)을 세며 요일을 계산하던 옛사람들! 세트로 외우면 날짜·요일이 완성!",
    formula: "date = 星期+日(일요일) / 号(날짜) = 几月几号? (몇 월 며칠?) / 月=월, 日=일",
    examples: ["星期日(일요일)", "星期五(금요일)", "月(월)", "号(날짜)", "今天几月几号?(오늘 몇 월 며칠?)"],
  },
  {
    char: "电影",
    pinyin: "diànyǐng",
    meaning: "전기(电)+그림자(影)=영화",
    emoji: "🎬",
    category: "문화",
    chapter: 4,
    story: "전기(电)로 만들어 낸 움직이는 그림자(影)=영화! 영화관은 电影院(전기그림자+건물). 电(전기)+影(그림자) 공식으로 외우자!",
    formula: "movie = 电+影 → 电影(영화) / 电影院(영화관=영화+건물)",
    examples: ["电影(영화)", "电影院(영화관)"],
  },
];

/** 부수 char 필드에서 매칭용 한자 토큰 추출 */
export function extractRadicalTokens(charField: string): string[] {
  const tokens = new Set<string>();
  for (const m of charField.matchAll(/\(([\u4e00-\u9fff]+)\)/g)) {
    for (const c of m[1]) tokens.add(c);
  }
  for (const part of charField.split('/')) {
    const cleaned = part.replace(/[^\u4e00-\u9fff]/g, '');
    for (const c of cleaned) tokens.add(c);
  }
  return [...tokens];
}

/** 한자풀이 hint에서 글자별 구성요소 추출 (예: "保(보호)+护(지키다)" → ["保","护"]) */
export function parseHintComponents(hint: string): string[] {
  if (!hint) return [];
  return hint
    .split('+')
    .map((part) => part.trim().match(/^([\u4e00-\u9fff]+)/)?.[1] ?? '')
    .filter(Boolean);
}

function buildRadicalHighlightChars(): Set<string> {
  const set = new Set<string>();

  for (const r of RADICALS) {
    const tokens = extractRadicalTokens(r.char);
    tokens.forEach((t) => set.add(t));

    for (const ex of r.examples) {
      const word = ex.split('(')[0].trim().replace(/[^\u4e00-\u9fff]/g, '');
      if (!word) continue;
      const chars = [...word];
      if (chars.length === 1) {
        set.add(chars[0]);
      } else {
        set.add(chars[0]);
        chars.forEach((c) => {
          if (tokens.includes(c)) set.add(c);
        });
      }
    }
  }

  return set;
}

const RADICAL_TOKENS = new Set(RADICALS.flatMap((r) => extractRadicalTokens(r.char)));
const HIGHLIGHT_CHARS = buildRadicalHighlightChars();

/** 단어에서 사전학습 부수에 해당하는 글자 위치 반환 */
export function getRadicalHighlightIndices(text: string, hint?: string): Set<number> {
  const chars = [...text];
  const indices = new Set<number>();

  chars.forEach((c, i) => {
    if (RADICAL_TOKENS.has(c) || HIGHLIGHT_CHARS.has(c)) indices.add(i);
  });

  const components = parseHintComponents(hint ?? '');
  components.forEach((comp, i) => {
    if (i < chars.length && RADICAL_TOKENS.has(comp)) indices.add(i);
  });

  return indices;
}
