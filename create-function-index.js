const fs = require('fs');
const fse = require('fs-extra');
const camelCase = require('camelcase');

module.exports = inputPath => {
  let index = `import firebase from 'firebase/app'\n\n`;
  fs.readdir(`${inputPath}/functions`, (err, files) => {
    index += files
      .map(file => {
        const filename = file.split('.')[0];
        const functionName = camelCase(filename);

        return `import { impl as ${functionName}Impl } from './functions/${filename}';`;
      })
      .join('\n');

    index +=
      '\n\n' +
      files
        .map(file => {
          const filename = file.split('.')[0];
          const functionName = camelCase(filename);

          return `
export async function ${functionName}(data?: Parameters<typeof ${functionName}Impl>[0]) {
  return (await firebase.functions().httpsCallable('${functionName}')(data)).data as ReturnType<typeof ${functionName}Impl>;
}`.trim();
        })
        .join('\n\n');

    fse.outputFileSync(`${inputPath}/index.ts`, index);
  });
};
