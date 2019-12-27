# firebase-functions-declarations

This simple tool creates declaration files (.d.ts) for your Firebase Functions.

When calling a firebase function you have no guarantee for the functions return value. This tool tries solving that.

When using this tool, instead of writing:

```js
const x = (await firebase.functions().httpsCallable('myFunction')(someData)).data
```

And not knowing what x is, you write:

```js
import { myFunction } from './firebase-functions';

// ...

const x = await myFunction(someData);
```

And x will be typed to be whatever `myFunction` returns!

**Important:** Read the prerequisites.

## Why?

So that in your app's code you can enjoy type safety when working with functions.

## How it works

Using `tsc` (on functions/src/index.ts), this tool creates a declaration files for each one of your functions.

It then creates an index.ts, where per-each Firebase Function you declared, an exported function is created, that function uses `firebase.functions().httpCallback` to dispatch a call to the Firebase function and the function's return value type is set to be the return value type of the Firebase Function.

## How to set it up

Inside your project's root folder, run:

```
yarn add firebase-functions-declarations
```

Then add the following script to your package.json's scripts:

```json
  "scripts": {
    "create-functions-declarations": "createFunctionsDeclarations --output ./src/firebase-functions"
  }
```

Where `./src/firebase-functions` is the path where you want the declarations and index files created.

## Prerequisites

Because of several limitations, for this tool to work you have to declare your Firebase Function to be a module that `export default`s the return value of `functions.https.onCall` _and also_ exports a function named `impl` that is the function passed to `functions.https.onCall`.

For example:

```js
// ... import statements

export async function impl(
  data: any,
  context: functions.https.CallableContext,
) {
  // firebase function body...
}

export default functions.https.onCall(impl);
```
