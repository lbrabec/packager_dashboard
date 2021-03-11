import { generate } from 'pegjs'

const grammar = `
start
 = _ additive:additive _ { return additive; }
 / !. { return {}; }

additive
 = left:multiplicative _ "||" _ right:additive { return {o: "OR", l: left, r: right}; }
 / multiplicative

multiplicative
 = left:primary _ "&&" _ right:multiplicative { return {o: "AND", l: left, r: right}; }
 / primary

primary
 = "!" _ primary:primary { return {o: "NOT", v:primary}; }
 / regex
 / string
 / "(" _ expr:additive _ ")" { return expr; }

regex
 = _ "r/" r:regex_inner "/" _ { return {o:"REGEX", v:r}; }

regex_inner
 = [^/]+ { return text(); }

string "string"
 = [^/()|&! \\t\\n\\r]+ { return {o:"STR", v:text().trim()}; }

_ "whitespace"
  = [ \\t\\n\\r]*
`

console.log(grammar)

export const Parser = generate(grammar)
