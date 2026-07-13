/** 지역 선택 값. sido는 정식 명칭, district=null이면 시·도 전체("서울 전체"). */
export interface RegionValue {
  sido: string;
  district: string | null;
}

export interface Sido {
  /** 정식 명칭. 드롭다운 목록 표기용. */
  name: string;
  /** 축약 명칭. 트리거 버튼·칩 표기용("서울 강남구"). */
  shortName: string;
  districts: readonly string[];
}

/** 전국 17개 시·도 + 228개 시·군·구. 세종은 하위 시·군·구 없음. */
export const SIDO_LIST: readonly Sido[] = [
  {
    name: "서울특별시",
    shortName: "서울",
    districts: [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구",
    ],
  },
  {
    name: "부산광역시",
    shortName: "부산",
    districts: [
      "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구",
      "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구",
    ],
  },
  {
    name: "대구광역시",
    shortName: "대구",
    districts: ["남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
  },
  {
    name: "인천광역시",
    shortName: "인천",
    districts: [
      "계양구", "미추홀구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군",
    ],
  },
  {
    name: "광주광역시",
    shortName: "광주",
    districts: ["광산구", "남구", "동구", "북구", "서구"],
  },
  {
    name: "대전광역시",
    shortName: "대전",
    districts: ["대덕구", "동구", "서구", "유성구", "중구"],
  },
  {
    name: "울산광역시",
    shortName: "울산",
    districts: ["남구", "동구", "북구", "중구", "울주군"],
  },
  {
    name: "세종특별자치시",
    shortName: "세종",
    districts: [],
  },
  {
    name: "경기도",
    shortName: "경기",
    districts: [
      "수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시",
      "화성시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시", "군포시",
      "광주시", "이천시", "양주시", "오산시", "구리시", "안성시", "포천시", "의왕시",
      "하남시", "여주시", "동두천시", "과천시", "가평군", "양평군", "연천군",
    ],
  },
  {
    name: "강원특별자치도",
    shortName: "강원",
    districts: [
      "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군",
      "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군",
    ],
  },
  {
    name: "충청북도",
    shortName: "충북",
    districts: [
      "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군",
      "괴산군", "음성군", "단양군",
    ],
  },
  {
    name: "충청남도",
    shortName: "충남",
    districts: [
      "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시",
      "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군",
    ],
  },
  {
    name: "전북특별자치도",
    shortName: "전북",
    districts: [
      "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군",
      "무주군", "장수군", "임실군", "순창군", "고창군", "부안군",
    ],
  },
  {
    name: "전라남도",
    shortName: "전남",
    districts: [
      "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군",
      "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군",
      "함평군", "영광군", "장성군", "완도군", "진도군", "신안군",
    ],
  },
  {
    name: "경상북도",
    shortName: "경북",
    districts: [
      "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시",
      "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군",
      "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군",
    ],
  },
  {
    name: "경상남도",
    shortName: "경남",
    districts: [
      "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시",
      "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군",
      "거창군", "합천군",
    ],
  },
  {
    name: "제주특별자치도",
    shortName: "제주",
    districts: ["제주시", "서귀포시"],
  },
];

const SIDO_BY_NAME = new Map(SIDO_LIST.map((sido) => [sido.name, sido]));

export function findSido(name: string): Sido | undefined {
  return SIDO_BY_NAME.get(name);
}

/** 트리거 버튼·칩 표기 라벨. "서울 강남구" / "서울 전체". */
export function formatRegionLabel({ sido, district }: RegionValue): string {
  const shortName = SIDO_BY_NAME.get(sido)?.shortName ?? sido;
  return district ? `${shortName} ${district}` : `${shortName} 전체`;
}

/** 여러 지역을 한 문자열로 저장할 때 쓰는 구분자("서울 강남구 · 경기 성남시"). */
const LIST_SEPARATOR = " · ";

const SIDO_BY_SHORT_NAME = new Map(SIDO_LIST.map((sido) => [sido.shortName, sido]));

/**
 * 저장된 라벨을 선택 값으로 되돌린다. "서울 강남구" · "서울 전체" · 시·도 단위 "서울" 모두 받는다.
 * 사전에 없는 시·군·구("서울 강남")는 시·도 전체로, 시·도조차 못 찾으면 null로 떨어뜨린다.
 */
export function parseRegionLabel(label: string): RegionValue | null {
  const [head = "", ...rest] = label.trim().split(/\s+/);
  const sido = SIDO_BY_SHORT_NAME.get(head) ?? SIDO_BY_NAME.get(head);
  if (!sido) return null;

  const district = rest.join(" ");
  if (!district || district === "전체" || !sido.districts.includes(district)) {
    return { sido: sido.name, district: null };
  }
  return { sido: sido.name, district };
}

export function formatRegionList(values: RegionValue[]): string {
  return values.map(formatRegionLabel).join(LIST_SEPARATOR);
}

export function parseRegionList(text: string): RegionValue[] {
  const parsed = text
    .split("·")
    .map(parseRegionLabel)
    .filter((value): value is RegionValue => value !== null);

  return parsed.filter(
    (value, index) => parsed.findIndex((other) => isSameRegion(other, value)) === index,
  );
}

/** 선택 비교·React key용 식별자. */
export function regionKey({ sido, district }: RegionValue): string {
  return `${sido}|${district ?? ""}`;
}

export function isSameRegion(a: RegionValue, b: RegionValue): boolean {
  return a.sido === b.sido && a.district === b.district;
}

/** 시·도명(정식·축약)과 시·군·구명을 함께 훑는 통합 검색. 시·도가 맞으면 그 시·도 전체를 결과에 넣는다. */
export function searchRegions(keyword: string): RegionValue[] {
  const query = keyword.trim();
  if (!query) return [];

  const matches: RegionValue[] = [];
  for (const sido of SIDO_LIST) {
    if (sido.name.includes(query) || sido.shortName.includes(query)) {
      matches.push({ sido: sido.name, district: null });
    }
    for (const district of sido.districts) {
      if (district.includes(query)) matches.push({ sido: sido.name, district });
    }
  }
  return matches;
}
