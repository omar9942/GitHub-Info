const userInput = document.querySelector("input[type=text]");
const search = document.querySelector("button");
const errorMsg = document.querySelector(".error");
const info = document.querySelector(".info");

search.addEventListener("click", function () {
	if (userInput.value) {
		fetch(`https://api.github.com/users/${userInput.value}`).then((res) => {
			if (res.ok) {
				errorMsg.innerHTML = "";
				res.json().then((user) => {
					info.innerHTML = "";
					info.style.padding = "50px 15px";
					info.innerHTML = `
                        <div class="user">
				            <img id="avatar" src="${user.avatar_url}" alt="user pfp" />
				            <div class="user-info">
					            <p id="name">${user.name || ""}</p>
					            <a href="https://github.com/${
									user.login
								}/" target=”_blank” id="username">${
						user.login
					}</a>
				            </div>
				            <p id="bio">${user.bio || ""}</p>
			            </div>
                    `;
					addRepos(user.repos_url, user.login);
				});
			} else {
				errorMsg.innerHTML = "User Not Found";
			}
		});
	}
});

function addRepos(url, username) {
	let repoOuterDiv = document.createElement("div");
	repoOuterDiv.className = "repos-outside";
	repoOuterDiv.innerHTML = "<h1>Public Repositories</h1>";

	fetch(url)
		.then((res) => res.json())
		.then((reposArr) => {
			if (reposArr.length) {
				let repoInnerDiv = document.createElement("div");
				repoInnerDiv.className = "repos-inside";
				repoOuterDiv.appendChild(repoInnerDiv);
				for (let repo of reposArr) {
					let repoDiv = document.createElement("div");
					repoDiv.className = "repo";
					repoDiv.innerHTML = `
						    <a href="https://github.com/${
								repo.full_name
							}/" target=”_blank”" class="name">${repo.name}</a>
						    <p class="desc">${repo.description || ""}</p>
					`;
					if (repo.language) {
						addLang(repoDiv, repo.language);
					}
					repoInnerDiv.appendChild(repoDiv);
				}
			} else {
				let noRepos = document.createElement("p");
				noRepos.innerText = `${username} doesn't have any public repositories yet.`;
				noRepos.style.color = "white";
				repoOuterDiv.appendChild(noRepos);
			}
		});
	info.appendChild(repoOuterDiv);
}

function addLang(parent, lang) {
	let langDiv = document.createElement("div");
	langDiv.className = "lang";
	let langCir = document.createElement("div");
	langCir.className = "circle";
	fetch("./colors.json")
		.then((res) => res.json())
		.then((colors) => (langCir.style.backgroundColor = colors[lang]));
	langDiv.innerHTML = `<span class="lang-name">${lang}</span>`;
	langDiv.appendChild(langCir);
	parent.appendChild(langDiv);
}
