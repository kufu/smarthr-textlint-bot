import { TextlintResult } from '@textlint/kernel'

export default (results: TextlintResult[]) => {
  const messages = results[0].messages
  let output = ''

  messages.forEach((message) => {
    let severity = ''
    if ((message as any).fatal || message.severity === 2) {
      severity = 'error'
    } else {
      severity = 'warning'
    }
    output += `${message.line}:${message.column}[${severity}] ${message.message}\n`
  })
  return '```\n' + `${output}` + '```\n'
}
