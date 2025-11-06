# Multi-Currency Household App - API仕様書

<div align="center">

**Version 1.0.0** | **Last Updated: 2025-11-05**

RESTful API for Multi-Currency Household Application

</div>

---

## 📋 目次

- [概要](#-概要)
- [認証](#-認証)
- [ベースURL](#-ベースurl)
- [共通仕様](#-共通仕様)
- [エンドポイント一覧](#-エンドポイント一覧)
- [詳細仕様](#-詳細仕様)
  - [ヘルスチェック](#1-ヘルスチェック)
  - [取引管理](#2-取引管理)
  - [カテゴリ管理](#3-カテゴリ管理)
  - [為替レート](#4-為替レート)
- [エラーレスポンス](#-エラーレスポンス)
- [レート制限](#-レート制限)
- [変更履歴](#-変更履歴)

---

## 📖 概要

Multi-Currency Household App APIは、複数通貨対応の家計簿アプリケーション向けのRESTful APIです。

### 主な機能

- 🔐 Supabase Auth によるJWT認証
- 💱 3通貨対応（JPY / USD / EUR）
- 📊 取引のCRUD操作
- 🏷️ カテゴリ管理
- 💹 リアルタイム為替レート取得

### 技術スタック

- **Runtime**: Node.js 18 / AWS Lambda
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth (JWT)
- **Deployment**: AWS API Gateway + Lambda (Serverless)

---

## 🔐 認証

### 認証方式

このAPIは **Bearer Token認証** を使用します。
すべてのエンドポイント（`/health` および `/api/exchange-rates` を除く）は認証が必要です。

### 認証トークンの取得

Supabase Authを通じてサインイン後、`access_token` を取得してください。

**フロントエンドでの実装例:**
```typescript
import { supabase } from './lib/supabase';

// サインイン
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

const accessToken = data.session?.access_token;
```

### リクエストヘッダー

認証が必要なエンドポイントには、以下のヘッダーを含めてください:

```http
Authorization: Bearer <access_token>
```

### 認証エラー

認証に失敗した場合、以下のレスポンスが返されます:

```json
{
  "error": "Unauthorized"
}
```

**ステータスコード**: `401 Unauthorized`

---

## 🌐 ベースURL

### Production（本番環境）
```
https://<api-id>.execute-api.ap-northeast-1.amazonaws.com/dev
```

### Development（ローカル開発）
```
http://localhost:3000
```

---

## 📐 共通仕様

### リクエスト形式

- **Content-Type**: `application/json`
- **文字エンコーディング**: UTF-8
- **日付形式**: ISO 8601 (`YYYY-MM-DD`)
- **タイムスタンプ形式**: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

### レスポンス形式

すべてのレスポンスは JSON 形式で返されます。

```json
{
  "data": { ... }
}
```

エラー時:
```json
{
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

| Status Code | Description |
|:------------|:------------|
| `200 OK` | リクエスト成功 |
| `201 Created` | リソース作成成功 |
| `204 No Content` | 削除成功（レスポンスボディなし） |
| `400 Bad Request` | バリデーションエラー |
| `401 Unauthorized` | 認証エラー |
| `403 Forbidden` | 権限エラー |
| `404 Not Found` | リソースが見つからない |
| `500 Internal Server Error` | サーバーエラー |

---

## 📑 エンドポイント一覧

| Method | Endpoint | Description | Auth Required |
|:-------|:---------|:------------|:--------------|
| `GET` | `/health` | ヘルスチェック | ❌ |
| `GET` | `/api/transactions` | 取引一覧取得 | ✅ |
| `POST` | `/api/transactions` | 取引作成 | ✅ |
| `PUT` | `/api/transactions/:id` | 取引更新 | ✅ |
| `DELETE` | `/api/transactions/:id` | 取引削除 | ✅ |
| `GET` | `/api/categories` | カテゴリ一覧取得 | ✅ |
| `GET` | `/api/exchange-rates` | 為替レート取得 | ❌ |

---

## 📘 詳細仕様

### 1. ヘルスチェック

APIサーバーの稼働状況を確認します。

#### リクエスト

```http
GET /health
```

**認証**: 不要

#### レスポンス

**Status**: `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2025-11-05T12:34:56.789Z"
}
```

#### cURL例

```bash
curl -X GET https://your-api-url.com/health
```

---

### 2. 取引管理

#### 2.1. 取引一覧取得

ユーザーの取引一覧を取得します。クエリパラメータでフィルタリングが可能です。

##### リクエスト

```http
GET /api/transactions
```

**認証**: 必須

##### クエリパラメータ

| Parameter | Type | Required | Description | Example |
|:----------|:-----|:---------|:------------|:--------|
| `startDate` | string | ❌ | 開始日（YYYY-MM-DD） | `2025-01-01` |
| `endDate` | string | ❌ | 終了日（YYYY-MM-DD） | `2025-01-31` |
| `type` | string | ❌ | 取引タイプ | `income` / `expense` |
| `category` | string | ❌ | カテゴリID（UUID） | `550e8400-e29b-41d4-a716-446655440000` |
| `currency` | string | ❌ | 通貨コード | `JPY` / `USD` / `EUR` |

##### レスポンス

**Status**: `200 OK`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "type": "expense",
    "amount": 1500,
    "currency": "JPY",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "categories": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "食費",
      "type": "expense",
      "icon": "🍽️",
      "color": "#e8a76f"
    },
    "description": "スーパーで買い物",
    "date": "2025-11-05",
    "exchange_rate_usd": null,
    "created_at": "2025-11-05T10:30:00.000Z",
    "updated_at": "2025-11-05T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "user_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "type": "income",
    "amount": 300000,
    "currency": "JPY",
    "category_id": "234e4567-e89b-12d3-a456-426614174001",
    "categories": {
      "id": "234e4567-e89b-12d3-a456-426614174001",
      "name": "給与",
      "type": "income",
      "icon": "💰",
      "color": "#5ab18a"
    },
    "description": "11月分給与",
    "date": "2025-11-01",
    "exchange_rate_usd": null,
    "created_at": "2025-11-01T09:00:00.000Z",
    "updated_at": "2025-11-01T09:00:00.000Z"
  }
]
```

##### cURL例

```bash
# 基本的な取得
curl -X GET "https://your-api-url.com/api/transactions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# フィルタリング例
curl -X GET "https://your-api-url.com/api/transactions?startDate=2025-11-01&endDate=2025-11-30&type=expense&currency=JPY" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

#### 2.2. 取引作成

新しい取引を作成します。

##### リクエスト

```http
POST /api/transactions
```

**認証**: 必須

##### リクエストボディ

```json
{
  "type": "expense",
  "amount": 1500,
  "currency": "JPY",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "スーパーで買い物",
  "date": "2025-11-05"
}
```

##### フィールド説明

| Field | Type | Required | Validation | Description |
|:------|:-----|:---------|:-----------|:------------|
| `type` | string | ✅ | `income` \| `expense` | 取引タイプ |
| `amount` | number | ✅ | 正の数、最大999,999,999 | 金額 |
| `currency` | string | ✅ | `JPY` \| `USD` \| `EUR` | 通貨コード |
| `category_id` | string | ✅ | 有効なUUID | カテゴリID |
| `description` | string | ❌ | 最大100文字 | 説明 |
| `date` | string | ✅ | YYYY-MM-DD形式 | 取引日 |

##### バリデーションエラー例

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    },
    {
      "field": "currency",
      "message": "Currency must be one of: JPY, USD, EUR"
    }
  ]
}
```

##### レスポンス

**Status**: `201 Created`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "type": "expense",
  "amount": 1500,
  "currency": "JPY",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "スーパーで買い物",
  "date": "2025-11-05",
  "exchange_rate_usd": null,
  "created_at": "2025-11-05T10:30:00.000Z",
  "updated_at": "2025-11-05T10:30:00.000Z"
}
```

##### cURL例

```bash
curl -X POST "https://your-api-url.com/api/transactions" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 1500,
    "currency": "JPY",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "description": "スーパーで買い物",
    "date": "2025-11-05"
  }'
```

---

#### 2.3. 取引更新

既存の取引を更新します。

##### リクエスト

```http
PUT /api/transactions/:id
```

**認証**: 必須

##### パスパラメータ

| Parameter | Type | Required | Description |
|:----------|:-----|:---------|:------------|
| `id` | string | ✅ | 取引ID（UUID） |

##### リクエストボディ

取引作成と同じ形式です。

```json
{
  "type": "expense",
  "amount": 2000,
  "currency": "JPY",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "スーパーで買い物（修正）",
  "date": "2025-11-05"
}
```

##### レスポンス

**Status**: `200 OK`

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "type": "expense",
  "amount": 2000,
  "currency": "JPY",
  "category_id": "123e4567-e89b-12d3-a456-426614174000",
  "description": "スーパーで買い物（修正）",
  "date": "2025-11-05",
  "exchange_rate_usd": null,
  "created_at": "2025-11-05T10:30:00.000Z",
  "updated_at": "2025-11-05T11:45:00.000Z"
}
```

##### エラーレスポンス

**Status**: `404 Not Found`

```json
{
  "error": "Transaction not found"
}
```

##### cURL例

```bash
curl -X PUT "https://your-api-url.com/api/transactions/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 2000,
    "currency": "JPY",
    "category_id": "123e4567-e89b-12d3-a456-426614174000",
    "description": "スーパーで買い物（修正）",
    "date": "2025-11-05"
  }'
```

---

#### 2.4. 取引削除

既存の取引を削除します。

##### リクエスト

```http
DELETE /api/transactions/:id
```

**認証**: 必須

##### パスパラメータ

| Parameter | Type | Required | Description |
|:----------|:-----|:---------|:------------|
| `id` | string | ✅ | 取引ID（UUID） |

##### レスポンス

**Status**: `204 No Content`

レスポンスボディはありません。

##### エラーレスポンス

**Status**: `404 Not Found`

```json
{
  "error": "Transaction not found"
}
```

##### cURL例

```bash
curl -X DELETE "https://your-api-url.com/api/transactions/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 3. カテゴリ管理

#### 3.1. カテゴリ一覧取得

システム提供カテゴリとユーザーカスタムカテゴリの一覧を取得します。

##### リクエスト

```http
GET /api/categories
```

**認証**: 必須

##### レスポンス

**Status**: `200 OK`

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "食費",
    "type": "expense",
    "icon": "🍽️",
    "color": "#e8a76f",
    "is_system": true,
    "user_id": null,
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "234e4567-e89b-12d3-a456-426614174001",
    "name": "給与",
    "type": "income",
    "icon": "💰",
    "color": "#5ab18a",
    "is_system": true,
    "user_id": null,
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "345e4567-e89b-12d3-a456-426614174002",
    "name": "交通費",
    "type": "expense",
    "icon": "🚗",
    "color": "#6fb0c2",
    "is_system": true,
    "user_id": null,
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": "456e4567-e89b-12d3-a456-426614174003",
    "name": "趣味",
    "type": "expense",
    "icon": "🎮",
    "color": "#b693d6",
    "is_system": true,
    "user_id": null,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

##### フィールド説明

| Field | Type | Description |
|:------|:-----|:------------|
| `id` | string | カテゴリID（UUID） |
| `name` | string | カテゴリ名 |
| `type` | string | `income`（収入）または `expense`（支出） |
| `icon` | string | アイコン（絵文字） |
| `color` | string | カラーコード（16進数） |
| `is_system` | boolean | システム提供カテゴリか |
| `user_id` | string \| null | ユーザーIDまたはnull（システムカテゴリの場合） |
| `created_at` | string | 作成日時（ISO 8601） |

##### cURL例

```bash
curl -X GET "https://your-api-url.com/api/categories" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 4. 為替レート

#### 4.1. 為替レート取得

最新の為替レートを取得します。

##### リクエスト

```http
GET /api/exchange-rates
```

**認証**: 不要

##### レスポンス

**Status**: `200 OK`

```json
{
  "base": "USD",
  "rates": {
    "USD": 1,
    "JPY": 149.83,
    "EUR": 0.92
  },
  "date": "2025-11-05"
}
```

##### フィールド説明

| Field | Type | Description |
|:------|:-----|:------------|
| `base` | string | 基準通貨（常に `USD`） |
| `rates` | object | 各通貨のレート |
| `rates.USD` | number | USD のレート（常に `1`） |
| `rates.JPY` | number | JPY のレート |
| `rates.EUR` | number | EUR のレート |
| `date` | string | レート取得日（YYYY-MM-DD） |

##### キャッシュ仕様

- **キャッシュ期間**: 1日（日付が変わるまで）
- **更新頻度**: 1日1回（初回リクエスト時）
- **フォールバック**: API障害時は固定レート（USD=1, JPY=150, EUR=0.92）

##### cURL例

```bash
curl -X GET "https://your-api-url.com/api/exchange-rates"
```

##### 為替変換ロジック

すべての通貨変換はUSDを経由して行われます。

**変換式**:
```
1. fromCurrency → USD
   usdAmount = amount / rates[fromCurrency]

2. USD → toCurrency
   finalAmount = usdAmount * rates[toCurrency]
```

**実装例（TypeScript）**:
```typescript
const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: { USD: number; JPY: number; EUR: number }
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Step 1: fromCurrency → USD
  const usdAmount = fromCurrency === 'USD' 
    ? amount 
    : amount / rates[fromCurrency];
    
  // Step 2: USD → toCurrency
  const convertedAmount = toCurrency === 'USD'
    ? usdAmount
    : usdAmount * rates[toCurrency];

  return Math.round(convertedAmount * 100) / 100;
};

// 使用例
const rates = { USD: 1, JPY: 149.83, EUR: 0.92 };
const jpyAmount = convertCurrency(100, 'USD', 'JPY', rates);
// => 14983
```

---

## ⚠️ エラーレスポンス

### エラーレスポンス形式

すべてのエラーは以下の形式で返されます:

```json
{
  "error": "エラーメッセージ"
}
```

バリデーションエラーの場合、詳細情報が含まれます:

```json
{
  "error": "Invalid request body",
  "details": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

### HTTPステータスコード別エラー

#### 400 Bad Request

リクエストのバリデーションエラーです。

**原因例**:
- 必須フィールドの欠落
- 不正なデータ型
- 許可されていない値

**レスポンス例**:
```json
{
  "error": "Invalid request body",
  "details": [
    {
      "field": "currency",
      "message": "Currency must be one of: JPY, USD, EUR"
    }
  ]
}
```

#### 401 Unauthorized

認証エラーです。

**原因例**:
- 認証トークンが欠落
- 認証トークンが無効
- 認証トークンが期限切れ

**レスポンス例**:
```json
{
  "error": "Unauthorized"
}
```

#### 403 Forbidden

権限エラーです。

**原因例**:
- 他のユーザーのリソースへのアクセス試行

**レスポンス例**:
```json
{
  "error": "Forbidden"
}
```

#### 404 Not Found

リソースが見つかりません。

**原因例**:
- 存在しない取引IDの指定
- 削除済みリソースへのアクセス

**レスポンス例**:
```json
{
  "error": "Transaction not found"
}
```

#### 500 Internal Server Error

サーバーエラーです。

**原因例**:
- データベース接続エラー
- 予期しないサーバーエラー

**レスポンス例**:
```json
{
  "error": "Internal server error"
}
```

---

## ⏱️ レート制限

### 制限なし（現在）

現在、APIレート制限は設定されていません。

### 推奨事項

- **キャッシュの活用**: 為替レートは1日1回の更新で十分です
- **バッチ処理**: 大量の取引を処理する場合は、適切な間隔を設けてください

### 将来の実装予定

- 認証済みユーザー: 1000リクエスト/時間
- 未認証エンドポイント: 100リクエスト/時間

---

## 📊 データモデル

### Transaction（取引）

```typescript
interface Transaction {
  id: string;                    // UUID
  user_id: string;               // ユーザーID（UUID）
  type: 'income' | 'expense';    // 取引タイプ
  amount: number;                // 金額
  currency: 'JPY' | 'USD' | 'EUR'; // 通貨
  category_id: string;           // カテゴリID（UUID）
  categories?: Category;         // カテゴリ詳細（結合時）
  description: string;           // 説明
  date: string;                  // 取引日（YYYY-MM-DD）
  exchange_rate_usd: number | null; // USD換算レート（将来実装）
  created_at: string;            // 作成日時（ISO 8601）
  updated_at: string;            // 更新日時（ISO 8601）
}
```

### Category（カテゴリ）

```typescript
interface Category {
  id: string;                    // UUID
  name: string;                  // カテゴリ名
  type: 'income' | 'expense';    // カテゴリタイプ
  icon: string;                  // アイコン（絵文字）
  color: string;                 // カラーコード（16進数）
  is_system: boolean;            // システム提供カテゴリか
  user_id: string | null;        // ユーザーID（カスタムカテゴリの場合）
  created_at: string;            // 作成日時（ISO 8601）
}
```

### ExchangeRate（為替レート）

```typescript
interface ExchangeRates {
  base: string;                  // 基準通貨（USD）
  rates: {
    USD: number;                 // USD レート（常に1）
    JPY: number;                 // JPY レート
    EUR: number;                 // EUR レート
  };
  date: string;                  // レート取得日（YYYY-MM-DD）
}
```

---

## 🧪 テスト用データ

### テストユーザー

開発環境では、以下のテストユーザーが利用可能です:

```
Email: test@example.com
Password: test1234
```

### システムカテゴリ一覧

#### 支出カテゴリ

| Icon | Name | Color |
|:-----|:-----|:------|
| 🍽️ | 食費 | #e8a76f |
| 🚗 | 交通費 | #6fb0c2 |
| 🏠 | 住居費 | #88ceac |
| ⚡ | 光熱費 | #f7dc6f |
| 📱 | 通信費 | #85c1e9 |
| 🎮 | 趣味 | #b693d6 |
| 🏥 | 医療費 | #f1948a |
| 🎓 | 教育費 | #aed6f1 |
| 👔 | 衣服費 | #d7bde2 |
| 🎁 | その他 | #d5dbdb |

#### 収入カテゴリ

| Icon | Name | Color |
|:-----|:-----|:------|
| 💰 | 給与 | #5ab18a |
| 💼 | 副業 | #76c7c0 |
| 📈 | 投資 | #52be80 |
| 🎁 | その他 | #5dade2 |

---

## 📜 変更履歴

### Version 1.0.0 (2025-11-05)

**初回リリース**

- ヘルスチェックAPI
- 取引CRUD操作
- カテゴリ一覧取得
- 為替レート取得
- JWT認証の実装

---

## 📞 サポート

### ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [技術スタックと選定理由.md](./技術スタックと選定理由.md) - 技術選定の背景

<!-- ### お問い合わせ -->

<!-- API仕様に関するご質問は、以下からお願いします: -->

<!-- - 📧 Email: your.email@example.com -->
<!-- - 🐙 GitHub Issues: [github.com/yourusername/household-app/issues](https://github.com/yourusername/household-app/issues) -->

---

<!-- <div align="center"> -->

<!-- **Built with ❤️ by Your Name** -->

[⬆ Back to Top](#multi-currency-household-app---api仕様書)

</div>