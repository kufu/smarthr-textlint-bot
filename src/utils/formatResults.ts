export default (results: any) => {
  const messages = results[0].messages
  let output = ''

  messages.forEach((message: any) => {
    output += `${message.line}行目: ${message.message}\n`
  })
  return '```\n' + `${output}` + '```\n'
}
