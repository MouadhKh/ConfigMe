<h2 align="center"><img src="./static/pipeline-management.png" /> ConfigMe</h2>


This Azure DevOps extension automates infrastructure configurations(pipelines,docker images) on the basis of a template project. It offers also room for customization for advanced users.

#### Requirements

* NodeJS

#### Installation

1- Clone the repository

2- Install project dependencies

```bash
npm install
```

3- Edit `package.json` :

​	`publish-extension": "tfx extension publish --manifest-globs azure-devops-extension.json src/ConfigMe/**/*.json --token 4e4pjak7fc33sbfchfteyztul6wliy4szimid6saxwj62tkhzllq --share-with mouadhkhl"`

* Set your PAT token after `--token`

* Set your organization name after`--share-with`

4-Compile and automatically share your extension with an organization using the following command

```bash
 npm run build:dev && npm run publish-extension
```

5- Extension can be found under the Pipelines hub 

 ![configMe](https://user-images.githubusercontent.com/50799773/113874547-342ae300-97b6-11eb-9cab-d64992dab2de.png)


#### Usage

The configuration wizard is made as intuitive as possible. The user should understand the steps and their purposes. For the less intuitive parts Hints :grey_question: are here to help. 

*Step 1:* Authentication to Azure DevOps and Docker

*Step 2*: Import repositories

*Step 3:* Configure YAML files

*Step 4:* Configure Dockerfiles

*Step 5:* Create and trigger pipelines

