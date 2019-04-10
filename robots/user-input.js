const readline = require('readline-sync')
const state = require('./state.js')

function robot() {

    const content = {
        maximumSentences: 7
    }

    content.searchTerm = askAndReturnSearchTerm() // => * Orquestrador 01-Perguntar pelo termo de busca
    content.prefix = askAndReturnPrefix() // => * Orquestrador 02- Perguntar pelo prefixo
    content.language = askAndReturnLanguage()
 
    state.save(content)//USANDO O ROBO DE ESTADO PARA SALVAR OS RESULTADOS DA CONSULTA ATUAL

    function askAndReturnSearchTerm() {
        return readline.question('Type a wikipedia search term: ') // => * Orquestrador 01-Perguntar pelo termo de busca
    }

    function askAndReturnPrefix() {
        const prefixes = ['who is', 'what is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose one option: ') // => * Orquestrador 02- Perguntar pelo prefixo
        const selectedPrefixText = prefixes[selectedPrefixIndex]

        return selectedPrefixText
    }    

    function askAndReturnLanguage() {
        linguas = ['pt','en', 'es']
        const lang = ['portugays','ingrais', 'ispanhou']
        const selectLanguage = readline.keyInSelect(lang, 'Escolha a linguagem de busca: ')
        const selectedLangText = linguas[selectLanguage]
        console.log('linguagem escolhida: ',selectedLangText)
        return selectedLangText
    }

}


module.exports = robot