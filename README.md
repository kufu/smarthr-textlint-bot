# smarthr-textlint-bot

[textlint の SmartHR 用ルールプリセット](https://github.com/kufu/textlint-rule-preset-smarthr)を使って、Slack 上から文書の`lint`と`fix`を行える bot です。

## 何ができる？

- Slack 内で、bot のメンションを付けてメッセージを送信すると、textlint を通して文書のチェックと、自動校正を実行します。

## 開発方法

bot 開発には[Bolt](https://github.com/slackapi/bolt-js)を使っています。
ローカルで bot アプリを起動するには、以下のステップに従ってください。

- プロジェクトのルートディレクトリに `.env`ファイルを作って、必要な情報を設定
- `yarn`または`npm install`を実行して依存ライブラリをインストール
- `yarn dev`または`npm run dev`を実行して、アプリを起動
- ngrok をインストールしていなければインストール - https://ngrok.com/
  - `brew install ngrok`のインストールを推奨します。
- 別のターミナルで`ngrok http 3000`を実行して公開エンドポイントを立ち上げる

#### `.env`を配置して Bot Token と Signing Secret を設定

```:.env
SLACK_BOT_TOKEN=xoxb-111-111-xxx
SLACK_SIGNING_SECRET=xxx
```

#### ローカルアプリを起動

```
node --version # v10.13.0 以上
yarn
yarn dev` # 起動すると http://localhost:3000/slack/events でリクエストを受け付けます
```

#### `ngrok`を`Slack`からのリクエストをフォワードするために起動

ngrok をまだインストールしていなければ、ダウンロードして設定します。以下のステップで、適切に設定できたか確認します。

```
# ローカルでアプリが立ち上がっていることを確認
curl -I -XPOST http://localhost:3000/slack/events # HTTP/1.1 401 Unauthorized が返ってくるはず

# 別のターミナルで実行
./ngrok http 3000

# ngrok の有償プランを使っているなら以下のように固定のサブドメインを指定できます
./ngrok http 3000 --subdomain {whatever-you-want}

# 再度、公開エンドポイントからリクエストをして、同じように 401 が返ってくるか確認
curl -I -XPOST https://{your random subdomain here}.ngrok.io/slack/events # HTTP/1.1 401 Unauthorized が返ってくれば OK
```

### デプロイ方法

```
$ sls deploy --aws-profile {your-profile}
```

### 必要な権限

- OAuth & Permissions
  - app_mentions:read
  - channels:history
  - channels:join
  - chat:write
  - im:history
- Event Subscriptions
  - app_mention