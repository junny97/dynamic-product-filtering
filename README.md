# Product Filter App - 개발 과제

## 📋 프로젝트 개요

DummyJSON API를 활용한 상품 필터링 및 검색 기능을 구현해주세요.

### 📌 구현 시 참고 자료

- **데모 URL**: [https://product-filter-app-rho.vercel.app/](https://product-filter-app-rho.vercel.app/)
- **DummyJSON 공식 문서**: [https://dummyjson.com/docs](https://dummyjson.com/docs)
- **DummyJSON Products API 가이드**: [https://dummyjson.com/docs/products](https://dummyjson.com/docs/products)

---

## 🎯 구현 기능

#### 1. 상품 목록 표시

- 초기 페이지 로드 시 상품 그리드 형태로 표시
- 각 상품 카드에는 이미지, 제목, 설명, 가격, 평점, 재고 정보 포함
- **API**: `https://dummyjson.com/products?limit=12&skip=0`

#### 2. 검색 기능

- 검색 입력창에서 키워드 입력 시 관련 상품만 필터링
- 디바운스(300ms) 적용하여 성능 최적화
- **API**: `https://dummyjson.com/products/search?q={검색어}&limit=12&skip=0`

#### 3. 카테고리 필터링

- 카테고리 체크박스 목록 표시
- 여러 카테고리 동시 선택 가능
- 선택한 카테고리에 해당되는 상품들 렌더링
- **API**:
  - 카테고리 목록: `https://dummyjson.com/products/categories`
  - 카테고리 상품 요청: `https://dummyjson.com/products/category/{카테고리명}?limit=12&skip=0`

#### 6. 정렬 기능

- 드롭다운 메뉴로 정렬 옵션 제공
- **✅ API 완전 지원** - 서버 사이드 정렬로 성능 최적화
- **지원 필드**: `title` (제품명), `price` (가격), `rating` (평점), `stock` (재고)
- **정렬 순서**: `asc` (오름차순), `desc` (내림차순)
- **API**: `https://dummyjson.com/products?sortBy={필드}&order={asc|desc}&limit=12&skip=0`

**정렬 옵션 예시:**

- 가격 낮은순: `?sortBy=price&order=asc`
- 가격 높은순: `?sortBy=price&order=desc`
- 평점 높은순: `?sortBy=rating&order=desc`
- 평점 낮은순: `?sortBy=rating&order=asc`
- 재고 많은순: `?sortBy=stock&order=desc`
- 제품명 A-Z: `?sortBy=title&order=asc`

#### 7. 무한 스크롤

- 페이지 하단 도달 시 다음 상품 자동 로드
- 로딩 스켈레톤 UI 표시
- **API**: `https://dummyjson.com/products?limit=12&skip={현재까지_로드된_개수}`

#### 8. 필터링 상태 관리

- 여러 필터 상태를 URL 쿼리 파라미터에 반영

---

## 🌐 전체 API 명세서

### 📦 상품 관련 API

| 기능            | HTTP Method | URL                                                                                 | 설명                                              |
| --------------- | ----------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| 전체 상품       | GET         | `https://dummyjson.com/products?limit={개수}&skip={건너뛸개수}`                     | 모든 상품 조회                                    |
| 카테고리별 상품 | GET         | `https://dummyjson.com/products/category/{카테고리}?limit={개수}&skip={건너뛸개수}` | 특정 카테고리 상품                                |
| 상품 검색       | GET         | `https://dummyjson.com/products/search?q={검색어}&limit={개수}&skip={건너뛸개수}`   | 키워드로 상품 검색                                |
| 상품 정렬       | GET         | `https://dummyjson.com/products?sortBy={필드}&order={asc\|desc}`                    | 상품 정렬 (title, price, rating, stock 필드 지원) |
| 카테고리 목록   | GET         | `https://dummyjson.com/products/categories`                                         | 모든 카테고리 조회                                |

### 🎯 정렬 필드 파라미터

| 필드     | 설명   | 오름차순 예시              | 내림차순 예시               | 설명                      |
| -------- | ------ | -------------------------- | --------------------------- | ------------------------- |
| `title`  | 제품명 | `?sortBy=title&order=asc`  | `?sortBy=title&order=desc`  | A-Z 순 / Z-A 순           |
| `price`  | 가격   | `?sortBy=price&order=asc`  | `?sortBy=price&order=desc`  | 낮은 가격순 / 높은 가격순 |
| `rating` | 평점   | `?sortBy=rating&order=asc` | `?sortBy=rating&order=desc` | 낮은 평점순 / 높은 평점순 |
| `stock`  | 재고   | `?sortBy=stock&order=asc`  | `?sortBy=stock&order=desc`  | 적은 재고순 / 많은 재고순 |

### 📋 API 응답 구조

#### 상품 목록 응답

```json
{
  "products": [
    {
      "id": 1,
      "title": "iPhone 9",
      "description": "An apple mobile...",
      "price": 549,
      "rating": 4.69,
      "stock": 94,
      "category": "smartphones",
      "thumbnail": "https://...",
      "images": ["https://..."]
    }
  ],
  "total": 100,
  "skip": 0,
  "limit": 12
}
```

#### 카테고리 목록 응답

```json
[
  {
    "slug": "beauty",
    "name": "Beauty",
    "url": "https://dummyjson.com/products/category/beauty"
  }
]
```

---
