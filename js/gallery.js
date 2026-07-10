const postContainers = document.querySelectorAll("div.post-container");

for (const postContainer of postContainers) {
	const post = postContainer.querySelector(".post");
	const pics = postContainer.querySelector(".pics");

	const date = postContainer.id;

	makePost(date, post, pics);
}

/**
 * load post file
 * @param {string} date
 * @param {Element} postEl
 * @param {Element} picsEl
 */
async function makePost(date, postEl, picsEl) {
	const res = await window.fetch(`./gallery/${date}/post.md`);

	if (!res.ok)
		postEl.innerHTML = `<p class="error">couldn't get this post content, code ${res.status}</p>`;

	const post = await res.text();

	const [parsed, pics] = parseMarkdown(post);

	postEl.innerHTML = parsed;

	for (const pic of pics) {
		console.log(pic);

		const button = document.createElement("button");
		button.className = "tile";
		button.type = "button";

		const img = document.createElement("img");
		img.src = `./gallery/${date}/${pic.path}`;
		img.alt = pic.alt;

		button.appendChild(img);
		picsEl.appendChild(button);
	}

	initPopup();
}

function initPopup() {
	const popup = document.querySelector(".popup");
	const popupImg = document.querySelector(".popup-img");
	const closeBtn = document.querySelector(".popup-close");

	document.querySelectorAll(".tile").forEach((btn) => {
		btn.addEventListener("mouseover", () => {
			popupImg.src = btn.querySelector("img").src;
		});

		btn.addEventListener("click", () => {
			popupImg.src = btn.querySelector("img").src;
			popupImg.alt = btn.querySelector("img").alt || "";
			popup.setAttribute("aria-hidden", "false");
		});
	});

	closeBtn.addEventListener("click", () =>
		popup.setAttribute("aria-hidden", "true"),
	);
	popup.addEventListener("click", (e) => {
		if (e.target === popup) popup.setAttribute("aria-hidden", "true");
	});
	window.addEventListener("keydown", (e) => {
		if (e.key === "Escape") popup.setAttribute("aria-hidden", "true");
	});
}
