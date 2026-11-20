import type {
  Category,
  CategoryFilter,
  Era,
  EraFilter,
  Person,
  SourceFilter,
} from '../types/game';

export const PEOPLE_STORAGE_KEY = 'kr_great_figures_pool_v1';
const SEED_VERSION_KEY = 'kr_great_figures_seed_version';
const CURRENT_SEED_VERSION = 2;

export const ERAS: Era[] = [
  '고조선~삼국',
  '고려',
  '조선',
  '근현대',
  '현대/기타',
];

export const ERA_FILTERS: EraFilter[] = ['전체', ...ERAS];

export const CATEGORIES: Category[] = [
  '정치/외교',
  '군사/국방',
  '과학/기술',
  '문화/예술',
  '학문/사상',
  '경제/산업',
];

export const CATEGORY_FILTERS: CategoryFilter[] = ['전체', ...CATEGORIES];

export const ERA_DESCRIPTIONS: Record<Era, string> = {
  '고조선~삼국': '고조선 건국부터 삼국·발해·통일신라까지 민족의 기틀과 문화를 세운 시대',
  고려: '후삼국을 통일하고 자주 외교와 과학 기술, 불교 문화를 꽃피운 시대',
  조선: '훈민정음 창제와 성리학·실학, 국난 극복의 충절이 빛난 시대',
  근현대: '조국의 독립과 자유, 민족의 언어와 양심을 지켜낸 시대',
  '현대/기타': '산업화·과학·의학·인권·문화 예술로 대한민국을 세계에 알린 시대',
};

export const ERA_STYLES: Record<Era, { text: string; bg: string; dot: string }> = {
  '고조선~삼국': {
    text: 'text-[#854D0E]',
    bg: 'bg-[#FEF9C3]/70',
    dot: 'bg-[#CA8A04]',
  },
  고려: {
    text: 'text-[#0F766E]',
    bg: 'bg-[#CCFBF1]/70',
    dot: 'bg-[#0D9488]',
  },
  조선: {
    text: 'text-[#1E3A8A]',
    bg: 'bg-[#DBEAFE]/70',
    dot: 'bg-[#2563EB]',
  },
  근현대: {
    text: 'text-[#991B1B]',
    bg: 'bg-[#FEE2E2]/70',
    dot: 'bg-[#DC2626]',
  },
  '현대/기타': {
    text: 'text-[#374151]',
    bg: 'bg-[#E5E7EB]/80',
    dot: 'bg-[#4B5563]',
  },
};

export const CATEGORY_STYLES: Record<Category, { text: string; border: string }> = {
  '정치/외교': { text: 'text-[#1E3A8A]', border: 'border-[#BFDBFE]' },
  '군사/국방': { text: 'text-[#991B1B]', border: 'border-[#FECACA]' },
  '과학/기술': { text: 'text-[#0F766E]', border: 'border-[#99F6E4]' },
  '문화/예술': { text: 'text-[#6B21A8]', border: 'border-[#E9D5FF]' },
  '학문/사상': { text: 'text-[#92400E]', border: 'border-[#FDE68A]' },
  '경제/산업': { text: 'text-[#166534]', border: 'border-[#BBF7D0]' },
};

const SEED_DATE = '2026-01-01T00:00:00.000Z';

export const PRESET_PEOPLE: Person[] = [
  // ── 고조선~삼국 (12명) ─────────────────────────────────────────────
  {
    id: 'preset-dangun',
    name: '단군왕검',
    alias: '고조선의 건국 시조',
    era: '고조선~삼국',
    category: '정치/외교',
    summary: '홍익인간의 이념으로 우리 민족 최초의 국가 고조선을 세웠다.',
    details:
      '널리 인간을 이롭게 한다는 홍익인간 정신을 바탕으로 아사달에 도읍을 정하고 고조선을 건국했다. 청동기 문화를 기반으로 한반도 북부와 만주 일대에 초기 국가 체제를 형성했다.',
    tags: ['고조선', '홍익인간', '건국'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jumong',
    name: '동명성왕',
    alias: '고구려 건국 시조 주몽',
    era: '고조선~삼국',
    category: '정치/외교',
    summary: '졸본 지역에 고구려를 세워 북방 강국의 기틀을 마련했다.',
    details:
      '부여에서 남하해 기원전 37년 압록강 유역 졸본에 도읍을 정하고 고구려를 건국했다. 뛰어난 활솜씨와 지도력으로 주변 소국들을 통합하며 동북아 강대국으로 도약할 기반을 다졌다.',
    tags: ['고구려건국', '주몽', '졸본'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-geunchogo',
    name: '근초고왕',
    alias: '백제 최전성기의 국왕',
    era: '고조선~삼국',
    category: '정치/외교',
    summary: '마한을 통합하고 해상 교역을 넓혀 백제의 전성기를 이끌었다.',
    details:
      '4세기 중엽 마한의 잔여 세력을 복속하고 북으로 평양성을 공격해 고구려 고국원왕을 전사시켰다. 중국 동진과 일본 규슈 지역까지 진출해 활발한 해상 네트워크를 구축했으며 역사서 서기를 편찬했다.',
    tags: ['백제전성기', '해상교역', '마한통합'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-gwanggaeto',
    name: '광개토대왕',
    alias: '고구려 제19대 국왕',
    era: '고조선~삼국',
    category: '군사/국방',
    summary: '고구려의 영토를 만주와 한반도 북부까지 크게 넓혔다.',
    details:
      '영락이라는 독자적 연호를 사용하며 백제·거란·숙신 등을 정벌하고 신라에 침입한 왜구를 격퇴했다. 그의 정복 활동과 위업은 아들 장수왕이 세운 광개토대왕릉비에 상세히 기록되어 있다.',
    tags: ['고구려', '영토확장', '광개토대왕릉비'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jangsu',
    name: '장수왕',
    alias: '고구려 남진 정책의 군주',
    era: '고조선~삼국',
    category: '정치/외교',
    summary: '수도를 평양으로 옮기고 한강 유역을 장악해 동북아 패권을 세웠다.',
    details:
      '427년 평양 천도를 단행해 남진 정책을 본격화했고 백제의 수도 한성을 함락해 한강 유역을 확보했다. 중국의 남조와 북조 모두와 등거리 외교를 펼치며 고구려의 최전성기를 구가했다.',
    tags: ['평양천도', '남진정책', '충주고구려비'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-eulji',
    name: '을지문덕',
    alias: '살수대첩의 명장',
    era: '고조선~삼국',
    category: '군사/국방',
    summary: '살수대첩에서 수나라의 대군을 물리치고 나라를 지켰다.',
    details:
      '612년 수 양제가 이끈 별동대 30만 대군을 청야 전술과 유인책으로 지치게 한 뒤 살수에서 궤멸시켰다. 적장 우중문에게 보낸 오언시 여수장우중문시는 지략과 기개의 상징으로 전해진다.',
    tags: ['살수대첩', '고구려', '여수장우중문시'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-gyebaek',
    name: '계백',
    alias: '황산벌의 결사대장',
    era: '고조선~삼국',
    category: '군사/국방',
    summary: '오천 결사대를 이끌고 황산벌에서 끝까지 맞서 백제의 충절을 보였다.',
    details:
      '660년 나당 연합군의 침공으로 백제가 위기에 처하자 5천 명의 결사대를 이끌고 황산벌로 출정했다. 열 배에 달하는 신라군에 맞서 네 차례 승리를 거두며 최후까지 나라를 지킨 충신으로 기억된다.',
    tags: ['황산벌전투', '백제충절', '오천결사대'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-seondeok',
    name: '선덕여왕',
    alias: '신라 최초의 여왕',
    era: '고조선~삼국',
    category: '문화/예술',
    summary: '첨성대와 황룡사 구층목탑을 건립해 신라의 과학과 문화를 일으켰다.',
    details:
      '우리 역사 최초의 여성 군주로 즉위해 백성 구휼과 외교적 안정을 도모했다. 동양에서 가장 오래된 천문대인 첨성대와 분황사 모전석탑, 황룡사 구층목탑을 세워 찬란한 신라 문화를 꽃피웠다.',
    tags: ['첨성대', '황룡사구층목탑', '신라여왕'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimyusin',
    name: '김유신',
    alias: '삼국 통일의 주역',
    era: '고조선~삼국',
    category: '군사/국방',
    summary: '화랑도를 이끌며 수많은 전장에서 승리해 신라의 삼국 통일을 도왔다.',
    details:
      '가야 왕족 출신의 한계를 실력으로 극복하고 김춘추와 협력해 신라의 군사력을 이끌었다. 황산벌 전투와 매소성·기벌포 전투 등 통일 전쟁의 핵심 국면마다 결정적 공훈을 세워 흥무대왕으로 추존되었다.',
    tags: ['화랑도', '삼국통일', '흥무대왕'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-wonhyo',
    name: '원효',
    alias: '신라의 대사상가',
    era: '고조선~삼국',
    category: '학문/사상',
    summary: '일심과 화쟁 사상으로 불교를 백성들에게 널리 알렸다.',
    details:
      '당나라 유학길에서 해골물을 마신 뒤 일체유심조의 깨달음을 얻고 귀국하여 종파 간 대립을 조화시키는 화쟁 사상을 정립했다. 무애가를 부르며 귀족 중심이던 불교를 일반 백성에게 전파했다.',
    tags: ['불교대중화', '화쟁사상', '일체유심조'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-daejoyeong',
    name: '대조영',
    alias: '해동성국 발해의 시조',
    era: '고조선~삼국',
    category: '정치/외교',
    summary: '고구려 유민과 말갈족을 이끌고 동모산에 발해를 건국했다.',
    details:
      '고구려 멸망 이후 당나라의 지배에서 벗어나 천문령 전투에서 승리한 뒤 698년 동모산에 발해를 세웠다. 고구려 계승 의식을 확립하며 남북국 시대를 열었고 훗날 해동성국 번영의 토대를 놓았다.',
    tags: ['발해건국', '동모산', '남북국시대'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jangbogo',
    name: '장보고',
    alias: '바다의 왕자',
    era: '고조선~삼국',
    category: '경제/산업',
    summary: '완도에 청해진을 세워 해적을 소탕하고 해상 무역을 주도했다.',
    details:
      '당나라에서 무령군 소장으로 활약한 뒤 신라로 돌아와 흥덕왕의 허락을 받아 완도에 청해진을 설치했다. 황해의 해적을 소탕하고 신라·당·일본을 잇는 동아시아 삼각 해상 무역망을 장악했다.',
    tags: ['청해진', '해상무역', '통일신라'],
    isPreset: true,
    createdAt: SEED_DATE,
  },

  // ── 고려 (11명) ────────────────────────────────────────────────────
  {
    id: 'preset-wanggeon',
    name: '왕건',
    alias: '고려 건국 태조',
    era: '고려',
    category: '정치/외교',
    summary: '후삼국을 통일하고 민족의 재통합을 이룬 고려를 세웠다.',
    details:
      '호족 포용 정책과 백성의 조세 부담을 줄이는 취민유도를 펼쳐 민심을 얻었다. 신라의 평화적 귀순과 발해 유민 포용을 통해 실질적인 민족 재통합을 이루었으며 훈요십조를 남겼다.',
    tags: ['고려건국', '후삼국통일', '훈요십조'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-seohee',
    name: '서희',
    alias: '강동 육주의 외교관',
    era: '고려',
    category: '정치/외교',
    summary: '거란 장수 소손녕과의 외교 담판으로 강동 육주를 얻었다.',
    details:
      '993년 거란의 1차 침입 당시 조정의 할지론을 물리치고 직접 적진에 들어가 소손녕과 담판을 벌였다. 고려가 고구려의 계승국임을 당당히 밝히고 전투 없이 압록강 동쪽의 강동 6주를 확보했다.',
    tags: ['외교담판', '강동6주', '거란'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-ganggamchan',
    name: '강감찬',
    alias: '귀주대첩의 영웅',
    era: '고려',
    category: '군사/국방',
    summary: '귀주대첩에서 거란의 침략군을 크게 무찌르고 승리했다.',
    details:
      '1019년 거란의 3차 침입 때 상원수로 출정하여 흥화진 수공 전술과 귀주에서의 대결전으로 소배압의 10만 대군을 대파했다. 이후 동북아에 고려·송·거란 간의 세력 균형과 평화가 자리 잡았다.',
    tags: ['귀주대첩', '거란격퇴', '고려명장'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-uicheon',
    name: '의천',
    alias: '대각국사, 천태종 창시자',
    era: '고려',
    category: '학문/사상',
    summary: '교종과 선종의 통합을 모색하며 고려 천태종을 개창하고 교장을 편찬했다.',
    details:
      '고려 문종의 넷째 아들로 출가해 송나라에서 불교 경전을 수집하고 귀국해 교장도감을 설치했다. 교관겸수 사상을 바탕으로 화엄종 중심의 교종과 선종을 아우르는 해동 천태종을 세웠다.',
    tags: ['천태종', '교관겸수', '대각국사'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yungwan',
    name: '윤관',
    alias: '별무반과 동북 9성의 명장',
    era: '고려',
    category: '군사/국방',
    summary: '별무반을 조직해 여진족을 정벌하고 북방에 동북 구성을 쌓았다.',
    details:
      '기병 위주의 여진군에 맞서기 위해 신기군·신보군·항마군으로 구성된 특수부대 별무반 창설을 건의했다. 1107년 대군을 이끌고 여진을 격퇴한 뒤 북방 요충지에 동북 9성을 축조해 국방을 강화했다.',
    tags: ['별무반', '동북9성', '여진정벌'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimbusik',
    name: '김부식',
    alias: '삼국사기의 편찬자',
    era: '고려',
    category: '학문/사상',
    summary: '현존하는 가장 오래된 역사서인 삼국사기를 편찬해 고대사를 기록했다.',
    details:
      '고려 인종의 명을 받아 1145년 고구려·백제·신라의 역사를 기전체 형식으로 정리한 삼국사기를 완성했다. 합리적 유교 사관으로 삼국 시대의 정치·제도·인물 기록을 체계화해 한국 고대사 연구의 근간을 남겼다.',
    tags: ['삼국사기', '기전체', '역사서'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jinul',
    name: '지눌',
    alias: '보조국사, 수선사 결사',
    era: '고려',
    category: '학문/사상',
    summary: '돈오점수와 정혜쌍수를 주창하며 고려 불교의 개혁과 통합을 이끌었다.',
    details:
      '무신 집권기 타락한 불교계의 개혁을 외치며 순천 송광사에서 수선사 결사를 전개했다. 선종을 중심으로 교종을 포용하는 정혜쌍수와 돈오점수 수행법을 정립해 한국 조계종의 전통을 확립했다.',
    tags: ['수선사결사', '돈오점수', '정혜쌍수'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-iryeon',
    name: '일연',
    alias: '삼국유사의 저자',
    era: '고려',
    category: '문화/예술',
    summary: '단군 신화와 향가를 담은 삼국유사를 저술해 민족 문화의 뿌리를 전했다.',
    details:
      '몽골 침략으로 민족의 자긍심이 흔들리던 13세기 후반, 군위 인각사에서 삼국유사를 집필했다. 고조선 단군 건국 이야기와 신라 향가 14수, 불교 설화와 민중 문화를 생생하게 보존했다.',
    tags: ['삼국유사', '향가', '단군신화'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-munikjeom',
    name: '문익점',
    alias: '목화씨 전래의 은인',
    era: '고려',
    category: '경제/산업',
    summary: '원나라에서 목화씨를 들여와 재배에 성공하며 백성의 의생활을 혁신했다.',
    details:
      '공민왕 때 원나라에 사신으로 갔다가 돌아오는 길에 목화씨를 가져와 장인 정천익과 함께 재배와 물레·씨아 제작에 성공했다. 무명옷이 전국에 보급되면서 백성들이 따뜻한 겨울을 날 수 있게 되었다.',
    tags: ['목화씨', '의생활혁신', '무명옷'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-choemuseon',
    name: '최무선',
    alias: '화약 개발의 선구자',
    era: '고려',
    category: '과학/기술',
    summary: '화약 제조법을 독자적으로 개발해 왜구를 격퇴하는 데 힘썼다.',
    details:
      '중국 상인 이원에게 염초 제조 원리를 탐구하여 수년간의 실험 끝에 독자적인 화약 생산에 성공했다. 화통도감을 설치하고 화포를 탑재한 전함으로 진포대첩에서 왜선 500여 척을 격파했다.',
    tags: ['화약', '화통도감', '진포대첩'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jeongmongju',
    name: '정몽주',
    alias: '포은, 고려 말의 충신',
    era: '고려',
    category: '학문/사상',
    summary: '성리학을 보급하고 단심가로 고려 왕조에 대한 굳은 절개를 지켰다.',
    details:
      '고려 말 동방 이학의 시조로 불리며 성균관을 부흥시키고 명나라·일본과의 외교 난제를 해결했다. 역성혁명에 반대하며 선죽교에서 생을 마감해 조선 시대에도 충절의 표상으로 추앙받았다.',
    tags: ['단심가', '성리학', '선죽교'],
    isPreset: true,
    createdAt: SEED_DATE,
  },

  // ── 조선 (16명) ────────────────────────────────────────────────────
  {
    id: 'preset-jeongdojeon',
    name: '정도전',
    alias: '조선 건국의 설계자 삼봉',
    era: '조선',
    category: '정치/외교',
    summary: '조선경국전을 저술하고 한양 도성과 통치 제도의 기틀을 설계했다.',
    details:
      '이성계를 도와 조선 건국의 핵심 역할을 수행하며 경복궁과 한양 도성의 전각 명칭을 정했다. 조선경국전과 경제문감 등을 저술해 민본주의와 재상 중심의 정치 철학을 제시했다.',
    tags: ['조선건국', '조선경국전', '한양설계'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-hwanghui',
    name: '황희',
    alias: '조선 최고의 청백리 재상',
    era: '조선',
    category: '정치/외교',
    summary: '세종을 보좌해 오랜 기간 영의정으로 재임하며 청렴한 정치를 펼쳤다.',
    details:
      '태종과 세종 대에 걸쳐 18년간 영의정으로 봉직하며 4군 6진 개척, 농사직설 편찬, 예법 정비 등 조선 초기의 주요 국정을 이끌었다. 검소하고 포용력 있는 성품으로 청백리의 상징이 되었다.',
    tags: ['청백리', '영의정', '세종보좌'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-sejong',
    name: '세종대왕',
    alias: '조선 제4대 성군',
    era: '조선',
    category: '정치/외교',
    summary: '백성이 쉽게 글을 익히도록 훈민정음을 창제하고 반포하였다.',
    details:
      '집현전을 중심으로 학문과 과학 기술을 장려하고 농사직설 편찬, 4군 6진 개척, 음악 정비 등 찬란한 민족 문화를 일구었다. 1443년 창제한 훈민정음은 오늘날 한글로 이어져 세계적 문자로 평가받는다.',
    tags: ['훈민정음', '집현전', '애민정신'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jangyeongsil',
    name: '장영실',
    alias: '조선 최고의 발명가',
    era: '조선',
    category: '과학/기술',
    summary: '자격루와 앙부일구 등 정밀한 천문 관측 기구를 발명하였다.',
    details:
      '관노 출신의 신분적 한계를 뛰어난 재능으로 극복하고 세종대왕의 발탁을 받아 조선의 과학 수준을 끌어올렸다. 스스로 시간을 알리는 물시계 자격루, 해시계 앙부일구, 혼천의와 측우기 제작에 기여했다.',
    tags: ['자격루', '앙부일구', '천문과학'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-saimdang',
    name: '신사임당',
    alias: '초충도의 거장',
    era: '조선',
    category: '문화/예술',
    summary: '섬세한 초충도 등 뛰어난 예술 작품을 남기고 율곡을 길렀다.',
    details:
      '강릉 오죽헌에서 태어나 시·서·화에 모두 능통했으며, 풀과 벌레를 사실적이고 우아하게 묘사한 초충도로 조선 회화사에 큰 족적을 남겼다. 대학자 율곡 이이의 어머니로도 널리 알려져 있다.',
    tags: ['초충도', '조선회화', '오죽헌'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yihwang',
    name: '이황',
    alias: '퇴계, 조선 성리학의 거두',
    era: '조선',
    category: '학문/사상',
    summary: '도산서원을 세우고 주리론을 체계화해 조선 성리학을 크게 발전시켰다.',
    details:
      '성학십도와 주자서절요를 저술해 도덕적 수양과 인간의 근본적 선함을 강조하는 주리론을 정립했다. 고향 안동에 도산서원을 세워 수많은 제자를 양성했으며 그의 학문은 일본 유학계에도 큰 영향을 미쳤다.',
    tags: ['퇴계이황', '도산서원', '성학십도'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yii',
    name: '이이',
    alias: '율곡, 경세치용의 대학자',
    era: '조선',
    category: '학문/사상',
    summary: '십만양병설을 주장하고 주기론과 사회 개혁안을 제시해 실학에 영향을 주었다.',
    details:
      '아홉 차례 과거에 장원 급제해 구도장원공으로 불렸으며 동호문답·성학집요·격몽요결 등을 집필했다. 현실 개혁을 중시한 주기론과 수미법·향약 보급 논의는 후대 조선 실학 사상의 토대가 되었다.',
    tags: ['율곡이이', '십만양병설', '성학집요'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-heojun',
    name: '허준',
    alias: '동의보감의 의성',
    era: '조선',
    category: '과학/기술',
    summary: '백성을 위한 의학서 동의보감을 편찬해 동아시아 의학 발전에 기여했다.',
    details:
      '임진왜란의 혼란 속에서도 방대한 임상 경험과 의서를 집대성해 1610년 25권 분량의 동의보감을 완성했다. 주변에서 쉽게 구할 수 있는 약재와 한글 약초명을 함께 기록해 유네스코 세계기록유산에 등재되었다.',
    tags: ['동의보감', '한의학', '세계기록유산'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yisunshin',
    name: '이순신',
    alias: '충무공',
    era: '조선',
    category: '군사/국방',
    summary: '임진왜란 당시 거북선과 뛰어난 전략으로 바다를 지켜냈다.',
    details:
      '한산도 대첩의 학익진과 명량 해전의 13척 기적 등 23전 전승의 신화를 쓰며 조선의 제해권과 곡창지대를 사수했다. 전중 기록인 난중일기는 유네스코 세계기록유산으로 등재되어 있다.',
    tags: ['임진왜란', '거북선', '난중일기'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kwonyul',
    name: '권율',
    alias: '행주대첩의 명장',
    era: '조선',
    category: '군사/국방',
    summary: '행주산성에서 관군과 의병이 힘을 모아 왜군의 대공세를 막아냈다.',
    details:
      '임진왜란 때 이치 전투에서 승리해 호남 곡창지대를 지켰고, 1593년 행주산성에서 3만 왜군의 9차례 총공격을 화차와 비격진천뢰 등으로 격퇴했다. 한산도·진주 대첩과 함께 임진왜란 3대 대첩으로 꼽힌다.',
    tags: ['행주대첩', '임진왜란', '도원수'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-heogyun',
    name: '허균',
    alias: '최초의 한글 소설 작가',
    era: '조선',
    category: '문화/예술',
    summary: '홍길동전을 지어 신분 제도의 모순을 비판하고 평등 사회를 꿈꾸었다.',
    details:
      '적서 차별과 부패한 권력을 정면으로 비판하며 최초의 한글 소설 홍길동전을 통해 이상향 율도국을 그려냈다. 시인이자 비평가, 개혁 사상가로 활동하며 백성이 나라의 근본이라는 호민론을 주장했다.',
    tags: ['홍길동전', '한글소설', '호민론'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jeongjo',
    name: '정조',
    alias: '조선 후기 르네상스의 군주',
    era: '조선',
    category: '정치/외교',
    summary: '규장각을 육성하고 탕평책과 수원 화성 건설로 조선의 개혁을 이끌었다.',
    details:
      '왕실 도서관 규장각을 정치·학술 개혁 기구로 키우고 서얼과 실학자들을 등용해 인재 풀을 넓혔다. 신해통공으로 상업 자유를 확대하고 정약용의 거중기를 활용해 계획도시 수원 화성을 완성했다.',
    tags: ['규장각', '수원화성', '탕평책'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimhongdo',
    name: '김홍도',
    alias: '단원, 조선 풍속화의 대가',
    era: '조선',
    category: '문화/예술',
    summary: '서민의 일상과 생동감을 담은 풍속화로 조선 후기 회화의 절정을 이루었다.',
    details:
      '도화서 화원으로 정조의 두터운 신임을 받으며 산수화·인물화·화조화 전반에 걸쳐 탁월한 기량을 펼쳤다. 씨름·서당·무동 등 단원풍속도첩을 통해 조선 백성의 해학과 활기를 생생하게 포착했다.',
    tags: ['단원김홍도', '풍속화', '씨름도'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jeongyakyong',
    name: '정약용',
    alias: '다산 실학자',
    era: '조선',
    category: '학문/사상',
    summary: '목민심서를 저술하고 거중기를 설계해 수원 화성 축조를 도왔다.',
    details:
      '18년간의 강진 유배 생활 동안 경세유표·목민심서·흠흠신서 등 500여 권의 방대한 저서를 집필해 조선 후기 실학을 집대성했다. 도르래 원리를 응용한 거중기를 고안해 수원 화성 공사 기간을 크게 단축했다.',
    tags: ['실학', '목민심서', '거중기'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimjeonghui',
    name: '김정희',
    alias: '추사체의 대가이자 금석학자',
    era: '조선',
    category: '문화/예술',
    summary: '독창적인 추사체를 완성하고 북한산 진흥왕 순수비를 고증해 냈다.',
    details:
      '청나라 학자들과 교류하며 실사구시 정신의 고증학과 금석학을 조선에 꽃피웠다. 제주도 유배 시절 그린 국보 세한도와 강인하면서도 파격적인 조형미의 추사체로 한국 서예사의 정점을 이루었다.',
    tags: ['추사체', '세한도', '금석학'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimjeongho',
    name: '김정호',
    alias: '대동여지도의 지리학자',
    era: '조선',
    category: '과학/기술',
    summary: '전국을 직접 답사하고 정밀한 목판 지도인 대동여지도를 제작하였다.',
    details:
      '기존 지도의 오류를 바로잡고 백성과 나라에 실용적인 지도를 보급하기 위해 평생을 지도 제작에 바쳤다. 1861년 간행한 대동여지도는 10리마다 눈금을 표시하고 산줄기와 물길을 정교하게 담아낸 걸작이다.',
    tags: ['대동여지도', '지리학', '목판지도'],
    isPreset: true,
    createdAt: SEED_DATE,
  },

  // ── 근현대 (12명) ──────────────────────────────────────────────────
  {
    id: 'preset-jeonbongjun',
    name: '전봉준',
    alias: '녹두장군, 동학농민운동 지도자',
    era: '근현대',
    category: '정치/외교',
    summary: '탐관오리의 횡포와 외세에 맞서 동학농민운동을 이끌며 개혁을 외쳤다.',
    details:
      '1894년 고부 봉기를 시작으로 황토현과 황룡촌 전투에서 관군을 물리치고 전주성을 점령해 폐정개혁안을 제시했다. 반봉건·반외세 정신은 이후 항일 의병과 근대 민권 운동으로 계승되었다.',
    tags: ['동학농민운동', '녹두장군', '폐정개혁'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-jusigyeong',
    name: '주시경',
    alias: '현대 국어학의 선구자',
    era: '근현대',
    category: '학문/사상',
    summary: '한글이라는 이름을 널리 알리고 우리말 문법을 체계적으로 연구했다.',
    details:
      '국어문법과 말의 소리를 집필해 현대 한글 맞춤법과 띄어쓰기, 가로쓰기 이론의 기초를 세웠다. 말이 오르면 나라도 오른다는 신념 아래 조선어학회로 이어지는 우리말 수호 운동의 스승이 되었다.',
    tags: ['한글연구', '국어문법', '주시경'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-anchangho',
    name: '안창호',
    alias: '도산, 민족 계몽과 독립의 지도자',
    era: '근현대',
    category: '정치/외교',
    summary: '신민회와 흥사단을 세워 교육과 실력 양성을 통한 독립을 추구했다.',
    details:
      '대성학교 설립과 신민회·흥사단 창립을 통해 무실역행과 정직한 시민 의식을 강조했다. 상하이 대한민국 임시정부의 통합과 내무총장 직무 수행에 헌신하며 평화롭고 통합된 독립운동을 이끌었다.',
    tags: ['도산안창호', '흥사단', '신민회'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-ahjunggeun',
    name: '안중근',
    alias: '대한의군 참모중장',
    era: '근현대',
    category: '군사/국방',
    summary: '하얼빈 역에서 이토 히로부미를 저격하고 동양 평화를 외쳤다.',
    details:
      '교육 계몽과 의병 투쟁을 전개한 뒤 1909년 10월 26일 하얼빈 역에서 침략의 원흉 이토 히로부미를 처단했다. 뤼순 감옥에서 순국 직전까지 동양평화론을 집필하며 자주독립과 평화 공존을 역설했다.',
    tags: ['하얼빈의거', '동양평화론', '독립운동'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-shinchaeho',
    name: '신채호',
    alias: '단재, 민족 사학의 거목',
    era: '근현대',
    category: '학문/사상',
    summary: '역사는 아와 비아의 투쟁이라 외치며 자주적인 민족 사학을 정립했다.',
    details:
      '독사신론과 조선상고사를 저술해 일제의 식민사관에 맞서고 고조선·고구려 중심의 자주적 역사관을 세웠다. 의열단의 조선혁명선언을 집필하며 언론과 역사를 무기로 끝까지 독립 투쟁을 전개했다.',
    tags: ['민족사학', '조선상고사', '조선혁명선언'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimjwajin',
    name: '김좌진',
    alias: '청산리 대첩의 백야 장군',
    era: '근현대',
    category: '군사/국방',
    summary: '북로군정서를 지휘해 청산리 대첩에서 일본군을 크게 격파하였다.',
    details:
      '1920년 10월 만주 화룡현 청산리 일대에서 홍범도 등 연합 독립군과 함께 엿새간 열 차례 넘는 격전 끝에 일본 정예군을 대파했다. 이후 신민부를 조직해 만주 한인 사회의 자치와 군사 양성에 힘썼다.',
    tags: ['청산리대첩', '북로군정서', '독립군'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-hongbeomdo',
    name: '홍범도',
    alias: '봉오동 전투의 독립군 영웅',
    era: '근현대',
    category: '군사/국방',
    summary: '대한독립군을 이끌고 봉오동 전투에서 일본군을 무찌르며 독립 의지를 보였다.',
    details:
      '평민 포수 출신으로 항일 의병장을 거쳐 만주에서 대한독립군 총사령관으로 활약했다. 1920년 6월 봉오동 전투에서 지형을 활용한 매복 전술로 일본군 정규군에 첫 대승을 거두고 청산리 대첩에도 참전했다.',
    tags: ['봉오동전투', '대한독립군', '항일무장투쟁'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yugwansun',
    name: '유관순',
    alias: '아우내의 독립 열사',
    era: '근현대',
    category: '정치/외교',
    summary: '아우내 장터에서 대한 독립 만세 운동을 이끌며 끝까지 항거했다.',
    details:
      '이화학당 재학 중 3·1 운동에 참여한 뒤 고향 천안으로 내려가 1919년 4월 1일 아우내 장터 만세 시위를 주도했다. 서대문 형무소에서도 꺾이지 않는 기개로 옥중 만세 운동을 벌이다 순국했다.',
    tags: ['3·1운동', '아우내장터', '독립열사'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-kimgu',
    name: '김구',
    alias: '백범 임시정부 주석',
    era: '근현대',
    category: '정치/외교',
    summary: '대한민국 임시정부를 이끌며 조국의 완전한 독립과 문화를 염원했다.',
    details:
      '한인애국단을 조직하고 한국광복군을 창설해 무장 독립 투쟁을 지도했으며, 광복 후에는 남북 분단을 막기 위해 헌신했다. 저서 백범일지의 나의 소원에서 높은 문화의 힘을 지닌 자주독립국을 꿈꾸었다.',
    tags: ['임시정부', '백범일지', '문화강국'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yunbonggil',
    name: '윤봉길',
    alias: '매헌, 훙커우 공원의 의거',
    era: '근현대',
    category: '군사/국방',
    summary: '상하이 훙커우 공원 의거로 세계에 한국의 독립 의지를 드높였다.',
    details:
      '고향에서 야학과 농촌 계몽 운동을 벌인 뒤 상하이로 건너가 한인애국단에 입단했다. 1932년 4월 29일 훙커우 공원 의거를 결행해 침체되어 있던 대한민국 임시정부가 국제적 지원을 얻는 결정적 전기를 마련했다.',
    tags: ['훙커우의거', '한인애국단', '매헌윤봉길'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-bangjeonghwan',
    name: '방정환',
    alias: '소파, 어린이날의 창시자',
    era: '근현대',
    category: '문화/예술',
    summary: '어린이날을 제정하고 잡지 어린이를 창간해 아동의 인권과 존엄을 알렸다.',
    details:
      '어린이를 하나의 독립된 인격체로 존중해야 한다는 신념으로 색동회를 창립하고 1923년 잡지 어린이를 발간했다. 구연동화와 동요 보급 운동을 통해 식민지 시절 아이들에게 희망과 민족의 꿈을 심어 주었다.',
    tags: ['어린이날', '색동회', '아동인권'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-yoondongju',
    name: '윤동주',
    alias: '별을 노래한 민족 시인',
    era: '근현대',
    category: '문화/예술',
    summary: '서시와 별 헤는 밤을 통해 어두운 시대의 양심과 순수를 노래했다.',
    details:
      '일제강점기 말기 우리말 사용이 억압받던 시기에도 한글로 시를 쓰며 부끄러움 없는 삶과 시대적 성찰을 담아냈다. 유고 시집 하늘과 바람과 별과 시는 오늘날까지 한국인이 가장 사랑하는 시집으로 남아 있다.',
    tags: ['서시', '별헤는밤', '민족시인'],
    isPreset: true,
    createdAt: SEED_DATE,
  },

  // ── 현대/기타 (9명) ────────────────────────────────────────────────
  {
    id: 'preset-yuilhan',
    name: '유일한',
    alias: '노블레스 오블리주 기업가',
    era: '현대/기타',
    category: '경제/산업',
    summary: '국민 건강을 위해 제약 회사를 세우고 전 재산을 사회에 환원했다.',
    details:
      '1926년 유한양행을 설립해 투명한 납세와 종업원 지주제를 실천하며 현대적 기업 윤리의 표본을 제시했다. 독립운동을 비밀리에 후원했으며 타계 시 소유 주식 전부를 공익 재단에 기부했다.',
    tags: ['기업가정신', '사회환원', '유한양행'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-sohnkeechung',
    name: '손기정',
    alias: '베를린 올림픽 마라톤 금메달리스트',
    era: '현대/기타',
    category: '문화/예술',
    summary: '일제강점기 베를린 올림픽 마라톤에서 우승하며 민족의 기상을 세계에 알렸다.',
    details:
      '1936년 베를린 올림픽 마라톤에서 당시 세계 신기록으로 우승한 뒤 시상대에서 월계수 묘목으로 가슴의 일장기를 가렸다. 광복 후에는 대한육상경기연맹을 이끌며 후배 마라토너 양성에 평생을 바쳤다.',
    tags: ['베를린올림픽', '마라톤', '스포츠영웅'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-woojangchoon',
    name: '우장춘',
    alias: '세계적 육종학자',
    era: '현대/기타',
    category: '과학/기술',
    summary: '종의 합성 이론을 발표하고 배추와 채소 품종 개량으로 식량 자급을 도왔다.',
    details:
      '유전학계에 우의 삼각형으로 알려진 종의 합성 이론을 정립한 뒤 1950년 한국으로 귀국해 한국농업과학연구소를 설립했다. 6·25 전쟁 직후 배추·무·감자·제주 감귤 품종을 개량해 국민의 먹거리 자급 기반을 다졌다.',
    tags: ['육종학', '우의삼각형', '식량자급'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-leetaeyoung',
    name: '이태영',
    alias: '대한민국 최초의 여성 변호사',
    era: '현대/기타',
    category: '정치/외교',
    summary: '한국가정법률상담소를 설립하고 가족법 개정과 여성 인권 신장에 평생을 바쳤다.',
    details:
      '1952년 한국 최초의 여성 사법시험 합격자가 된 뒤 법관 임용 거부를 딛고 변호사로서 무료 법률 구조 활동을 시작했다. 한국가정법률상담소를 세워 수십 년간 가족법 개정과 양성평등 제도화에 앞장섰다.',
    tags: ['여성변호사', '가족법개정', '인권운동'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-chungjuyung',
    name: '정주영',
    alias: '한국 산업화의 개척자 아산',
    era: '현대/기타',
    category: '경제/산업',
    summary: '조선소와 경부고속도로 건설을 이끌며 대한민국 중공업과 경제 성장의 토대를 세웠다.',
    details:
      '전후 복구 사업과 경부고속도로·중동 건설 진출을 통해 한국 건설업의 위상을 높였고, 백사장 사진 한 장으로 차관을 유치해 세계적 조선소와 자동차 산업을 일으켰다. 아산사회복지재단을 설립해 공익 활동도 펼쳤다.',
    tags: ['산업화', '조선업', '기업가정신'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-leebyungchul',
    name: '이병철',
    alias: '호암, 대한민국 산업의 선구자',
    era: '현대/기타',
    category: '경제/산업',
    summary: '인재 제일의 경영 철학으로 반도체 등 첨단 산업 진출의 발판을 마련했다.',
    details:
      '제조업과 무역, 전자 산업을 차례로 육성하며 대한민국 산업 구조의 고도화를 이끌었다. 특히 1980년대 과감한 반도체 투자 결단과 공개 채용 제도 정착으로 한국이 IT·첨단 기술 강국으로 성장하는 기반을 다졌다.',
    tags: ['반도체', '인재제일', '첨단산업'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-namjunepaik',
    name: '백남준',
    alias: '비디오 아트의 아버지',
    era: '현대/기타',
    category: '문화/예술',
    summary: '텔레비전과 첨단 기술을 예술로 승화해 비디오 아트 장르를 열었다.',
    details:
      '전자 공학과 아방가르드 음악을 결합해 텔레비전을 예술 매체로 탈바꿈시켰으며, 전 세계를 위성으로 연결한 굿모닝 미스터 오웰과 다다익선 등을 통해 현대 미디어 아트의 지평을 열었다.',
    tags: ['비디오아트', '미디어예술', '다다익선'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-parkkyungni',
    name: '박경리',
    alias: '대하소설 토지의 작가',
    era: '현대/기타',
    category: '문화/예술',
    summary: '이십육 년간 대하소설 토지를 집필해 한국 근현대사의 한과 생명력을 그려냈다.',
    details:
      '1969년부터 1994년까지 26년에 걸쳐 5부 16권의 대하소설 토지를 완간하며 동학농민운동부터 해방까지 우리 민족의 역사를 장대한 서사로 담아냈다. 말년에는 토지문화관을 세워 생명 사상과 문학 발전에 힘썼다.',
    tags: ['토지', '대하소설', '한국문학'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
  {
    id: 'preset-janggiryeo',
    name: '장기려',
    alias: '한국의 슈바이처, 청십자 의사',
    era: '현대/기타',
    category: '과학/기술',
    summary: '평생 가난한 환자를 무료로 치료하며 국내 최초의 민간의료보험을 실천했다.',
    details:
      '국내 최초로 간 대량 절제술에 성공한 외과 의학자이자, 부산 복음병원을 세워 평생 가난한 이들을 무료로 진료했다. 1968년 청십자의료보험조합을 창설해 오늘날 국민건강보험 제도의 선구적 모델을 제시했다.',
    tags: ['청십자의료보험', '복음병원', '의료봉사'],
    isPreset: true,
    createdAt: SEED_DATE,
  },
];

export function generatePersonId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `person-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function isValidEra(value: unknown): value is Era {
  return typeof value === 'string' && (ERAS as string[]).includes(value);
}

export function isValidCategory(value: unknown): value is Category {
  return typeof value === 'string' && (CATEGORIES as string[]).includes(value);
}

export function normalizePersonRecord(raw: unknown): Person | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const name = typeof obj.name === 'string' ? obj.name.trim() : '';
  const summary = typeof obj.summary === 'string' ? obj.summary.trim() : '';

  if (!name || !summary) return null;

  const alias = typeof obj.alias === 'string' ? obj.alias.trim() : '';
  const era: Era = isValidEra(obj.era) ? obj.era : '현대/기타';
  const category: Category = isValidCategory(obj.category)
    ? obj.category
    : '문화/예술';
  const details = typeof obj.details === 'string' ? obj.details.trim() : '';

  const tags: string[] = Array.isArray(obj.tags)
    ? Array.from(
        new Set(
          obj.tags
            .filter((t): t is string => typeof t === 'string')
            .map((t) => t.trim().replace(/^#/, ''))
            .filter(Boolean)
        )
      )
    : [];

  return {
    id:
      typeof obj.id === 'string' && obj.id.trim().length > 0
        ? obj.id.trim()
        : generatePersonId(),
    name,
    alias,
    era,
    category,
    summary,
    details,
    tags,
    isPreset: typeof obj.isPreset === 'boolean' ? obj.isPreset : false,
    createdAt:
      typeof obj.createdAt === 'string' && obj.createdAt.trim().length > 0
        ? obj.createdAt
        : new Date().toISOString(),
  };
}

export function loadPeoplePool(): Person[] {
  try {
    const raw = window.localStorage.getItem(PEOPLE_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        PEOPLE_STORAGE_KEY,
        JSON.stringify(PRESET_PEOPLE)
      );
      window.localStorage.setItem(
        SEED_VERSION_KEY,
        String(CURRENT_SEED_VERSION)
      );
      return [...PRESET_PEOPLE];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [...PRESET_PEOPLE];
    }

    const storedPeople = parsed
      .map((item) => normalizePersonRecord(item))
      .filter((item): item is Person => item !== null);

    // One-time non-destructive sync when preset archive grows to a newer version:
    // preserves all custom additions and existing edits, and appends newly added presets.
    const storedVersion = Number(
      window.localStorage.getItem(SEED_VERSION_KEY) ?? '1'
    );
    if (storedVersion < CURRENT_SEED_VERSION) {
      const existingIds = new Set(storedPeople.map((p) => p.id));
      const existingNames = new Set(
        storedPeople.map((p) => p.name.trim().toLowerCase())
      );

      const newPresets = PRESET_PEOPLE.filter(
        (preset) =>
          !existingIds.has(preset.id) &&
          !existingNames.has(preset.name.trim().toLowerCase())
      );

      const customOnly = storedPeople.filter((p) => !p.isPreset);
      const existingPresets = storedPeople.filter((p) => p.isPreset);
      const presetOrder = new Map(PRESET_PEOPLE.map((p, idx) => [p.id, idx]));

      const mergedPresets = [...existingPresets, ...newPresets].sort((a, b) => {
        const orderA = presetOrder.get(a.id) ?? 9999;
        const orderB = presetOrder.get(b.id) ?? 9999;
        return orderA - orderB;
      });

      const migrated = [...customOnly, ...mergedPresets];
      window.localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(migrated));
      window.localStorage.setItem(
        SEED_VERSION_KEY,
        String(CURRENT_SEED_VERSION)
      );
      return migrated;
    }

    return storedPeople;
  } catch {
    return [...PRESET_PEOPLE];
  }
}

export function savePeoplePool(people: Person[]): void {
  try {
    window.localStorage.setItem(PEOPLE_STORAGE_KEY, JSON.stringify(people));
    window.localStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
  } catch {
    // Gracefully handle quota or private mode errors
  }
}

export function parseImportedPeopleJson(jsonText: string): {
  validPeople: Person[];
  skippedCount: number;
  error: string | null;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      validPeople: [],
      skippedCount: 0,
      error: '올바른 JSON 문법이 아닙니다. 파일 형식을 확인해 주세요.',
    };
  }

  const candidateList: unknown = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === 'object' &&
        Array.isArray((parsed as Record<string, unknown>).people)
      ? (parsed as Record<string, unknown>).people
      : null;

  if (!Array.isArray(candidateList)) {
    return {
      validPeople: [],
      skippedCount: 0,
      error:
        'JSON 최상위 구조가 인물 배열([ ... ])이 아닙니다. 내보낸 형식과 동일한 JSON을 선택해 주세요.',
    };
  }

  if (candidateList.length === 0) {
    return {
      validPeople: [],
      skippedCount: 0,
      error: '가져올 인물 데이터가 비어 있습니다.',
    };
  }

  const validPeople: Person[] = [];
  let skippedCount = 0;

  for (const item of candidateList) {
    const normalized = normalizePersonRecord(item);
    if (normalized) {
      validPeople.push(normalized);
    } else {
      skippedCount += 1;
    }
  }

  if (validPeople.length === 0) {
    return {
      validPeople: [],
      skippedCount,
      error:
        '유효한 인물 항목이 없습니다. 각 항목에 name(이름)과 summary(한 줄 요약)가 포함되어야 합니다.',
    };
  }

  return { validPeople, skippedCount, error: null };
}

export function exportPeopleToJson(people: Person[]): void {
  const payload = JSON.stringify(people, null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `korean-figures-pool-${today}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function shufflePeople(list: Person[]): Person[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function filterPeopleForPractice(
  pool: Person[],
  eraFilter: EraFilter,
  categoryFilter: CategoryFilter,
  sourceFilter: SourceFilter
): Person[] {
  return pool.filter((person) => {
    if (eraFilter !== '전체' && person.era !== eraFilter) return false;
    if (categoryFilter !== '전체' && person.category !== categoryFilter) {
      return false;
    }
    if (sourceFilter === 'preset' && !person.isPreset) return false;
    if (sourceFilter === 'custom' && person.isPreset) return false;
    return true;
  });
}

export function buildQuestionSet(
  pool: Person[],
  eraFilter: EraFilter,
  categoryFilter: CategoryFilter,
  sourceFilter: SourceFilter,
  count: number
): Person[] {
  const filtered = filterPeopleForPractice(
    pool,
    eraFilter,
    categoryFilter,
    sourceFilter
  );
  const shuffled = shufflePeople(filtered);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
