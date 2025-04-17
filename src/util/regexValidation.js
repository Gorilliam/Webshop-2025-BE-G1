export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^[a-zA-ZåäöÅÄÖ\-]+$/;
export const fullAddressRegex = /^[A-Za-zÅÄÖåäö0-9\s\-]+ \d+\s[A-Za-zÅÄÖåäö\s]+ \d{5}$/
export const phoneRegex = /^\+?\d+$/;



/* 
*** email ***
[^\s@] means any character except whitespace or @

Expected structure: Any@thing.com  (Something before @, after it, a dot and something else)

*** name ***
[a-zA-ZåäöÅÄÖ\-] means any character beteen lowercase a-z and uppercase A-Z
 + swedish letters and '-'.

*** full address ***


*** phone ***
\+?\d+ means optional + at the beginning and it expects a number in the string
The number length should be handled separately in the Schema.
*/