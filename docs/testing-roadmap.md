# テストロードマップ

## 1. セットアップチケット
- **FE-SETUP-001**: Vitest と React Testing Library の導入。`frontend` 内で `vitest`・`@testing-library/react`・`@testing-library/user-event` を追加し、`vitest.config.ts` を更新。サンプルテストとカバレッジ出力設定を含める。
- **FE-SETUP-002**: Playwright の導入。`frontend` に E2E ディレクトリを用意し、`playwright.config.ts` でデスクトップ・モバイル向けビューポートを定義。CI 向けに `npx playwright install --with-deps` を追加。
- **BE-SETUP-001**: Jest + ts-jest + supertest の導入。`backend` に `jest.config.ts` を追加し、`ts-jest` トランスフォームと `setupFilesAfterEnv` で環境変数を初期化。サービス層モックのサンプルを作成。
- **BE-SETUP-002**: aws-sdk-mock 等の外部依存モック基盤を整備。Supabase クライアントのモックファクトリを `backend/src/utils/__mocks__/supabase.ts` に配置。

## 2. CI ジョブ設計
- **workflow**: GitHub Actions に `ci.yml` を新設。トリガーは `pull_request` と `main` ブランチへの `push`。
- **ジョブ構成**:
	- `lint-and-typecheck`: `npm ci` 後に `frontend`・`backend` の lint、`tsc --noEmit` を実行。
	- `unit-tests`: それぞれのワークスペースで Vitest と Jest を実行し、カバレッジレポートを `artifacts` に保存。
	- `e2e-tests`: Playwright を headed=false で実行。タグにより本番 PR では必須、通常 PR では `manual` トリガーに設定。
- **バッジ**: README に CI ステータスバッジを追加。

## 3. エピックとテストシナリオ
- **EPIC-FE-TEST** (フロントエンド品質向上)
	- **FE-TEST-001**: 認証フロー (ログイン/会員登録の成功・失敗ルート)
	- **FE-TEST-002**: 取引フィルタと一覧表示 (API モックと UI の同期)
	- **FE-TEST-003**: ダッシュボード指標表示 (集計ロジックと異常系)
- **EPIC-BE-TEST** (バックエンド信頼性強化)
	- **BE-TEST-001**: 認可ミドルウェアのトークン検証パス
	- **BE-TEST-002**: 為替サービスの外部 API エラーハンドリング
	- **BE-TEST-003**: 取引作成ハンドラのバリデーションとリトライ
- **EPIC-E2E-TEST** (エンドツーエンド回帰)
	- **E2E-TEST-001**: 新規ユーザ登録→取引登録→グラフ反映のハッピーパス
	- **E2E-TEST-002**: モバイルナビ操作と保護ページアクセス制御

### 優先度 (高→低)
1. FE-SETUP-001 / BE-SETUP-001 / FE-TEST-001 / BE-TEST-001
2. FE-SETUP-002 / BE-SETUP-002 / FE-TEST-002 / BE-TEST-002
3. E2E-TEST-001 / FE-TEST-003 / BE-TEST-003 / E2E-TEST-002

## 4. テストデータ戦略
- **シードデータ**: E2E 用に Supabase のステージングテーブルへ初期ユーザとサンプル取引を投入。テスト開始前に `./scripts/seed-test-data.ts` を実行し、終了時にクリーンアップ。
- **ダミー生成**: 単体/統合テストでは `faker` を用いて日付・金額・カテゴリを動的生成。再現性が必要なケースではシード値を固定。
- **認証情報**: Cognito/Supabase トークンはモックレスポンスを JSON として保存し、ビルドに含めず `.env.test` でロード。

## 5. モック戦略
- **フロントエンド**: `MSW` で `/api/*` をフロントテスト中にインターセプト。ユニットテストはフック単位で `vi.mock` を活用。
- **バックエンド**: `aws-sdk-mock` と `nock` で外部通信をスタブ。Supabase クライアントはメソッド単位の Jest モックを用意し、成功/失敗パターンを明示。
- **E2E**: Playwright ではステージング環境を想定しつつ、外部 API は `storageState` によるログイン省略と `route.fulfill` を併用。
