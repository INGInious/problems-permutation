# INGInious-permutation-plugin

Permutate a list of textual elements.

## Installation

To refresh js in `inginious-problems-permutation/static/ui` :
```
cd permutation-task && npm install
cd permutation-studio && npm install
cd permutation-task && npm run-script build
cd permutation-studio && npm run-script build
```
Replace `build` by `build-qa` for a dev build.

```zsh
pip3 install git+https://github.com/napsta32/INGInious-problems-permutation
```
Then add the following plugin entry in your ```configuration.yaml```:
```yaml
plugins:
  - plugin_module: "inginious-problems-permutation"
```

## About

This project contains 2 side-projects where UI/UX is tested separetly: permutation-task and permutation-studio. Both projects pack their code into the main plugin project using webpack. When building the plugin with the `setup.py`, a flow verification and a webpack is automatically done using `yarn` or `npm` module managers. Webpack generates two bundles, one for each project, inside `inginious-problems-permutation/static/ui`. If the directory doesn't exists, the setup script creates one.

To test specific features, inside each side-project there is a dev environment that can be tested running `yarn start` or `npm start`. It has some UI test cases to test in a web browser.

## Missing features

- Sort methods:
  - Random shuffle (future)
  - Especific order (future)
- Automatic grading (future)
