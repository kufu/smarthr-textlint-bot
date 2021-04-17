import { App, LogLevel, KnownBlock, Block } from '@slack/bolt'
import { TextFixEngine } from 'textlint'
import * as path from 'path'
require('dotenv').config()

import formatResults from './utils/formatResults'

type Blocks = (KnownBlock | Block)[]

// アプリの初期化
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

// Textlintの初期化
const engine = new TextFixEngine({
  configFile: path.join(__dirname, '../.textlintrc.json'),
})

// メンション（@textlint）によるlint実行
app.event('app_mention', async ({ event, context }) => {
  let blockMessage: Blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '文書チェックが完了しました！',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*文書チェック結果:*',
      },
    },
  ]

  try {
    const fixResults = await engine.executeOnText(event.text)
    if (engine.isErrorResults(fixResults)) {
      blockMessage = [
        ...blockMessage,
        {
          type: 'section',
          text: { type: 'mrkdwn', text: formatResults(fixResults) },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*自動修正文書の提案:*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: fixResults[0].output,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text:
                '※この文書は<https://github.com/kufu/textlint-rule-preset-smarthr|textlint-rule-preset-smarthr>のルールに基づき、自動修正しています。',
            },
          ],
        },
      ]
    } else {
      blockMessage.push({
        type: 'section',
        text: { type: 'mrkdwn', text: 'エラーは見つかりませんでした:+1:' },
      })
    }

    app.client.chat.postMessage({
      token: context.botToken,
      channel: event.channel,
      thread_ts: event.ts,
      text: '',
      blocks: blockMessage,
    })
  } catch (error) {
    throw error(error)
  }
})
;(async () => {
  // Start your app
  await app.start(Number(process.env.PORT) || 3000)
  console.log('⚡️ Bolt app is running!')
})()
