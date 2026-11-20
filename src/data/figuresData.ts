import type { Era, EraFilter, Figure } from '../types/game';

export const ERAS: Era[] = ['삼국시대', '고려', '조선', '근현대'];

export const ERA_FILTERS: EraFilter[] = ['전체', '삼국시대', '고려', '조선', '근현대'];

export const ERA_DESCRIPTIONS: Record<Era, string> = {
  삼국시대: '고구려·백제·신라가 기틀을 다지고 문화를 꽃피운 시대',
  고려: '후삼국을 통일하고 자주 외교와 과학 기술을 발전시킨 시대',
  조선: '훈민정음 창제와 실학, 충절의 정신이 빛난 시대',
  근현대: '조국의 독립과 자유, 인권의 가치를 지켜낸 시대',
};

export const figuresData: Figure[] = [
  {
    id: 1,
    name: '광개토대왕',
    era: '삼국시대',
    years: '374–412',
    hint: '고구려 제19대 국왕',
    achievement: '고구려의 영토를 만주와 한반도 북부까지 크게 넓혔다.',
  },
  {
    id: 2,
    name: '을지문덕',
    era: '삼국시대',
    years: '6세기 후반–7세기 전반',
    hint: '고구려의 명장',
    achievement: '살수대첩에서 수나라의 대군을 물리치고 나라를 지켰다.',
  },
  {
    id: 3,
    name: '김유신',
    era: '삼국시대',
    years: '595–673',
    hint: '신라의 장군이자 재상',
    achievement: '화랑도를 이끌며 신라의 삼국 통일에 큰 공을 세웠다.',
  },
  {
    id: 4,
    name: '원효',
    era: '삼국시대',
    years: '617–686',
    hint: '신라의 승려이자 사상가',
    achievement: '일심과 화쟁 사상으로 불교를 백성들에게 널리 알렸다.',
  },
  {
    id: 5,
    name: '장보고',
    era: '삼국시대',
    years: '?–846',
    hint: '통일신라의 해상 무역왕',
    achievement: '완도에 청해진을 세워 해적을 소탕하고 해상 무역을 주도했다.',
  },
  {
    id: 6,
    name: '왕건',
    era: '고려',
    years: '877–943',
    hint: '고려의 건국 시조 태조',
    achievement: '후삼국을 통일하고 민족의 재통합을 이룬 고려를 세웠다.',
  },
  {
    id: 7,
    name: '서희',
    era: '고려',
    years: '942–998',
    hint: '고려 전기의 문신이자 외교관',
    achievement: '거란 장수 소손녕과의 외교 담판으로 강동 육주를 얻었다.',
  },
  {
    id: 8,
    name: '강감찬',
    era: '고려',
    years: '948–1031',
    hint: '고려의 명장',
    achievement: '귀주대첩에서 거란의 침략군을 크게 무찌르고 승리했다.',
  },
  {
    id: 9,
    name: '최무선',
    era: '고려',
    years: '1325–1395',
    hint: '고려 말의 과학자이자 무신',
    achievement: '화약 제조법을 독자적으로 개발해 왜구를 격퇴하는 데 힘썼다.',
  },
  {
    id: 10,
    name: '정몽주',
    era: '고려',
    years: '1337–1392',
    hint: '고려 말의 충신이자 성리학자',
    achievement: '성리학을 보급하고 고려 왕조에 대한 굳은 절개를 지켰다.',
  },
  {
    id: 11,
    name: '세종대왕',
    era: '조선',
    years: '1397–1450',
    hint: '조선 제4대 국왕',
    achievement: '백성이 쉽게 글을 익히도록 훈민정음을 창제하고 반포하였다.',
  },
  {
    id: 12,
    name: '장영실',
    era: '조선',
    years: '1390년대–1450년대',
    hint: '조선 전기의 과학자',
    achievement: '자격루와 앙부일구 등 정밀한 천문 관측 기구를 발명하였다.',
  },
  {
    id: 13,
    name: '이순신',
    era: '조선',
    years: '1545–1598',
    hint: '조선 중기의 무신, 충무공',
    achievement: '임진왜란 당시 거북선과 뛰어난 전략으로 바다를 지켜냈다.',
  },
  {
    id: 14,
    name: '신사임당',
    era: '조선',
    years: '1504–1551',
    hint: '조선 중기의 화가이자 문인',
    achievement: '섬세한 초충도 등 뛰어난 예술 작품을 남기고 율곡을 길렀다.',
  },
  {
    id: 15,
    name: '정약용',
    era: '조선',
    years: '1762–1836',
    hint: '조선 후기의 실학자, 다산',
    achievement: '목민심서를 저술하고 거중기를 설계해 수원 화성 축조를 도왔다.',
  },
  {
    id: 16,
    name: '안중근',
    era: '근현대',
    years: '1879–1910',
    hint: '대한제국의 독립운동가',
    achievement: '하얼빈 역에서 이토 히로부미를 저격하고 동양 평화를 외쳤다.',
  },
  {
    id: 17,
    name: '유관순',
    era: '근현대',
    years: '1902–1920',
    hint: '일제강점기의 독립운동가',
    achievement: '아우내 장터에서 대한 독립 만세 운동을 이끌며 끝까지 항거했다.',
  },
  {
    id: 18,
    name: '김구',
    era: '근현대',
    years: '1876–1949',
    hint: '대한민국 임시정부의 주석',
    achievement: '대한민국 임시정부를 이끌며 조국의 완전한 독립과 문화를 염원했다.',
  },
  {
    id: 19,
    name: '윤동주',
    era: '근현대',
    years: '1917–1945',
    hint: '일제강점기의 민족 시인',
    achievement: '서시와 별 헤는 밤을 통해 어두운 시대의 양심과 순수를 노래했다.',
  },
  {
    id: 20,
    name: '방정환',
    era: '근현대',
    years: '1899–1931',
    hint: '근대의 아동문학가이자 교육가',
    achievement: '어린이날을 제정하고 잡지 어린이를 창간해 아동 인권을 높였다.',
  },
];

export function shuffleFigures(list: Figure[]): Figure[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildQuestionSet(eraFilter: EraFilter, count: number): Figure[] {
  const pool =
    eraFilter === '전체'
      ? figuresData
      : figuresData.filter((figure) => figure.era === eraFilter);
  const shuffled = shuffleFigures(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
