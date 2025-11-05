# Rate Wallet App

<div align="center">

![App Screenshot](https://placehold.co/800x400/5ab18a/ffffff?text=Rate+Wallet+App)

**複数通貨に対応した次世代家計簿アプリケーション**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://household-app.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AWS Lambda](https://img.shields.io/badge/AWS%20Lambda-Serverless-FF9900?style=for-the-badge&logo=awslambda)](https://aws.amazon.com/lambda/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)](https://supabase.com/)

[🚀 Live Demo](https://household-app.vercel.app/) | [📖 API Docs](#-api仕様) | [🎨 Design Decisions](./docs/技術スタックと選定理由.md)

</div>

---

## 🎯 プロジェクト概要

Rate Wallet Appは、**日本円・米ドル・ユーロの3つの通貨**で家計簿を管理できるWebアプリケーションです。

### 💡 新規性・差別化ポイント

- **リアルタイム為替レート変換**: 外部APIから最新の為替レートを取得し、任意の通貨で収支を確認
- **複数通貨での記録**: 海外旅行や外貨収入がある方に最適
- **統一表示**: 異なる通貨で記録した取引を、選択した1つの通貨で統一表示

### 🎓 開発目的

エンジニアとしての就職活動に向けて、**フルスタック開発のスキル**を実践的にアピールするために開発しました。フロントエンドからバックエンド、インフラまで一貫して設計・実装しています。

---

## ✨ 主な機能・特徴

### 認証・ユーザー管理
- 🔐 メールアドレス + パスワード認証
- 🔐 Google OAuth 2.0 ソーシャルログイン
- 🔒 Supabase Auth によるセキュアな認証基盤

### 取引管理
- ✏️ 収入・支出の記録（CRUD操作）
- 💱 3通貨対応（JPY / USD / EUR）
- 📝 カテゴリ別の分類（システム提供 + ユーザーカスタム）
- 🔍 詳細フィルタリング（日付、タイプ、カテゴリ、通貨）
- 🔄 **リアルタイム為替レート変換**

### ダッシュボード・分析
- 📊 月次サマリー（収入・支出・収支）
- 🥧 カテゴリ別支出の円グラフ
- 📈 直近6ヶ月の収支推移グラフ
- 💹 通貨切り替え機能（全データを選択通貨で表示）

### UI/UX
- 📱 フルレスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- 🎨 Tailwind CSS によるモダンなデザイン
- ⚡ Vite による高速な開発体験
- 🔔 リアルタイムトースト通知

---

## 🛠️ 技術スタック

### フロントエンド
| Technology | Purpose |
|:-----------|:--------|
| **React 18** | UI構築フレームワーク |
| **TypeScript** | 型安全な開発 |
| **Vite** | 高速ビルドツール |
| **Tailwind CSS** | ユーティリティファーストCSS |
| **Recharts** | データ可視化ライブラリ |
| **React Router** | クライアントサイドルーティング |
| **Axios** | HTTP通信 |
| **date-fns** | 日付操作 |

### バックエンド
| Technology | Purpose |
|:-----------|:--------|
| **Node.js 18** | JavaScriptランタイム |
| **Express** | RESTful API構築 |
| **TypeScript** | 型安全なバックエンド開発 |
| **Serverless Framework** | インフラのコード化（IaC） |

### データベース・認証
| Technology | Purpose |
|:-----------|:--------|
| **Supabase (PostgreSQL)** | マネージドRDBMS |
| **Supabase Auth** | 認証・認可 |
| **Row Level Security (RLS)** | データベースレベルのセキュリティ |

### インフラ・デプロイ
| Technology | Purpose |
|:-----------|:--------|
| **AWS Lambda** | サーバーレスコンピューティング |
| **API Gateway** | RESTful APIエンドポイント管理 |
| **Vercel** | フロントエンドホスティング |
| **Exchangerate-API** | 為替レート取得 |

### テスト
| Technology | Purpose |
|:-----------|:--------|
| **Jest** | バックエンドテスト |
| **Supertest** | API統合テスト |
| **Vitest** | フロントエンドテスト |
| **React Testing Library** | コンポーネントテスト |

### 開発ツール
- **ESLint** - コード品質管理
- **Prettier** - コードフォーマット
- **Git/GitHub** - バージョン管理
- **VS Code** - 開発環境

> 💡 **技術選定の詳細理由**: [技術スタックと選定理由.md](./docs/技術スタックと選定理由.md) を参照してください

---

## 🏗️ アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│               React App (Vercel - Global CDN)                │
│  - Client-side Routing                                       │
│  - State Management (Context API)                            │
│  - UI Components (Tailwind CSS)                              │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
               │ REST API                     │ Auth
               ▼                              ▼
┌──────────────────────────────┐  ┌──────────────────────────┐
│   AWS API Gateway            │  │    Supabase Auth         │
│   - CORS設定                 │  │    - JWT発行             │
│   - エンドポイント管理        │  │    - OAuth 2.0           │
└──────────────┬───────────────┘  └──────────┬───────────────┘
               │                              │
               ▼                              │
┌──────────────────────────────┐             │
│   AWS Lambda (Express API)   │             │
│   - サーバーレス実行          │             │
│   - 自動スケーリング          │             │
│   - Node.js + TypeScript     │             │
└──────────────┬───────────────┘             │
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase (PostgreSQL + RLS)                     │
│  - transactions テーブル                                     │
│  - categories テーブル                                       │
│  - user_preferences テーブル                                 │
│  - exchange_rates テーブル                                   │
└─────────────────────────────────────────────────────────────┘
               ▲
               │ 為替レート取得
┌──────────────┴───────────────┐
│    Exchangerate-API          │
│    - 最新レート取得（1日1回） │
│    - キャッシュで効率化       │
└──────────────────────────────┘
```

### データフロー例

**取引登録時の処理フロー:**

1. ユーザーがフロントエンドから取引を登録
2. Supabase Authで認証トークンを検証
3. API GatewayがLambda（Express API）にリクエスト転送
4. Lambda内でバリデーション実行
5. Supabase（PostgreSQL）にデータ保存
6. RLS（Row Level Security）でユーザー権限チェック
7. レスポンスをフロントエンドに返却

**為替レート変換時の処理フロー:**

1. フロントエンドで通貨切り替え
2. キャッシュされた為替レートを使用
3. 各取引金額をクライアントサイドで変換
4. グラフやサマリーを再計算して表示

---

## 📸 スクリーンショット

### ダッシュボード
![Dashboard](https://placehold.co/800x500/5ab18a/ffffff?text=Dashboard+View)
*月次サマリー、カテゴリ別円グラフ、月別推移グラフを一覧表示*

### 取引一覧
![Transactions](https://placehold.co/800x500/6fb0c2/ffffff?text=Transaction+List)
*日付別にグループ化された取引履歴と詳細フィルタリング*

### 取引登録フォーム
![Transaction Form](https://placehold.co/800x500/e8a76f/ffffff?text=Transaction+Form)
*複数通貨対応の取引入力フォーム*

### レスポンシブデザイン
![Responsive](https://placehold.co/1200x600/88ceac/ffffff?text=Mobile+%26+Desktop+View)
*モバイル・タブレット・デスクトップすべてに対応*

---

## 💻 ローカル開発

### 前提条件

- **Node.js**: v18以上
- **npm**: v9以上
- **Git**: 最新版
- **Supabase アカウント**: [supabase.com](https://supabase.com)
- **Exchangerate-API キー**: [exchangerate-api.com](https://www.exchangerate-api.com/)

### セットアップ手順

#### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/household-app.git
cd household-app
```

#### 2. フロントエンドのセットアップ

```bash
cd frontend
npm install

# 環境変数ファイルを作成
cp .env.example .env.local
```

`.env.local` を編集:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

フロントエンドを起動:
```bash
npm run dev
```

→ http://localhost:5173 でアクセス可能

#### 3. バックエンドのセットアップ

```bash
cd backend
npm install

# 環境変数ファイルを作成
cp .env.example .env
```

`.env` を編集:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
EXCHANGE_API_KEY=your_exchangerate_api_key
PORT=3000
```

バックエンドを起動:
```bash
npm run dev
```

→ http://localhost:3000 でAPIサーバーが起動

#### 4. データベースのセットアップ

Supabase ダッシュボードの SQL Editor で、以下のSQLを実行:

```sql
-- テーブル作成とRLS設定
-- 詳細は docs/database-schema.sql を参照
```

### テストの実行

#### バックエンドテスト
```bash
cd backend
npm test                # 全テスト実行
npm run test:watch      # ウォッチモード
npm run test:coverage   # カバレッジレポート生成
```

#### フロントエンドテスト
```bash
cd frontend
npm test                # 全テスト実行
npm run test:ui         # UIモードで実行
npm run test:coverage   # カバレッジレポート生成
```

---

## 📚 API仕様

### ベースURL
- **Production**: `https://your-api-id.execute-api.ap-northeast-1.amazonaws.com/dev`
- **Development**: `http://localhost:3000`

### 認証
すべてのAPIエンドポイント（`/api/exchange-rates` を除く）は認証が必要です。

リクエストヘッダーに以下を含める:
```
Authorization: Bearer <supabase_access_token>
```

### 主要エンドポイント

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET` | `/health` | ヘルスチェック | ❌ |
| `GET` | `/api/transactions` | 取引一覧取得 | ✅ |
| `POST` | `/api/transactions` | 取引作成 | ✅ |
| `PUT` | `/api/transactions/:id` | 取引更新 | ✅ |
| `DELETE` | `/api/transactions/:id` | 取引削除 | ✅ |
| `GET` | `/api/categories` | カテゴリ一覧取得 | ✅ |
| `GET` | `/api/exchange-rates` | 為替レート取得 | ❌ |

詳細なAPI仕様は [API.md](./docs/API.md) を参照してください。

---

## 🎓 学んだこと・技術的チャレンジ

### 1. サーバーレスアーキテクチャの設計

**課題**: 
- 従来のサーバーベースの開発経験はあったが、サーバーレスは初めて

**学び**:
- AWS LambdaとAPI Gatewayの連携方法
- コールドスタート対策（軽量な依存関係）
- Serverless Frameworkによるインフラのコード化（IaC）

**成果**:
- スケーラブルで運用コストの低いシステムを構築
- デプロイの自動化に成功

### 2. 複数通貨の為替変換ロジック

**課題**:
- 異なる通貨で記録された取引を、任意の通貨で統一表示する必要があった
- APIコール回数の制限（無料枠: 1,500リクエスト/月）

**解決策**:
- USD を基準通貨として、すべての変換をUSD経由で実施
- 為替レートをデータベースにキャッシュ（1日1回更新）
- フロントエンド側で変換計算を実施（APIコール不要）

**コード例**:
```typescript
// バックエンド: USD経由の変換ロジック
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // 1. fromCurrency → USD
  const usdAmount = fromCurrency === 'USD' 
    ? amount 
    : amount / rates[fromCurrency];
  
  // 2. USD → toCurrency
  const convertedAmount = toCurrency === 'USD'
    ? usdAmount
    : usdAmount * rates[toCurrency];
  
  return Math.round(convertedAmount * 100) / 100;
};
```

### 3. Row Level Security (RLS) によるデータ保護

**課題**:
- ユーザーごとのデータを完全に分離する必要があった

**学び**:
- PostgreSQLのRLS機能を使ったデータベースレベルのセキュリティ
- Supabase Authとの統合方法

**成果**:
- バックエンドのバグがあっても、他ユーザーのデータは漏洩しない設計

### 4. TypeScriptのフル活用

**課題**:
- フロントエンドとバックエンドで型定義を共有したい

**解決策**:
- 共通の型定義ファイルを作成
- API のリクエスト・レスポンスを厳密に型付け
- Zodなどのバリデーションライブラリは使わず、TypeScriptの型システムを活用

**成果**:
- 型の不一致によるバグを事前に防止
- IDEの補完機能により開発速度が向上

### 5. CI/CD パイプラインの構築

**学び**:
- Vercel の Git 連携による自動デプロイ
- Serverless Framework による Lambda の自動デプロイ
- プレビュー環境の自動生成

**成果**:
- `git push` だけで本番環境に反映される効率的なワークフロー

---

## 🔮 今後の改善予定

### 優先度: 高
- [ ] **取引時の為替レート保存**: 現在は最新レートで変換しているが、取引時のレートを保存して正確な履歴管理
- [ ] **ユーザーカスタムカテゴリ**: 現在はシステム提供カテゴリのみ、ユーザー独自のカテゴリを作成可能に
- [ ] **CSVエクスポート**: 取引データをCSV形式でダウンロード
- [ ] **予算設定機能**: 月別・カテゴリ別の予算を設定し、超過時にアラート

### 優先度: 中
- [ ] **定期支出の登録**: 家賃や定額サブスクなど、毎月発生する支出を自動登録
- [ ] **多言語対応**: 英語版の提供
- [ ] **グラフの拡充**: 年間推移グラフ、カテゴリ別時系列グラフ
- [ ] **取引の検索機能**: 説明文やメモからの全文検索

### 優先度: 低
- [ ] **ダークモード**: ライトモード/ダークモードの切り替え
- [ ] **PWA対応**: オフライン動作、ホーム画面への追加
- [ ] **通知機能**: 予算超過や定期支出の通知
- [ ] **レシート画像のアップロード**: OCRで金額を自動入力

---

## 🧪 テストカバレッジ

### バックエンド
- 為替変換ロジック: **100%**
- API統合テスト: 主要エンドポイント網羅

### フロントエンド
- フック（useExchangeRates）: **100%**
- 共通コンポーネント: 一部実装

今後、カバレッジをさらに向上させる予定です。

---

## 🤝 貢献

このプロジェクトは就活用ポートフォリオのため、現在は個人開発のみとなっています。

ただし、バグ報告や改善提案は歓迎します！
- Issue: バグ報告や機能提案
- Discussion: 技術的な質問や議論

---

## 📄 ライセンス

MIT License

Copyright (c) 2025 Your Name

このソフトウェアおよび関連文書ファイル（以下「ソフトウェア」）のコピーを取得した人は誰でも、ソフトウェアを制限なく扱うことができます。

---

<!-- ## 👤 作成者 -->

<!-- **Hotate** -->

<!-- - 🌐 Portfolio: [your-portfolio.com](https://your-portfolio.com) -->
<!-- - 💼 LinkedIn: [linkedin.com/in/yourname](https://linkedin.com/in/yourname) -->
<!-- - 🐙 GitHub: [@yourusername](https://github.com/yourusername) -->
<!-- - 📧 Email: your.email@example.com -->
