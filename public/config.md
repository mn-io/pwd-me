# Constraints
 * No beginning whitespace: `(^\\S).*`
 * No trailing whitespace:`.*\\S$`
 * Min 1 Number: `(?=(.*\\d){1})`
 * Min 2 Letters: `(?=.*[a-zA-Z]){2}`
 * Min 3 of those characters: `(?=.*[!@#$~-]){3}`
