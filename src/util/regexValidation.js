export const emailRegex =  /^[a-zA-ZåäöÅÄÖéÉøØüÜçÇñÑ0-9._'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const nameRegex = /^[a-zA-ZåäöÅÄÖéÉøØüÜçÇñÑ\-']+$/;
export const fullAddressRegex = /^[A-Za-zÅÄÖåäö0-9\s\-]+ \d+[A-Za-z]?\s[A-Za-zÅÄÖåäö\s]+ \d{5}$/
export const phoneRegex = /^\+?\d+$/;



/* 
*** email ***
  Matches standard email addresses with:
  - Local part (before @): allows letters (including accented ones), digits,
    dots (.), underscores (_), hyphens (-), and apostrophes (').
  - Domain part (after @): allows letters, digits, dots, and hyphens.
  - Top-level domain (TLD): must be at least two alphabetic characters.

  Example matches:
    - john.doe@example.com
    - élise.o'connor@firma.se

*** name ***
[a-zA-ZåäöÅÄÖ\-] means any character beteen lowercase a-z and uppercase A-Z
 + swedish letters + éÉøØüÜçÇñÑ\-'.
 

*** full address ***
  Matches addresses in the format:
    "StreetName 14B CityName 12345"

  Structure:
  - Street name: letters, digits, spaces, and hyphens allowed
  - Street number: digits, optionally followed by a letter (e.g., 14B)
  - City: letters and spaces (e.g., "Göteborg")
  - Postal code: exactly 5 digits

  Example matches:
    - Husmansgatan 14B Göteborg 41122
    - Sveavägen 23 Malmö 12345

*** phone ***
\+?\d+ means optional + at the beginning and it expects a number in the string
The number length should be handled separately in the Schema.
*/