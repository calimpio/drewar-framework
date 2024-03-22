export namespace js {
    const utiljs: js = import('./js');
    export namespace Functions {
        export const regexSpesificator: (specStr: string,
            comparators: {
                [cmp: string]: string
            }) => RegExpMatchArray[]
            = utiljs.Functions.regexSpesificator;

        export const regexEmail: () => RegExp
    }
}




