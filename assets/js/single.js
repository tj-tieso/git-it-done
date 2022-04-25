var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function () {
  // get the repo name
  var queryString = document.location.search;
  var repoName = queryString.split("=")[1];

  // if the repo name exists, run getRepoIssues()
  if (repoName) {
    repoNameEl.textContent = repoName;
    getRepoIssues(repoName);
    // if repo name does not exist, redirect to index.html
  } else {
    document.location.replace("./index.html");
  }
};

var getRepoIssues = function (repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  fetch(apiUrl).then(function (response) {
    // request was successful
    if (response.ok) {
      response.json().then(function (data) {
        // pass response data to DOM function
        displayIssues(data);

        // check if api has more than 30 (paginated) issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
      // request failed
    } else {
      console.log(response);
      document.location.replace("./index.html");
    }
  });
};

var displayIssues = function (issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "this repo has no open issues!";
    return;
  }

  // loop over given issues
  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issues on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    //append to container
    issueEl.appendChild(titleEl);

    // create type element
    var typeEl = document.createElement("span");

    //check if issue is an acutal issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    //append type to issue container
    issueEl.appendChild(typeEl);

    // appened entire issue to container
    issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function (repo) {
  // add text to warning container
  limitWarningEl.textContent = "too see more than 30 issues, visit ";

  //create link EL
  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  //append warning to warning container
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
getRepoIssues();
