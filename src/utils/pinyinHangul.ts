/** 병음(성조 기호) → 무성조 소문자 */
const TONE: Record<string, string> = {
  ā: 'a', á: 'a', ǎ: 'a', à: 'a',
  ē: 'e', é: 'e', ě: 'e', è: 'e',
  ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
  ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
  ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
  ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v', ü: 'v',
  ń: 'n', ḿ: 'm',
};

/** 표준 병음 음절 → 한국어 중국어 교육용 한글 표기 */
const SYLLABLE: Record<string, string> = {
  a: '아', ai: '아이', an: '안', ang: '앙', ao: '아오',
  ba: '바', bai: '바이', ban: '반', bang: '방', bao: '바오', bei: '베이', ben: '벤', beng: '벵', bi: '비', bian: '비안', biao: '비아오', bie: '비에', bin: '빈', bing: '병', bo: '보', bu: '부',
  ca: '차', cai: '차이', can: '찬', cang: '창', cao: '차오', ce: '츠', cen: '츤', ceng: '층', cha: '차', chai: '차이', chan: '찬', chang: '창', chao: '차오', che: '처', chen: '천', cheng: '청', chi: '치', chong: '충', chou: '초우', chu: '추', chua: '추아', chuai: 'chuai', chuan: '추안', chuang: '츄앙', chui: '추이', chun: '춘', chuo: '초',
  ci: '츠', cong: '총', cou: '초우', cu: '츠', cuan: '촨', cui: '최', cun: '춘', cuo: '초',
  da: '다', dai: '다이', dan: '단', dang: '당', dao: '다오', de: '더', dei: '데이', den: '든', deng: '덩', di: '디', dian: '디안', diao: '디아오', die: '디에', ding: '딩', diu: '디우', dong: '동', dou: '도우', du: '두', duan: '두안', dui: '두이', dun: '둔', duo: '둬',
  e: '어', ei: '에이', en: '은', eng: '엉', er: '얼',
  fa: '파', fan: '판', fang: '방', fei: '페이', fen: '펀', feng: '펑', fo: '포', fou: '포우', fu: '푸',
  ga: '가', gai: '가이', gan: '간', gang: '강', gao: '가오', ge: '거', gei: '게이', gen: '근', geng: '경', gong: '공', gou: '고우', gu: '구', gua: '과', guai: '과이', guan: '관', guang: '광', gui: '귀', gun: '군', guo: '궈',
  ha: '하', hai: '하이', han: '한', hang: '항', hao: '하오', he: '허', hei: '헤이', hen: '헌', heng: '헹', hong: '홍', hou: '호우', hu: '후', hua: '화', huai: '화이', huan: '환', huang: '황', hui: '훼이', hun: '훈', huo: '홰',
  ji: '지', jia: '지아', jian: '지안', jiang: '지앙', jiao: '지아오', jie: '지에', jin: '진', jing: '징', jiong: '지옹', jiu: '지우', ju: '쥐', juan: '쥐안', jue: '쥐에', jun: '준',
  ka: '카', kai: '카이', kan: '칸', kang: '캉', kao: '카오', ke: '커', kei: '케이', ken: '켄', keng: '켕', kong: '콩', kou: '코우', ku: '쿠', kua: '쿠아', kuai: '쿠ai', kuan: '쿠안', kuang: '쿠ang', kui: '쿠이', kun: '쿤', kuo: '쿠o',
  la: '라', lai: '라이', lan: '란', lang: '랑', lao: '라오', le: '러', lei: '레이', leng: '렝', li: '리', lia: '리아', lian: '리안', liang: '리앙', liao: '리아오', lie: '리에', lin: '린', ling: '링', liu: '리우', lo: '로', long: '롱', lou: '로우', lu: '루', luan: '루안', lun: '룬', luo: 'luo', lv: '뤼', lve: 'lve',
  ma: '마', mai: '마이', man: '만', mang: '망', mao: '마오', me: '머', mei: '메이', men: '먼', meng: '멍', mi: '미', mian: '미안', miao: '미아오', mie: '미에', min: '민', ming: '밍', miu: '미우', mo: '모', mou: '모우', mu: '무',
  na: '나', nai: '나이', nan: '난', nang: '낭', nao: '나오', ne: '너', nei: '네이', nen: 'nen', neng: '넹', ni: '니', nian: '니안', niang: '니앙', niao: '니아오', nie: '니에', nin: '닌', ning: '닝', niu: '니우', nong: '농', nou: '노우', nu: '누', nuan: '누안', nun: '눈', nuo: '놔', nv: '뉴', nve: 'nve',
  o: '오', ou: '오우',
  pa: '파', pai: '파이', pan: '판', pang: '팡', pao: '파오', pei: '페이', pen: '펀', peng: '펑', pi: '피', pian: '피안', piao: '피아오', pie: '피에', pin: '핀', ping: '핑', po: '포', pou: '포우', pu: '푸',
  qi: '치', qia: '치아', qian: '치안', qiang: '치앙', qiao: '치아오', qie: '치에', qin: '친', qing: '칭', qiong: '치옹', qiu: '치우', qu: '취', quan: '취안', que: '취에', qun: '췬',
  ran: '란', rang: '랑', rao: '라오', re: '러', ren: '런', reng: '렁', ri: '리', rong: '롱', rou: '로우', ru: '루', ruan: '루안', rui: '루이', run: '룬', ruo: 'ruo',
  sa: '사', sai: '사이', san: '산', sang: '상', sao: '사오', se: '스', sen: '센', seng: '성', sha: '샤', shai: '샤이', shan: '샨', shang: '샹', shao: '샤오', she: '셔', shei: '셰이', shen: '셴', sheng: '셩', shi: '스', shou: '쇼우', shu: '슈', shua: '슈아', shuai: '슈ai', shuan: '슈안', shuang: '슈ang', shui: '슈이', shun: '순', shuo: '슈오',
  si: '스', song: '송', sou: '소우', su: '수', suan: '수안', sui: '수이', sun: '순', suo: 'suo',
  ta: '타', tai: '타이', tan: '탄', tang: '탕', tao: '타오', te: '터', teng: '텅', ti: '티', tian: '티안', tiao: '티아오', tie: '티에', ting: '팅', tong: '통', tou: '토우', tu: '투', tuan: '투안', tui: '투이', tun: '툰', tuo: '투오',
  wa: '와', wai: '와이', wan: '완', wang: '왕', wei: '웨이', wen: '원', weng: '웽', wo: '워', wu: '우',
  xi: '시', xia: '시아', xian: '시안', xiang: '시앙', xiao: '시아오', xie: '시에', xin: '신', xing: '싱', xiong: '시옹', xiu: '시우', xu: '쉬', xuan: '쉬안', xue: '쉐', xun: '쉰',
  ya: '야', yan: '얀', yang: '양', yao: '야오', ye: '예', yi: '이', yin: '인', ying: '잉', yo: '요', yong: '용', you: '우', yu: '위', yuan: '위안', yue: '웨', yun: '윈',
  za: '자', zai: '자이', zan: '잔', zang: '장', zao: '자오', ze: '저', zei: '제이', zen: '젠', zeng: '증', zha: '자', zhai: '자ai', zhan: '잔', zhang: '장', zhao: '자오', zhe: '저', zhei: 'zhei', zhen: '전', zheng: '정', zhi: '즈', zhong: '중', zhou: '저우', zhu: '주', zhua: '주a', zhuai: 'zhuai', zhuan: '주an', zhuang: '주ang', zhui: 'zhui', zhun: '준', zhuo: 'zhuo',
  zi: '즈', zong: '종', zou: '조우', zu: '주', zuan: 'zuan', zui: 'zui', zun: '준', zuo: '쭤',
  r: '르',
};

const SYLLABLE_KEYS = Object.keys(SYLLABLE).sort((a, b) => b.length - a.length);

function stripTone(raw: string): string {
  return [...raw]
    .map((c) => TONE[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/ü/g, 'v');
}

/** 연속 병음 문자열을 음절 단위로 분리 */
function splitSyllables(text: string): string[] {
  const normalized = stripTone(text)
    .replace(/['']/g, ' ')
    .replace(/…+/g, ' ')
    .replace(/[^a-z\s]/g, ' ');

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const result: string[] = [];

  for (const token of tokens) {
    let i = 0;
    while (i < token.length) {
      let matched = '';
      for (const key of SYLLABLE_KEYS) {
        if (token.startsWith(key, i)) {
          matched = key;
          break;
        }
      }
      if (matched) {
        result.push(matched);
        i += matched.length;
      } else {
        i += 1;
      }
    }
  }

  return result;
}

function syllableToHangul(syl: string): string {
  const mapped = SYLLABLE[syl];
  if (mapped) return mapped;
  return '';
}

/** 병음 문자열 → 한글 발음 (예: "bǎohù" → "바오후") */
export function pinyinToHangul(pinyin: string): string {
  if (!pinyin.trim()) return '';
  const parts = splitSyllables(pinyin);
  if (parts.length === 0) return '';
  return parts.map(syllableToHangul).filter(Boolean).join('');
}
