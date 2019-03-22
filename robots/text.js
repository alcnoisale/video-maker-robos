const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').ApiKey
const sentenceBoundaryDetection = require('sbd')

async function robot(content) {

    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentences(content)
    
   async function fetchContentFromWikipedia(content) {

        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) //chave de acessoa algoritmia = API KEY TEMPORARIA
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponse.get()

        content.sourceContentOriginal = wikipediaContent.content
        // console.log(wikipediaContent)
    }

    function sanitizeContent(content) {
        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDateInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParentheses

        console.log(withoutDatesInParentheses)

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n')
            
            const withoutBlankLinesAndMarkdown = allLines.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
                }

                return true
            })
            return withoutBlankLinesAndMarkdown.join(' ')
        }
    }

    function removeDateInParentheses(text) {

        return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')
    }

    function breakContentIntoSentences(content) {
        content.sentences = []        

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
        console.log(content)
    }
}

module.exports = robot