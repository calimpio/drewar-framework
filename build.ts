/**
 * Remove old files, copy front-end ones.
 */

import fs from 'fs-extra';
import Logger from 'jet-logger';
import childProcess from 'child_process';

// Setup logger





(async () => {
    try {
        // Remove current build
        await remove('./dist/');
        // Copy front-end files
        await copy('./src/public', './dist/public');

        // Copy back-end files
        await exec('tsc --build tsconfig.prod.json', './').then(async () => {
            await remove('./dist/build.js')            
            await copy('./src/database/', './dist/database/');
            await copy('./src/.env', './dist/.env');
            await copy('./src/util/js/', './dist/util/js/');
            await copy('./src/view/', './dist/view/');
        })


    } catch (err) {
       console.log(err);       
    }
})();


function remove(loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.remove(loc, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function copy(src: string, dest: string): Promise<void> {
    return new Promise((res, rej) => {
        return fs.copy(src, dest, (err) => {
            return (!!err ? rej(err) : res());
        });
    });
}


function exec(cmd: string, loc: string): Promise<void> {
    return new Promise((res, rej) => {
        return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
            if (!!stdout) {
                
            }
            if (!!stderr) {
                
            }
            return (!!err ? rej(err) : res());
        });
    });
}
