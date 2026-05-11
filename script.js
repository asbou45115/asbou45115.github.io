const githubUser = "asbou45115";
const endpointsList = document.getElementById("endpointsList");
const statusMessage = document.getElementById("statusMessage");
const refreshButton = document.getElementById("refreshButton");

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function buildPagesUrl(repoName) {
    if (repoName.toLowerCase() === `${githubUser}.github.io`) {
        return `https://${githubUser}.github.io/`;
    }
    return `https://${githubUser}.github.io/${repoName}/`;
}

function setStatus(message) {
    statusMessage.textContent = message;
}

function renderEndpoints(repos) {
    endpointsList.innerHTML = "";

    if (repos.length === 0) {
        const emptyNode = document.createElement("li");
        emptyNode.className = "empty-state";
        emptyNode.textContent = "No public repositories with GitHub Pages enabled were found.";
        endpointsList.appendChild(emptyNode);
        return;
    }

    repos.forEach((repo) => {
        const endpointUrl = buildPagesUrl(repo.name);
        const card = document.createElement("li");
        card.className = "endpoint-card";
        card.innerHTML = `
            <h3 class="endpoint-name">${repo.name}</h3>
            <a class="endpoint-url" href="${endpointUrl}" target="_blank" rel="noopener noreferrer">${endpointUrl}</a>
            <p class="endpoint-meta">
                Updated ${formatDate(repo.updated_at)} ·
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Repository</a>
            </p>
        `;
        endpointsList.appendChild(card);
    });
}

async function fetchAllPublicRepos() {
    let page = 1;
    const allRepos = [];

    while (true) {
        const response = await fetch(
            `https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated&page=${page}`
        );

        if (!response.ok) {
            throw new Error(`GitHub API error (${response.status})`);
        }

        const repos = await response.json();
        allRepos.push(...repos);

        if (repos.length < 100) {
            break;
        }

        page += 1;
    }

    return allRepos;
}

async function loadEndpoints() {
    setStatus("Loading endpoints...");
    refreshButton.disabled = true;

    try {
        const repos = await fetchAllPublicRepos();
        const pagesRepos = repos
            .filter((repo) => !repo.fork && repo.has_pages)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        renderEndpoints(pagesRepos);
        setStatus(`Loaded ${pagesRepos.length} endpoint${pagesRepos.length === 1 ? "" : "s"}.`);
    } catch (error) {
        endpointsList.innerHTML = "";
        const errorNode = document.createElement("li");
        errorNode.className = "empty-state";
        errorNode.textContent = "Unable to load endpoints right now. Please try again.";
        endpointsList.appendChild(errorNode);
        setStatus(error.message);
    } finally {
        refreshButton.disabled = false;
    }
}

refreshButton.addEventListener("click", loadEndpoints);
loadEndpoints();