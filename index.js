const readline = require('readline-sync')
const robots = {
    // userInput: require('./robots/user-input.js'),
    text: require('./robots/text.js')
}

async function start() {

    const content = {}

    content.searchTerm = askAndReturnSearchTerm() // => * Orquestrador 01-Perguntar pelo termo de busca
    content.prefix = askAndReturnPrefix() // => * Orquestrador 02- Perguntar pelo prefixo

    // robots.userInput(content)
    await robots.text(content)

    function askAndReturnSearchTerm() {
        return readline.question('Type a wikipedia search term: ') // => * Orquestrador 01-Perguntar pelo termo de busca
    }

    function askAndReturnPrefix() {
        const prefixes = ['who is', 'what is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ') // => * Orquestrador 02- Perguntar pelo prefixo
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }

    // console.log(content)
}

start()