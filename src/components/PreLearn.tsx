import { useState, useRef } from 'react';

// ── 한자 구성요소(부수) 데이터 ─────────────────────────────────────
interface Radical {
  char: string;
  pinyin: string;
  meaning: string;
  emoji: string;
  category: string;
  story: string;
  formula: string;        // 영어 단어처럼 분해 예시
  examples: string[];
  chapter?: number;       // 5장(기본) 또는 6장
}

const RADICALS: Radical[] = [
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
  // ── 6장 신규 부수 ────────────────────────────────────────────────────
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
  // ── 4장 신규 부수 ────────────────────────────────────────────────────
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

// ── Props ────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
  onStartFlashcard: () => void;
  selectedChapter?: 0 | 4 | 5 | 6;
}

// ── Component ────────────────────────────────────────────────────────
export default function PreLearn({ onBack, onStartFlashcard, selectedChapter = 0 }: Props) {
  // 장 필터 적용: 0=전체, 4=4장, 5=5장 부수(chapter 없으면 5장 기본), 6=6장 부수
  const baseRadicals = selectedChapter === 0
    ? RADICALS
    : RADICALS.filter(r => (r.chapter ?? 5) === selectedChapter);

  const [passCards, setPassCards] = useState<Radical[]>(baseRadicals);
  const [idx, setIdx] = useState(0);
  const [passNumber, setPassNumber] = useState(1);
  const [done, setDone] = useState(false);
  const [totalReview, setTotalReview] = useState(0);
  const reviewRef = useRef<Radical[]>([]);
  const [animKey, setAnimKey] = useState(0); // triggers re-animation

  const card = passCards[idx];
  const total = passCards.length;
  const progress = (idx / total) * 100;

  const advance = (addToReview: boolean) => {
    if (addToReview) {
      reviewRef.current = [...reviewRef.current, card];
      setTotalReview(c => c + 1);
    }

    const nextIdx = idx + 1;
    if (nextIdx < total) {
      setIdx(nextIdx);
      setAnimKey(k => k + 1);
    } else {
      // End of current pass
      if (passNumber === 1 && reviewRef.current.length > 0) {
        setPassCards(reviewRef.current);
        reviewRef.current = [];
        setPassNumber(2);
        setIdx(0);
        setAnimKey(k => k + 1);
      } else {
        setDone(true);
      }
    }
  };

  // ── Done screen ────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 p-6 text-center">
        <div className="text-6xl animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold text-white">기초 부수 학습 완료!</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          {RADICALS.length}개 부수를 모두 익혔어요!<br />
          이제 단어 암기가 훨씬 쉬울 거예요 ✨
        </p>
        {totalReview > 0 && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-amber-300 text-sm">다시 복습한 카드: {totalReview}개</p>
          </div>
        )}
        {/* Quick review of all learned */}
        <div className="w-full max-w-xs rounded-2xl bg-slate-900/80 border border-slate-700 p-4 max-h-48 overflow-y-auto scroll-area">
          <p className="text-xs text-slate-500 mb-2 text-left">오늘 배운 부수들</p>
          <div className="flex flex-wrap gap-2">
            {baseRadicals.map(r => (
              <div key={r.char} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700">
                <span className="text-lg font-bold text-cyan-400 chinese-font">{r.char.split('/')[0].trim()}</span>
                <span className="text-xs text-slate-400">{r.meaning}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={onStartFlashcard}
            className="py-4 rounded-xl border border-cyan-500/60 bg-cyan-500/15 text-cyan-300 font-bold text-base"
          >
            📖 단어 학습 시작하기 →
          </button>
          <button
            onClick={() => {
              setPassCards(baseRadicals);
              setIdx(0);
              setPassNumber(1);
              setDone(false);
              setTotalReview(0);
              reviewRef.current = [];
            }}
            className="py-3 rounded-xl border border-slate-700 text-slate-400 text-sm"
          >
            ↺ 처음부터 다시 보기
          </button>
        </div>
      </div>
    );
  }

  // ── Card screen ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full p-4 gap-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1 bg-slate-800 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400 shrink-0">{idx + 1}/{total}</span>
        {passNumber === 2 && (
          <span className="text-xs text-amber-400 shrink-0 pulse-glow">2회차</span>
        )}
      </div>

      {/* Category + pass badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-400">
          {card.category}
        </span>
        <span className="text-xs text-slate-600">부수 {idx + 1}/{total}</span>
      </div>

      {/* Main card */}
      <div key={animKey} className="flex-1 flex flex-col overflow-y-auto scroll-area slide-up gap-3">

        {/* Character + pinyin + meaning */}
        <div className="flex flex-col items-center py-4 gap-2">
          <p
            className="font-black leading-none chinese-font text-amber-300 select-none"
            style={{
              fontSize: 'clamp(72px, 22vw, 110px)',
              textShadow: '0 0 40px rgba(245, 158, 11, 0.55), 0 0 80px rgba(245, 158, 11, 0.25)',
            }}
          >
            {card.char.split('/')[0].trim()}
          </p>
          {card.char.includes('/') && (
            <p className="text-sm text-amber-500/70">
              (글자 안에서 → <span className="chinese-font font-bold">{card.char.split('/')[1].trim()}</span>)
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{card.emoji}</span>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{card.meaning}</p>
              <p className="text-sm text-purple-300 glow-purple">{card.pinyin}</p>
            </div>
          </div>
        </div>

        {/* Formula (영단어 분해식) */}
        <div className="rounded-2xl bg-slate-900/80 border border-cyan-900/40 p-3">
          <p className="text-xs text-cyan-400 font-bold mb-1">🔤 영단어처럼 분해하면</p>
          <p className="text-xs text-cyan-200/80 chinese-font leading-relaxed">{card.formula}</p>
        </div>

        {/* Story - speech bubble */}
        <div className="relative">
          <div className="absolute -top-2 left-5 w-4 h-4 rotate-45 bg-slate-900/90 border-l border-t border-amber-900/40" />
          <div className="rounded-2xl rounded-tl-none bg-slate-900/90 border border-amber-900/30 p-4">
            <p className="text-xs text-amber-400 font-bold mb-1">💡 기억법</p>
            <p className="text-sm text-amber-200/90 leading-relaxed italic">{card.story}</p>
          </div>
        </div>

        {/* Example words */}
        <div>
          <p className="text-xs text-slate-500 mb-2">이 글자가 들어간 단어들</p>
          <div className="flex flex-wrap gap-2">
            {card.examples.map((ex, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs chinese-font"
              >
                {ex}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 shrink-0 pt-1">
        <button
          onClick={() => advance(true)}
          className="flex-1 py-4 rounded-xl border border-amber-500/50 bg-amber-500/10 text-amber-300 font-bold active:scale-95 transition-transform"
        >
          🔄 다시볼게
        </button>
        <button
          onClick={() => advance(false)}
          className="flex-1 py-4 rounded-xl border border-green-500/50 bg-green-500/10 text-green-300 font-bold active:scale-95 transition-transform"
        >
          👍 이해했어!
        </button>
      </div>
    </div>
  );
}
