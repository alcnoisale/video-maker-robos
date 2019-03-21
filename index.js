const readline = require('readline-sync')

function start() {
    const content = {}

    content.searchTerm = askAndReturnSearchTerm() // => *Orquestrador 01-Perguntar pelo termo de busca
    content.prefix = askAndReturnPrefix()

    function askAndReturnSearchTerm() {
        return readline.question('Type a wikipedia search term: ') // => *Orquestrador 01-Perguntar pelo termo de busca
    }

    function askAndReturnPrefix() {
        const prefixes = ['who is', 'what is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }

    console.log(content)
}

start()