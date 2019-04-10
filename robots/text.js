const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia.json').apiKey
const sentenceBoundaryDetection = require('sbd')//BIBLIOTECA PARA QUEBRAR SENTECAS

const watsonAPIKey = require('../credentials/watson-nlu.json').apikey
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({      
  iam_apikey: watsonAPIKey,
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
})
const state = require('./state.js')

async function robot() {

    const content = state.load();
    
    await fetchContentFromWikipedia(content) //BAIXAR O CONTEUDO DO WIKIPIDIA
    sanitizeContent(content) //LIMPAR O CONTEUDO
    breakContentIntoSentences(content)//QUEBRAR EM SENTENCAS O CONTEUDO DO WIKIPIDIA
    limitMaximumSentences(content)
    await fetchKeywordsOfAllSentences(content)

    state.save(content)
    // console.log('Resultado da pesquisa solicitada')
    // console.log(content.sentences)

   async function fetchContentFromWikipedia(content) {
   
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey) //chave de acessoa algoritmia = API KEY TEMPORARIA
        const wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithm.pipe({
            "lang" : content.language,
            "articleName": content.searchTerm
        })       
        const wikipediaContent = wikipediaResponse.get()
    //console.log(wikipediaContent)//TESTAR RETORNANDO IMAGENS

        content.sourceContentOriginal = wikipediaContent.content //DELIMITANDO O RETORNO DO CONTEUDO DO WIKIPIDIA       
    }

    function sanitizeContent(content) {

        const withoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDatesInParentheses = removeDateInParentheses(withoutBlankLinesAndMarkdown)

        content.sourceContentSanitized = withoutDatesInParentheses

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
    }
    function limitMaximumSentences(content){       
        content.sentences = content.sentences.slice(0, content.maximumSentences)
    }

    async function fetchKeywordsOfAllSentences(content) {
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text)
        }
    }
    
    async function fetchWatsonAndReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
    
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            }, (error, response) => {
                if (error) {
                    throw error
                }
    
                const keywords = response.keywords.map((keyword) => {
                    return keyword.text
                })
                resolve(keywords)
            })
        })
    }

}


module.exports = robot