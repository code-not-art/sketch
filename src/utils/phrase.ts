import { Random } from '@code-not-art/core';
/**
 * Generate a short phrase, has the form `adverb adjective noun` where at least the noun will generate and optionally the adverb and adjective will.
 * Some example phrases:
 *  - tantric bateleurs
 *  - casually burnable archdiocese
 *  - presumably convocate
 *  - pakthongs
 *  - hypnotically much preinviting
 *
 * NOTE: Phrases won't always be gramtically correct, sometimes non-nouns get classified as nouns
 * @param rng Random generator to use for this phrase generation
 * @param joiner string to place between words of the phrase, defaults to a space: `' '`
 * @returns string
 */
// TODO: Allow inputs to control the structure and odds.
function seedPhrase(rng: Random, joiner?: string) {
  rng.push('phrase generation');
  const _joiner = joiner || ' ';
  const hasAdjective = rng.bool(0.75);
  const hasAdverb = hasAdjective && rng.bool(0.6);
  const adjective = hasAdjective ? `${rng.word('adjective')}${_joiner}` : '';
  const adverb = hasAdverb ? `${rng.word('adverb')}${_joiner}` : '';
  const output = `${adverb}${adjective}${rng.word('noun')}`;
  rng.pop();
  return output;
}
export default seedPhrase;
