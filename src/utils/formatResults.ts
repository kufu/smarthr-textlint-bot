import { TextlintResult } from '@textlint/kernel'

export default (results: TextlintResult[]) => {
  const messages = results[0].messages
  let output = ''

  messages.forEach((message) => {
    output += `${message.line}:${message.column} ${message.message}\n`
  })
  return '```\n' + `${output}` + '```\n'
}
