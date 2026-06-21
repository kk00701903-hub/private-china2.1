import type { Word } from './vocab';

export interface Radical {
  char: string;
  pinyin: string;
  meaning: string;
  emoji: string;
  category: string;
  story: string;
  formula: string;
  examples: string[];
  chapter: 4 | 5 | 6;
}

/** 4장 — 날짜·요일·기념일 (획 ≤5, 해당 장 단어에서 실제 등장) */
const CH4: Radical[] = [
  {
    char: "日",
    pinyin: "rì",
    meaning: "해·날",
    emoji: "☀️",
    category: "시간",
    chapter: 4,
    story: "네모 안에 가로 한 줄! 태양(日)이 떠 있는 모양이에요. 날짜·요일·생일에 꼭 나와요.",
    formula: "日 → 今天(오늘=지금+날) / 生日(생일=태어나+날) / 星期日(일요일=요일+日)",
    examples: ["今天(오늘)", "生日(생일)", "星期日(일요일)"],
  },
  {
    char: "月",
    pinyin: "yuè",
    meaning: "달·월",
    emoji: "🌙",
    category: "시간",
    chapter: 4,
    story: "초승달 모양 그대로! 月 하나만 외우면 '몇 월' 묻기·날짜 말하기의 핵심이에요.",
    formula: "月 → 月(월) / 几月几号?(몇 월 며칠?)",
    examples: ["月(월)", "今天几月几号?(오늘 몇 월 며칠?)"],
  },
  {
    char: "口",
    pinyin: "kǒu",
    meaning: "입",
    emoji: "👄",
    category: "신체",
    chapter: 4,
    story: "사각형 입 모양! 말·먹기·감탄과 관련된 글자 왼쪽·위·안에 口가 숨어 있어요.",
    formula: "口 → 号(날짜 번호=입+...) / 吧(~하자=입+...) / 吃(먹다=입+...)",
    examples: ["号(날짜·번호)", "吧(~하자)", "吃(먹다)"],
  },
  {
    char: "节",
    pinyin: "jié",
    meaning: "기념일·절",
    emoji: "🎊",
    category: "시간",
    chapter: 4,
    story: "대나무 마디 모양에서 왔어요. 마디마다 특별한 날=기념일(节)! 4장 기념일 단어의 공통 글자예요.",
    formula: "节 → 儿童节(어린이날) / 劳动节(노동절) / 教师节(스승의날) / 圣诞节(크리스마스)",
    examples: ["儿童节(어린이날)", "劳动节(노동절)", "教师节(스승의날)", "圣诞节(크리스마스)"],
  },
  {
    char: "上 / 下",
    pinyin: "shàng / xià",
    meaning: "위·아래 (시간 순서)",
    emoji: "↕️",
    category: "방향·시간",
    chapter: 4,
    story: "4장에서는 방향보다 '시간 순서'가 더 중요해요! 上=지난·이전, 下=다음·이후로 기억하세요.",
    formula: "上=지난 → 上星期(지난주) / 下=다음 → 下星期(다음주) / 上学(등교=학교로 올라가다)",
    examples: ["上星期(지난주)", "下星期(다음주)", "上学(등교하다)"],
  },
  {
    char: "一",
    pinyin: "yī",
    meaning: "하나",
    emoji: "1️⃣",
    category: "숫자",
    chapter: 4,
    story: "획 한 줄! 가장 간단한 숫자예요. '하나·함께' 뜻으로 자주 쓰여요.",
    formula: "一 → 一起(함께=하나+일어나다) / 一下(한번·잠깐=하나+아래)",
    examples: ["一起(함께)", "一下(한번·잠깐)"],
  },
  {
    char: "分",
    pinyin: "fēn",
    meaning: "나누다·분(時間)",
    emoji: "⏱️",
    category: "시간",
    chapter: 4,
    story: "칼(刀)로 나눈다(分)는 뜻! 시계를 나눈 단위가 '분(分)', 15분은 一刻이에요.",
    formula: "分 → 分(분) / 两点三十分(2시 30분) / 刻(15분)",
    examples: ["分(분)", "两点三十分(2시 30분)", "刻(15분)"],
  },
  {
    char: "电",
    pinyin: "diàn",
    meaning: "전기",
    emoji: "⚡",
    category: "과학",
    chapter: 4,
    story: "번개가 치는 모양에서 왔어요. 4장에서는 电影(영화)의 핵심 글자! 전기+그림자=영화.",
    formula: "电+影 → 电影(영화) / 电影院(영화관)",
    examples: ["电影(영화)", "电影院(영화관)"],
  },
  {
    char: "人",
    pinyin: "rén",
    meaning: "사람",
    emoji: "🧍",
    category: "사람",
    chapter: 4,
    story: "두 다리로 선 사람 옆모습! 글자 위·왼쪽에 붙으면 亻(인변)이 되지만, 기본형 人부터 외워요.",
    formula: "人 → 会(모임=사람+云) / 演唱会(콘서트=공연+노래+会)",
    examples: ["会(모임·~할 줄 알다)", "演唱会(콘서트)"],
  },
  {
    char: "耳",
    pinyin: "ěr",
    meaning: "귀",
    emoji: "👂",
    category: "신체",
    chapter: 4,
    story: "귀 모양 그대로! 听(듣다)의 왼쪽에 耳가 있어요. 귀=듣기와 연결!",
    formula: "耳 → 听(듣다=귀+...) / 听音乐(음악 듣다)",
    examples: ["听(듣다)", "听音乐(음악 듣다)"],
  },
];

/** 5장 — 취미·운동·환경 (획 ≤5 부수 + 足 7획) */
const CH5: Radical[] = [
  {
    char: "口",
    pinyin: "kǒu",
    meaning: "입",
    emoji: "👄",
    category: "신체",
    chapter: 5,
    story: "□ 입 모양! 5장에서는 마스크·감탄·노래·마시기와 관련된 글자에 많이 나와요.",
    formula: "口 → 口罩(마스크=입+덮개) / 哇(와!) / 唱(노래=입+...) / 喝(마시다=입+...)",
    examples: ["口罩(마스크)", "哇(와!)", "唱歌(노래하다)", "喝(마시다)"],
  },
  {
    char: "扌(手)",
    pinyin: "shǒu",
    meaning: "손",
    emoji: "✋",
    category: "신체",
    chapter: 5,
    story: "손가락 펼친 모양! 왼쪽에 붙으면 扌(손변). 손으로 하는 동작=줍다·치다·연주하다.",
    formula: "扌 → 捡(줍다=손+...) / 打(치다=손+...) / 弹(연주=손+...)",
    examples: ["捡(줍다)", "打(치다)", "弹(연주하다)", "保护(보호=保+护)"],
  },
  {
    char: "足 / ⻊",
    pinyin: "zú",
    meaning: "발",
    emoji: "🦶",
    category: "신체",
    chapter: 5,
    story: "발과 다리 모양! 7획이지만 5장 스포츠 단어의 핵심이에요. 왼쪽에 붙으면 ⻊(발변)이 돼요.",
    formula: "足 → 跑(달리다) / 踢(차다=발+...) / 足球(축구=발+공) / 跑步(달리다=跑+步)",
    examples: ["跑步(달리다)", "踢(차다)", "足球(축구)", "捡跑(플로깅)"],
  },
  {
    char: "氵(水)",
    pinyin: "shuǐ",
    meaning: "물",
    emoji: "💧",
    category: "자연",
    chapter: 5,
    story: "물 세 방울 氵! 왼쪽에 붙으면 물·액체와 관련. 水(물) 단어와 游泳(수영)에 등장!",
    formula: "氵 → 水(물) / 游(헤엄) / 泳(수영) / 游泳(수영하다)",
    examples: ["水(물)", "游泳(수영하다)", "节约用水(물 절약)"],
  },
  {
    char: "火",
    pinyin: "huǒ",
    meaning: "불",
    emoji: "🔥",
    category: "자연",
    chapter: 5,
    story: "불꽃 모양! 아래에 네 점 灬으로 변하기도 해요. 5장에서는 火锅·등(灯)과 연결!",
    formula: "火 → 火锅(훠궈=불+냄비) / 灯(등=불+오르다) / 关灯(불 끄다)",
    examples: ["火锅(훠궈)", "灯(등)", "关(끄다)+灯"],
  },
  {
    char: "艹",
    pinyin: "cǎo",
    meaning: "풀",
    emoji: "🌿",
    category: "자연",
    chapter: 5,
    story: "글자 맨 위 풀 두 포기 ⊤⊤! 식물·채소·차와 관련된 글자 위에 있어요.",
    formula: "艹 → 菜(요리=풀+따다) / 茶(차=풀+나무+人)",
    examples: ["菜(요리)", "茶(차)"],
  },
  {
    char: "木",
    pinyin: "mù",
    meaning: "나무",
    emoji: "🌳",
    category: "자연",
    chapter: 5,
    story: "뿌리·가지·나무 기둥 모양! 棒(야구 배트·훌륭하다)과 茶(차)에 나와요.",
    formula: "木 → 棒(훌륭/몽둥이=木+...) / 棒球(야구=棒+球) / 茶(차=艹+木+人)",
    examples: ["棒(훌륭하다)", "棒球(야구)", "茶(차)"],
  },
  {
    char: "心",
    pinyin: "xīn",
    meaning: "마음",
    emoji: "❤️",
    category: "감정",
    chapter: 5,
    story: "심장·마음 모양! 아래·안에 붙으면 忄(심변). ~하고 싶다·취미와 연결!",
    formula: "心 → 想(~하고싶다=相+心) / 爱好(취미=爱+好)",
    examples: ["想(~하고 싶다)", "爱好(취미)"],
  },
  {
    char: "亻(人)",
    pinyin: "rén",
    meaning: "사람",
    emoji: "🧍",
    category: "사람",
    chapter: 5,
    story: "사람이 서 있는 옆모습! 왼쪽 亻=사람이 하는 행동. 保(보호)·使(사용)의 핵심!",
    formula: "亻 → 做(하다=人+...) / 保护(보호=保+护) / 使用(사용=使+用)",
    examples: ["做(하다)", "保护(보호하다)", "使用(사용하다)", "保温杯(텀블러)"],
  },
  {
    char: "讠(言)",
    pinyin: "yán",
    meaning: "말",
    emoji: "💬",
    category: "행동",
    chapter: 5,
    story: "말씀 言이 간체자에서는 讠로 줄어요. 왼쪽에 붙으면 '말하기' 관련!",
    formula: "讠 → 说(말하다=讠+...) / 设计(설계)… 说과 함께 기억",
    examples: ["说(말하다)"],
  },
  {
    char: "女",
    pinyin: "nǚ",
    meaning: "여자",
    emoji: "👩",
    category: "사람",
    chapter: 5,
    story: "여인이 무릎 꿇고 앉은 모양! 3획으로 간단해요. 要(~해야 한다)의 아래에 女가 있어요.",
    formula: "女 → 要(~해야 한다=覀+女)",
    examples: ["要(~해야 한다)"],
  },
  {
    char: "子",
    pinyin: "zǐ",
    meaning: "아이",
    emoji: "👶",
    category: "사람",
    chapter: 5,
    story: "아기 머리와 팔·다리 모양! 学(배우다)에 子가 들어 있어요.",
    formula: "子 → 学(배우다=子+...) / 保(보호=人+子=사람이 아이를 안다)",
    examples: ["学(배우다)", "保护(보호하다)"],
  },
  {
    char: "儿",
    pinyin: "ér",
    meaning: "아이·발",
    emoji: "🦵",
    category: "사람",
    chapter: 5,
    story: "두 다리 모양! 玩儿(놀다) 끝의 儿는 북방 친근한 말투예요. 다리=아이 연상!",
    formula: "儿 → 玩儿(놀다=玩+儿)",
    examples: ["玩儿(놀다)"],
  },
  {
    char: "电",
    pinyin: "diàn",
    meaning: "전기",
    emoji: "⚡",
    category: "과학",
    chapter: 5,
    story: "5장에서는 电 단어와 电视(TV)! 전기를 끄다=关+电, TV=电+视.",
    formula: "电 → 电(전기) / 电视(텔레비전=电+视) / 关(끄다)+电",
    examples: ["电(전기)", "电视(텔레비전)", "关灯(등 끄기)"],
  },
  {
    char: "宀",
    pinyin: "mián",
    meaning: "지붕·집",
    emoji: "🏠",
    category: "장소",
    chapter: 5,
    story: "집 지붕 모양 ⊤! 글자 위에 덮이면 '집·실내'와 관련. 写(쓰다)에 있어요.",
    formula: "宀 → 写(쓰다=宀+...)",
    examples: ["写(쓰다)"],
  },
  {
    char: "王",
    pinyin: "wáng",
    meaning: "왕·玉旁",
    emoji: "👑",
    category: "스포츠",
    chapter: 5,
    story: "왕관 모양! 球(공)의 왼쪽=王. 王+求=구(求)하다→둥근 것=공! 스포츠 단어의 공통 글자.",
    formula: "王+球 → 足球(축구) / 篮球(농구) / 排球(배구) / 棒球(야구) / 乒乓球(탁구)",
    examples: ["足球(축구)", "篮球(농구)", "乒乓球(탁구)", "羽毛球(배드민턴)"],
  },
];

/** 6장 — 교통·장소·방향 (획 ≤5 부수) */
const CH6: Radical[] = [
  {
    char: "车",
    pinyin: "chē",
    meaning: "차·수레",
    emoji: "🚗",
    category: "교통",
    chapter: 6,
    story: "수레 바퀴와 축! 6장 탈것 단어의 핵심. 车가 붙으면 거의 다 '차'예요.",
    formula: "车 → 地铁(지하철) / 火车(기차) / 汽车(자동차) / 公交车(버스) / 自行车(자전거) / 车站(정류장)",
    examples: ["地铁(지하철)", "火车(기차)", "汽车(자동차)", "公交车(버스)", "出租车(택시)", "车站(정류장)"],
  },
  {
    char: "飞",
    pinyin: "fēi",
    meaning: "날다",
    emoji: "✈️",
    category: "교통",
    chapter: 6,
    story: "새가 날개 펼친 모양! 3획으로 간단. 飞+机(기계)=비행기!",
    formula: "飞+机 → 飞机(비행기=날다+기계)",
    examples: ["飞机(비행기)"],
  },
  {
    char: "马",
    pinyin: "mǎ",
    meaning: "말",
    emoji: "🐴",
    category: "교통",
    chapter: 6,
    story: "말 머리·갈기·다리 모양! 3획 상형자. 骑(타다)=马+奇.",
    formula: "马 → 马(말) / 骑(타다=马+...)",
    examples: ["马(말)", "骑(타다)"],
  },
  {
    char: "火",
    pinyin: "huǒ",
    meaning: "불",
    emoji: "🔥",
    category: "교통",
    chapter: 6,
    story: "6장에서는 火车(기차)! 옛날 증기기관차=불(火)로 달리는 차(车).",
    formula: "火+车 → 火车(기차=불+차)",
    examples: ["火车(기차)"],
  },
  {
    char: "口",
    pinyin: "kǒu",
    meaning: "입·입구",
    emoji: "👄",
    category: "장소",
    chapter: 6,
    story: "6장에서는 '입구' 뜻으로도 쓰여요! 十字路口(사거리)=길(路)의 입(口).",
    formula: "口 → 啊(아~) / 十字路口(사거리=十+字+路+口)",
    examples: ["啊(아~)", "十字路口(사거리)"],
  },
  {
    char: "门",
    pinyin: "mén",
    meaning: "문",
    emoji: "🚪",
    category: "장소",
    chapter: 6,
    story: "두쪽 문짝 모양! 天安门(천안문)·前门(첸먼)의 공통 글자.",
    formula: "门 → 天安门(천안문=天+安+门) / 前门(첸먼=前+门)",
    examples: ["天安门(천안문)", "前门(첸먼)"],
  },
  {
    char: "土",
    pinyin: "tǔ",
    meaning: "흙·땅",
    emoji: "🌍",
    category: "자연",
    chapter: 6,
    story: "땅 위 돌멩이 모양! 去(가다)에 土가 있고, 地铁(지하철)=地(땅)+铁.",
    formula: "土 → 去(가다=土+...) / 地铁(지하철=地+铁)",
    examples: ["去(가다)", "地铁(지하철)"],
  },
  {
    char: "上·下·左·右·前·后",
    pinyin: "shàng xià zuǒ yòu qián hòu",
    meaning: "방향어 6개",
    emoji: "🧭",
    category: "방향",
    chapter: 6,
    story: "6장 방향 단어 세트! 上↑ 下↓ 左↙ 右↗ 前→ 后← — 길 안내·위치 묻기 필수!",
    formula: "방향 → 往右拐(오른쪽으로 돌다) / 一直走(곧장 가다) / 前(앞) 后(뒤)",
    examples: ["上(위)", "下(아래)", "左(왼쪽)", "右(오른쪽)", "前(앞)", "后(뒤)"],
  },
  {
    char: "一",
    pinyin: "yī",
    meaning: "하나",
    emoji: "1️⃣",
    category: "숫자",
    chapter: 6,
    story: "획 한 줄! 一下(한번·잠깐), 一直(곧장=하나+곧다)에 쓰여요.",
    formula: "一 → 一下(한번) / 一直(곧장=一+直)",
    examples: ["一下(한번·잠깐)", "一直(곧장)"],
  },
  {
    char: "十",
    pinyin: "shí",
    meaning: "열·십자",
    emoji: "➕",
    category: "숫자",
    chapter: 6,
    story: "가로+세로 한 줄=십(10)! 十字路口(사거리)의 十=길이 +자로 만나는 곳.",
    formula: "十+字 → 十字路口(사거리=十+字+路+口)",
    examples: ["十字路口(사거리)"],
  },
  {
    char: "木",
    pinyin: "mù",
    meaning: "나무",
    emoji: "🌳",
    category: "자연",
    chapter: 6,
    story: "6장에서는 查(찾아보다)! 나무(木)에 눈(目)을 대고 살피다=찾아보다.",
    formula: "木+目 → 查(찾아보다=木+目)",
    examples: ["查(찾아보다)"],
  },
  {
    char: "目",
    pinyin: "mù",
    meaning: "눈",
    emoji: "👁️",
    category: "신체",
    chapter: 6,
    story: "눈 모양 그대로! 查(찾아보다)의 오른쪽=目. 눈으로 꼼꼼히 본다!",
    formula: "目 → 查(찾아보다=木+目)",
    examples: ["查(찾아보다)"],
  },
  {
    char: "扌(手)",
    pinyin: "shǒu",
    meaning: "손",
    emoji: "✋",
    category: "행동",
    chapter: 6,
    story: "손으로 하는 동작! 拐(방향 바꾸다)·打(치다)·扫(쓸다)에 扌가 있어요.",
    formula: "扌 → 拐(돌다=손+...) / 打(치다) / 打扫(청소=打+扫)",
    examples: ["拐(방향을 바꾸다)", "打算(계획=打+算)", "打扫(청소하다)"],
  },
  {
    char: "分",
    pinyin: "fēn",
    meaning: "나누다·분",
    emoji: "⏱️",
    category: "시간",
    chapter: 6,
    story: "시간을 나눈 단위=분(分钟)! 分+钟(시계)=몇 분.",
    formula: "分+钟 → 分钟(분=나누다+시계)",
    examples: ["分钟(분)"],
  },
  {
    char: "书",
    pinyin: "shū",
    meaning: "책",
    emoji: "📚",
    category: "장소",
    chapter: 6,
    story: "책 모양! 图书馆(도서관)=图(그림)+书(책)+馆(건물).",
    formula: "书 → 图书馆(도서관=图+书+馆)",
    examples: ["图书馆(도서관)"],
  },
  {
    char: "厅",
    pinyin: "tīng",
    meaning: "홀·청",
    emoji: "☕",
    category: "장소",
    chapter: 6,
    story: "넓은 홀! 咖啡厅(카페) 끝의 厅=커피를 마시는 홀.",
    formula: "厅 → 咖啡厅(카페=咖啡+厅)",
    examples: ["咖啡厅(카페)"],
  },
  {
    char: "子",
    pinyin: "zǐ",
    meaning: "아이",
    emoji: "👶",
    category: "문법",
    chapter: 6,
    story: "6장에서는 了(완료 조사)의 원형=子! 동작이 끝났음을 표시하는 了와 연결.",
    formula: "子→了 → 到了(도착했다) / 等了(기다렸다)",
    examples: ["了(완료)", "到了(도착했다)"],
  },
];

export const RADICALS: Radical[] = [...CH4, ...CH5, ...CH6];

export const RADICALS_BY_CHAPTER = {
  4: CH4,
  5: CH5,
  6: CH6,
} as const;

/** 부수 char 필드에서 매칭용 한자 토큰 추출 */
export function extractRadicalTokens(charField: string): string[] {
  const tokens = new Set<string>();
  for (const m of charField.matchAll(/\(([\u4e00-\u9fff]+)\)/g)) {
    for (const c of m[1]) tokens.add(c);
  }
  for (const part of charField.split('/')) {
    const cleaned = part.replace(/[^\u4e00-\u9fff·]/g, '');
    for (const c of cleaned) {
      if (c !== '·') tokens.add(c);
    }
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

const RADICAL_TOKENS = new Set(RADICALS.flatMap((r) => extractRadicalTokens(r.char)));

function tokensForChapter(chapter?: number): Set<string> {
  if (chapter === 4 || chapter === 5 || chapter === 6) {
    return new Set(RADICALS_BY_CHAPTER[chapter].flatMap((r) => extractRadicalTokens(r.char)));
  }
  return RADICAL_TOKENS;
}

/** hint 조각에서 선두 부수/성분 한자 추출 (예: "口(입)" → "口", "扌(손)" → "扌") */
function leadingHanziFromHintPart(part: string): string {
  const trimmed = part.trim();
  const withParen = trimmed.match(/^([\u4e00-\u9fff\u2e00-\u2e7f\u2e80-\u2eff]+)\s*[（(]/);
  if (withParen) return withParen[1];
  return trimmed.match(/^([\u4e00-\u9fff]+)/)?.[1] ?? '';
}

/** 단어에서 사전학습 부수에 해당하는 글자 위치 반환 */
export function getRadicalHighlightIndices(
  text: string,
  hint?: string,
  chapter?: number,
): Set<number> {
  const chars = [...text];
  const indices = new Set<number>();
  const tokens = tokensForChapter(chapter);

  const isHanzi = (c: string) => /[\u4e00-\u9fff\u2e00-\u2e7f\u2e80-\u2eff]/.test(c);

  // 1) 단어 글자 자체가 배운 부수인 경우 (口·火·车·水等)
  chars.forEach((c, i) => {
    if (isHanzi(c) && tokens.has(c)) indices.add(i);
  });

  if (!hint) return indices;

  const parts = hint.split('+').map((p) => p.trim());
  const hanziIndices = chars.map((c, i) => (isHanzi(c) ? i : -1)).filter((i) => i >= 0);

  // 2) 한자풀이 i번째 성분 ↔ i번째 한자 글자
  parts.forEach((part, partIdx) => {
    const charIdx = hanziIndices[partIdx];
    if (charIdx == null) return;
    const lead = leadingHanziFromHintPart(part);
    if (lead.length === 1 && tokens.has(lead)) {
      indices.add(charIdx);
      return;
    }
    if (lead && tokens.has(lead)) {
      indices.add(charIdx);
    }
  });

  // 3) hint 전체에서 "X(" 패턴
  for (const m of hint.matchAll(/([\u4e00-\u9fff\u2e00-\u2e7f\u2e80-\u2eff])\s*[（(]/g)) {
    const r = m[1];
    if (!tokens.has(r)) continue;
    chars.forEach((c, i) => {
      if (c === r) indices.add(i);
    });
    parts.forEach((part, partIdx) => {
      const charIdx = hanziIndices[partIdx];
      if (charIdx != null && part.includes(r)) indices.add(charIdx);
    });
  }

  return indices;
}

export interface WordRadicalTip {
  label: string;
  meaning: string;
  emoji: string;
}

/** 단어에 해당하는 사전학습 부수 암기 힌트 */
export function getWordRadicalTips(word: Word): WordRadicalTip[] {
  const pool =
    word.chapter === 4 || word.chapter === 5 || word.chapter === 6
      ? RADICALS_BY_CHAPTER[word.chapter]
      : RADICALS;

  const indices = getRadicalHighlightIndices(word.chinese, word.hint, word.chapter);
  const highlighted = new Set(
    [...indices]
      .map((i) => word.chinese[i])
      .filter((c) => c && /[\u4e00-\u9fff\u2e00-\u2e7f]/.test(c)),
  );

  const tips: WordRadicalTip[] = [];
  const seen = new Set<string>();

  for (const r of pool) {
    const tokens = extractRadicalTokens(r.char);
    const matched = tokens.some((t) => highlighted.has(t) || word.chinese.includes(t));
    if (!matched) continue;

    const label = r.char.split(/[/·]/)[0].trim();
    if (seen.has(label)) continue;
    seen.add(label);

    tips.push({ label, meaning: r.meaning, emoji: r.emoji });
  }

  return tips.slice(0, 4);
}

/** 한자풀이를 글자별 분해 문자열로 (예: "跑+步" → "跑=달리다 + 步=걸음") */
export function formatHintBreakdown(hint: string, chinese: string): string | null {
  if (!hint.includes('+')) return null;

  const parts = hint.split('+').map((p) => p.trim());
  const hanzi = [...chinese].filter((c) => /[\u4e00-\u9fff\u2e00-\u2e7f]/.test(c));
  if (parts.length < 2) return null;

  const segments = parts.map((part, i) => {
    const m = part.match(/^([\u4e00-\u9fff\u2e00-\u2e7f\u2e80-\u2eff]+)\s*[（(]([^)）]+)/);
    if (m) {
      const char = hanzi[i] ?? m[1];
      return `${char}=${m[2].trim()}`;
    }
    const lead = part.match(/^([\u4e00-\u9fff]+)/)?.[1];
    if (lead && hanzi[i]) return `${hanzi[i]}(${lead})`;
    return part.replace(/\s*[（(][^)）]+[)）]/, '').trim() || null;
  }).filter(Boolean);

  return segments.length >= 2 ? segments.join(' + ') : null;
}
