import { remove } from './fnc';

// Setup logger





(async () => {
    try {
        // Remove current build
        await remove('./src/public/dist/');        

    } catch (err) {
        console.log(err);        
    }
})();


