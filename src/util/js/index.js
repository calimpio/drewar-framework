module.exports = Object.freeze({
    js: {
        Functions: Object.freeze({
            /**
            * 
            * @param {string} strData 
            * @param {{[comp:string]:string}} StringToComparatorEnum 
            * @returns {RegExpMatchArray[]}
            */
            regexSpesificator(strData, StringToComparatorEnum) {
                var re = "((?:\())(?<field>[a-zA-Z0-9]+.[a-zA-Z0-9]+|[a-zA-Z0-9]+)(?<comparator>" + Object.keys(StringToComparatorEnum).join("|") + ")(?<value>[a-zA-Z0-9 \\$\\%\\:\\-\.\_\+\\*\\?\"\'\\[\\]\\{\\}<>]+|)(?<operator>\\)\\||\\),|\\|\\(|,\\(|\\||,|)(?:\()))"
                return [...strData.matchAll(re)];
            },

            regexEmail() {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            }

        })
    }
})