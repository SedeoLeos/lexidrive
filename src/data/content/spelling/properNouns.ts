/**
 * Proper nouns accepted by the offline spell checker (the SCOWL lists are lowercase-only).
 * Compared case-insensitively, so "Monday", "French" or "Germany" are never underlined.
 */
export const PROPER_NOUNS = `
monday tuesday wednesday thursday friday saturday sunday
january february march april may june july august september october november december
christmas easter halloween ramadan eid hanukkah thanksgiving
england english britain british scotland scottish wales welsh ireland irish uk usa
america american canada canadian australia australian zealand
france french belgium belgian switzerland swiss luxembourg germany german austria austrian
spain spanish portugal portuguese italy italian greece greek netherlands dutch holland
denmark danish sweden swedish norway norwegian finland finnish iceland icelandic
poland polish russia russian ukraine ukrainian romania romanian hungary hungarian czech
turkey turkish egypt egyptian morocco moroccan algeria algerian tunisia tunisian
senegal senegalese mali malian ivory nigeria nigerian ghana ghanaian kenya kenyan
cameroon cameroonian congo congolese gabon gabonese ethiopia ethiopian africa african
china chinese japan japanese korea korean india indian pakistan pakistani vietnam vietnamese
thailand thai indonesia indonesian philippines filipino asia asian europe european
mexico mexican brazil brazilian argentina argentinian chile chilean colombia colombian
peru peruvian cuba cuban haiti haitian
arabic hindi mandarin cantonese swahili wolof lingala latin hebrew persian
paris london berlin madrid rome lisbon brussels geneva amsterdam vienna dublin
edinburgh manchester liverpool oxford cambridge york boston chicago washington
tokyo beijing delhi mumbai dakar abidjan kinshasa lagos nairobi cairo casablanca tunis
montreal quebec toronto vancouver sydney melbourne lyon marseille lille nice bordeaux toulouse
google microsoft apple amazon facebook instagram youtube whatsapp linkedin netflix
internet wifi email emails ok okay app apps smartphone online offline
`
  .split(/\s+/)
  .filter(Boolean);
