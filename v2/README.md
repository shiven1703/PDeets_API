
# Pdeets app poc API
The repository contains code for the backend API of planspiel poc app Version 2.

## Follow below steps to start the api locally
- Checkout branch to - development
- Change Dir to V2 folder
- Create a .env file and paste the content from https://pdeets.atlassian.net/wiki/spaces/PSPIEL/pages/9732097/Backend+Api+details?parentProduct=JSW&initialAllowedFeatures=byline-contributors.byline-extensions.page-comments.edit.delete.page-reactions&locale=en-US#ENV-file-(development)(create-an-.env-file-at-the-project-root)
- Run command : npm install
- Run command : npm run start-dev
- Api will start on port no 5000 at localhost
- URL: http://localhost:5000/v2/api-docs

## Commands
- npm run start-dev
- npm run start
- npm run lint
- npm run lint-fix

## Documentation details
- https://pdeets.atlassian.net/wiki/spaces/PSPIEL/pages/9732097/Backend+Api+details?parentProduct=JSW&initialAllowedFeatures=byline-contributors.byline-extensions.page-comments.edit.delete.page-reactions&locale=en-US#Endpoint-details

## Environment
- Node.js 18.x
- Express
- Eslint

## Development Notes
- Always run "npm run lint" && "npm run lint-fix" commands before pushing the commit. This is to mainly maintain overall code style in the project.