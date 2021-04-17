import { App, LogLevel } from '@slack/bolt'
import { TextLintEngine } from 'textlint'
import * as path from 'path'
require('dotenv').config()

const engine = new TextLintEngine({
  configFile: path.join(__dirname, '../.textlintrc.json'),
})

const formatResults = (results: any) => {
  let output = '```\n'
  const messages = results[0].messages
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    const msgText = `${msg.line}行目：${msg.message}\n`
    output += msgText
  }
  output += '```'

  return output
}

// Initializes your app with your bot token and signing secret
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
})

app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`こんちは <@${message}>!`)
})

app.event('app_mention', async ({ event, context }) => {
  let blockMessage = [
    {
      type: 'section',
      text: { type: 'plain_text', text: 'エラーなさそう。' },
    },
  ]

  try {
    const lintResults = await engine.executeOnText(event.text)
    if (engine.isErrorResults(lintResults)) {
      let output = ''
      output = 'エラーが見つかりました。\n\n'
      output += formatResults(lintResults)

      blockMessage = [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: output },
        },
      ]
    }

    app.client.chat.postMessage({
      token: context.botToken,
      channel: event.channel,
      blocks: blockMessage,
      thread_ts: event.thread_ts,
      text: 'hoge',
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
