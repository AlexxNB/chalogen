# chalogen
CHANGELOG.md generator CLI and Github Action

Keeping [`CAHNGELOG.md`](https://github.com/AlexxNB/chalogen/blob/master/CHANGELOG.md) file in your repository is very important to inform users what happened in your code from version to version. Doing it manually is hard work, but using **Chalogen** you will get pretty changelog based on your commits. 

* Parse [conventional commits](https://www.conventionalcommits.org/)
* Supports version commits like from `npm version` command.
* Available as CLI tool or GitHub Action
* Supports tags named in [semver](https://semver.org) format
* Supports Git emojis

## CLI 

Install globaly with:
```sh
npm i -g chalogen
```

Then run in your local repositroy folder:
```sh
chalogen
```
And you will see new CHANGELOG.md file with versions history.

> It is important to have full commits history in your local repository. 

Look for additional parameters with `chalogen --help` command.


## GitHub Action

It is good idea to run **Chalogen** in GitHub Action to have always actual changelog file in your repository. Just add and commit file `.github/workflows/generate_changelog.yml` in your GitHub repository:

> If you installed CLI you can just run `chalogen action` to put exactly same file in your current repo.

```yml
name: Generate Changelog

on:
  push:
    branches: [ main, master]

jobs:
  changelog:
    name: Update Changelog
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Update Changelog
        uses: AlexxNB/chalogen@master
        with:
          title: My project changelog 
      - name: Commit Changelog to repository
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'docs(Changelog): Update Changelog'
          file_pattern: CHANGELOG.md
```

### Input parameters

* **title** – Title of changelog. Default: `Changelog`
* **list** – Conventional types list to include in changelog. Default: `feat,fix,perf,docs,other`
* **date** – Date format; use only %Y,%M and %D placeholders. Default: `%Y-%M-%D`
* **file** – Filename of the changelog file. Default: `CHANGELOG.md`
* **version** – Show only specified version. Default: `false`
* **unreleased** – Show only unreleased commits. Default: `false`
* **hide-unreleased** – Hide unreleased section. Default: `false`
* **hide-title** – Hide title of changelog. Default: `false`
* **hide-body** – Hide body of commit's messages. Default: `false`

### Output parameters

* **changelog** – changelog history in markdown format, which may be used in next workflow steps(ex. as release body).