# INGInious-permutation-plugin

Permutate a list of textual elements.

## Installation

```
yarnInstalled = which('yarn') != None
npmInstalled = which('npm') != None

if not yarnInstalled and not npmInstalled:
    print("To build this plugin you require to have installed node.")
    pass
elif not yarnInstalled:
    print("It is recommended to have installed yarn to build this project.")

if not '--no-build' in argv and not '--dev' in argv:
    ui_directory = 'inginious-problems-permutation/static/ui'
    if not os.path.exists(ui_directory):
        os.makedirs(ui_directory)

    if yarnInstalled:
        system("cd permutation-task && yarn install")
        system("cd permutation-studio && yarn install")
    elif npmInstalled:
        system("cd permutation-task && npm install")
        system("cd permutation-studio && npm install")

    if yarnInstalled:
        system("cd permutation-task && yarn run build")
        system("cd permutation-studio && yarn run build")
    elif npmInstalled:
        system("cd permutation-task && npm run-script build")
        system("cd permutation-studio && npm run-script build")
if '--no-build' in argv:
    argv.remove("--no-build")

if '--dev' in argv:
    if yarnInstalled:
        system("cd permutation-task && yarn install")
        system("cd permutation-studio && yarn install")
    elif npmInstalled:
        system("cd permutation-task && npm install")
        system("cd permutation-studio && npm install")

    if yarnInstalled:
        system("cd permutation-task && yarn run build-qa")
        system("cd permutation-studio && yarn run build-qa")
    elif npmInstalled:
        system("cd permutation-task && npm run-script build-qa")
        system("cd permutation-studio && npm run-script build-qa")

    argv.remove("--dev")
```

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
