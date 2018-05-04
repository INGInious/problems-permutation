# Permutation task

This is a side project to test UI/UX from different packages for the students task view of a permutation problem.
Webpack is used to generate bundles of js files that will be then imported by the main project.

## Installation
Using npm:
```
npm install
```
Using yarn:
```
yarn install
```

## Development environment
Using npm:
```
npm start
```
Using yarn:
```
yarn run start
```

## Production build
Using npm:
```
npm run-script build
```
Using yarn:
```
yarn run build
```
This command will create a bundle file inside the plugin static file structure.

## API

The studio populates an object `problem` that is then communicated to the backend via python. 
The structure of this object is the following:

 + `[$PID]`: Problem id. Contains a lists of tables.
    + `[$tableId]`: Table id. `0` is misleading table.
        + `["tableName"]`: String containing table name
        + `["tableColor"]`: String containing table color in hex
        + `["text"]`: List of strings containing each row's text in order
        + `["text_id"]`: List of strings containing each row's text id in order
