import { Random, Utils } from '@code-not-art/core';
const { array } = Utils;
/**
 * Generate a short phrase, has the form `adverb adjective noun` where at least the noun will generate and optionally the adverb and adjective will.
 * Some example phrases:
 *  - unlikable sociograms
 *  - casually burnable archdiocese
 *  - pakthongs
 *  - hypnotically much preinviting
 *  - phlegmatically disappointing outfits
 *  - unionized anthropologist
 *
 * NOTE: Phrases won't always be gramtically correct, sometimes non-nouns get classified as nouns
 * @param rng Random generator to use for this phrase generation
 * @param joiner string to place between words of the phrase, defaults to a space: `' '`
 * @returns string
 */
// TODO: Allow inputs to control the structure and odds.
function seedPhrase(rng: Random, options?: { words?: number; joiner?: string }) {
	rng.push('phrase generation');
	const joiner = options?.joiner || ' ';
	const wordCount = options?.words || 3;

	const output = array(wordCount)
		.map((_) => rng.word())
		.join(joiner);
	rng.pop();
	return output;
}
export default seedPhrase;
