# insurance-platform

보험 플랫폼 프론트 모노레포 (pnpm workspace).

```
insurance-platform/
├─ apps/
│  ├─ web/        # Next.js App Router
│  └─ mobile/     # RN 껍데기 (WebView 셸)
└─ packages/
   ├─ bridge/     # WebView↔네이티브 메시지 계약 (타입 + 헬퍼)
   ├─ shared/     # 공유 타입, API DTO, zod 스키마
   └─ config/     # eslint / tsconfig / prettier 프리셋
```

## 패키지

| 패키지          | 이름                | 설명                            |
| --------------- | ------------------- | ------------------------------- |
| apps/web        | `@insurance/web`    | Next.js App Router 웹           |
| apps/mobile     | `@insurance/mobile` | React Native WebView 셸         |
| packages/bridge | `@insurance/bridge` | 웹↔네이티브 메시지 계약·헬퍼    |
| packages/shared | `@insurance/shared` | 공유 타입·DTO·zod 스키마        |
| packages/config | `@insurance/config` | eslint/tsconfig/prettier 프리셋 |
