// my own markdown parser i guess :3

/*
	features: headings, paragraphs, all emphasis (tho only asterisks), images (or at least returns the alt and src)
	this also assumes you dont make mistakes with the amount of asterisks lol

	any linebreak for new paragraph, double space at end of line for br
*/

/**
 * parse markdown
 * @param {string} markdown
 */
function parseMarkdown(markdown) {
	const lines = markdown.split("\n");
	const output = [];
	const imgs = [];
	for (let line of lines) {
		if (line.trim().length == 0) continue;

		line = parseEmphasis(line);

		let post = "";

		if (line.endsWith("  ")) post = "</br>";

		const headingMatch = line.match(/^(#+)/g);
		if (headingMatch) {
			output.push(
				`<h${headingMatch[0].length}>${line.split(" ").slice(1).join(" ")}</h${headingMatch[0].length}>${post}`,
			);
			continue;
		}

		const imgMatch = Array.from(line.matchAll(/!\[(.+?)\]\((.+?)\)/g))[0];
		if (imgMatch) {
			imgs.push({ alt: imgMatch[1], path: imgMatch[2] });
			continue;
		}

		output.push(`<p>${line}</p>${post}`);
	}

	return [output.join("\n"), imgs];
}

/**
 * parse italic, bold, both
 * @param {string} markdown
 */
function parseEmphasis(markdown) {
	if (markdown.length == 0) return "";

	const chars = markdown.split("");
	const newChars = [];

	let mdLen = 0;
	let inPhrase = false;

	let last = chars[0];
	if (last == "*") {
		mdLen++;
	} else newChars.push(last);

	for (let i = 1; i < chars.length; i++) {
		const char = chars[i];

		if (char == "*") {
			if (!inPhrase) {
				// pre phrase
				if (mdLen == 3) newChars.push(char);
				else mdLen++;
			} else {
				// post phrase
				if (mdLen == 1) newChars.push("</em>");
				else if (mdLen == 2) newChars.push("</strong>");
				else if (mdLen == 3) newChars.push("</strong></em>");

				inPhrase = false;
				i += mdLen - 1;
				mdLen = 0;
			}
		} else {
			if (last == "*") {
				if (mdLen != 0) {
					// in phrase
					inPhrase = true;
					if (mdLen == 1) newChars.push("<em>");
					else if (mdLen == 2) newChars.push("<strong>");
					else if (mdLen == 3) newChars.push("<em><strong>");
				}
			}

			newChars.push(char);
		}

		last = char;
	}

	return newChars.join("");
}
