import { cpuUsage } from "process";
import { FindOptions, Op } from "sequelize";
import { js } from "./js";


/**
 * String have to be encoded before will use.
 *   
 * `Comparators: Specificator.ComparatorEnum`
 * 
 * `Operators: Specificator.BoolOperatorEnum`
 * 
 * @example "field1=vale|field>=2"
 */
export type SpecEncodedURIComponentString = string;


/**
 * String have to be decoded before will use.
 *   
 * `Comparators: Specificator.ComparatorEnum`
 * 
 * `Operators: Specificator.BoolOperatorEnum`
 * 
 * @example "field1=vale|field>=2"
 */
export type SpecDecodedURIComponentString = string;

enum ComparatorEnum {
    eq = "=",
    ne = "!=",
    gte = ">=",
    lte = "<=",
    gt = ">",
    lt = "<",
    startWith = "~",
    endsWith = "\\+",
    similar = "#",
}

enum BoolOperatorEnum {
    and = ",",
    or = "|",
    andUnder = ",(",
    orUnder = "|(",
    topNextOr = ")|",
    topNextAnd = "),"
}


const ComparatorEnumToSequelizeOp = {
    [ComparatorEnum.eq]: Op.eq,
    [ComparatorEnum.ne]: Op.ne,
    [ComparatorEnum.gt]: Op.gt,
    [ComparatorEnum.lt]: Op.lt,
    [ComparatorEnum.gte]: Op.gte,
    [ComparatorEnum.lte]: Op.lte,
    [ComparatorEnum.startWith]: Op.startsWith,
    [ComparatorEnum.endsWith]: Op.endsWith,
    [ComparatorEnum.similar]: Op.like,
}

const StringToComparatorEnum: { [name: string]: ComparatorEnum } = {
    [ComparatorEnum.eq]: ComparatorEnum.eq,
    [ComparatorEnum.ne]: ComparatorEnum.ne,
    [ComparatorEnum.gt]: ComparatorEnum.gt,
    [ComparatorEnum.lt]: ComparatorEnum.lt,
    [ComparatorEnum.gte]: ComparatorEnum.gte,
    [ComparatorEnum.lte]: ComparatorEnum.lte,
    [ComparatorEnum.startWith]: ComparatorEnum.startWith,
    [ComparatorEnum.endsWith]: ComparatorEnum.endsWith,
    [ComparatorEnum.similar]: ComparatorEnum.similar,
}

const OperatorEnumoSequelizeOp = {
    [BoolOperatorEnum.and]: Op.and,
    [BoolOperatorEnum.or]: Op.or,
    [BoolOperatorEnum.topNextAnd]: Op.and,
    [BoolOperatorEnum.andUnder]: Op.and,
    [BoolOperatorEnum.orUnder]: Op.or,
    [BoolOperatorEnum.topNextOr]: Op.or,
}

const StringToOperatorEnum: { [name: string]: BoolOperatorEnum } = {
    [BoolOperatorEnum.topNextAnd]: BoolOperatorEnum.topNextAnd,
    [BoolOperatorEnum.andUnder]: BoolOperatorEnum.andUnder,
    [BoolOperatorEnum.topNextOr]: BoolOperatorEnum.topNextOr,
    [BoolOperatorEnum.orUnder]: BoolOperatorEnum.orUnder,
    [BoolOperatorEnum.and]: BoolOperatorEnum.and,
    [BoolOperatorEnum.or]: BoolOperatorEnum.or,
}

export class Exception {
    static NotMatchSpecificator = class {
        public message: string;
        constructor(message: string) {
            this.message = message;
        }
    }
}

export interface IBoolComparator {
    toString(): string;
}

export interface IBoolRootOperator {
    toString(): string
    toSequelizeFindOptions<T>(): FindOptions<T>
}

export interface IBoolOperator extends IBoolRootOperator {
    and(spec: IBoolComparator | IBoolOperator | null): IBoolOperator
    or(spec: IBoolComparator | IBoolOperator | null): IBoolOperator
    andGroup(andGroup: IBoolRootOperator[]): IBoolRootOperator
    orGroup(andGroup: IBoolRootOperator[]): IBoolRootOperator
}


class Comparation implements IBoolComparator {
    public field: string | number | symbol
    public comparator: ComparatorEnum
    public value: string

    constructor(field: string | number | symbol, comparator: ComparatorEnum, value: string) {
        this.field = field;
        this.comparator = comparator;
        this.value = value;
    }

    public static on(field: string | number | symbol,
        comparator: ComparatorEnum, value: string): IBoolComparator {
        return new Comparation(field, comparator, value);
    }

    public toString(): string {
        return this.field.toString() + this.comparator + this.value;
    }
}

class BoolOperator implements IBoolOperator {
    public _root: BoolOperator
    public comparation?: Comparation
    public opertator!: BoolOperatorEnum
    public next!: BoolOperator
    public top!: BoolOperator
    public under!: BoolOperator
    public treeAnd: IBoolRootOperator[] = []
    public treeOr: IBoolRootOperator[] = []

    constructor(comparation?: Comparation, root?: BoolOperator) {
        this.comparation = comparation
        this._root = root ? root : this;
    }

    public get root(): IBoolRootOperator {
        return this._root;
    }

    public toSequelizeFindOptions(): FindOptions {
        const where: any = {};
        const findType = function (value: any, comparator: ComparatorEnum): any {
            if (typeof value == "string") {
                if ((value.startsWith("{") && value.endsWith("}")) ||
                    (value.startsWith("[") && value.endsWith("]")))
                    return JSON.parse(value);
            }
            if (comparator == ComparatorEnum.similar) {
                return "%" + value + "%";
            }
            return value;
        }

        const builder = function (
            base: any,
            spec: BoolOperator,
            top?: BoolOperator, lastOp?: any[]): any | void {
            if (spec.comparation) {

                const comparation = spec.comparation;
                const current: any = {
                    [comparation.field]: {
                        [ComparatorEnumToSequelizeOp[comparation.comparator]]:
                            findType(comparation.value, comparation.comparator)
                    }
                }
                let next, underLast;
                let baseOperator: any[] = (spec.next ||
                    spec.under || spec.treeAnd.length || spec.treeOr.length) ?
                    (base[OperatorEnumoSequelizeOp[spec.opertator]] ?
                        base[OperatorEnumoSequelizeOp[spec.opertator]] :
                        base[OperatorEnumoSequelizeOp[spec.opertator]] = []) : null;
                if (!lastOp && !baseOperator && !top) {
                    base[comparation.field] = current[comparation.field];
                } else if (top) {
                    baseOperator.push(current);
                } else if (lastOp) {
                    lastOp.push(current);
                } else {
                    baseOperator.push(current);
                }
                if (spec.under) {
                    underLast = builder(current, spec.under, spec, baseOperator);
                    const nextOperator = spec.under.findNextOperator();
                    baseOperator = underLast[OperatorEnumoSequelizeOp[nextOperator]] ?
                        underLast[OperatorEnumoSequelizeOp[nextOperator]] :
                        underLast[OperatorEnumoSequelizeOp[spec.opertator]] = [];
                }
                if (spec.next) {
                    next = builder(base, spec.next, undefined, baseOperator);
                }
                if (spec.treeAnd.length) {
                    const sop: any[] = !base[Op.and] ? (base[Op.and] = []) : base[Op.and];
                    spec.treeAnd.forEach((iop) => {
                        const op = iop as BoolOperator;
                        if (op.comparation) {
                            const next = {}
                            sop.push(next);
                            builder(next, op)
                        }
                    })
                }
                if (spec.treeOr.length) {
                    const sop: any[] = !base[Op.or] ? (base[Op.or] = []) : base[Op.or];
                    spec.treeOr.forEach((iop) => {
                        const op = iop as BoolOperator;
                        if (op.comparation) {
                            const next = {}
                            sop.push(next);
                            builder(next, op)
                        }
                    })
                }
                if (!spec.next)
                    return current;
                if (next)
                    return next;
            }
        }
        builder(where, this.root as BoolOperator);

        return {
            where
        }
    }

    private newNext(second: Comparation) {
        this.next = new BoolOperator(second, this._root);
        return this.next;
    }

    public and(spec: IBoolComparator | BoolOperator | null): IBoolOperator {
        if (spec) {
            this.opertator = BoolOperatorEnum.and;
            if (spec instanceof BoolOperator) {
                spec._root = this._root;
                spec.top = this.top;
                this.next = spec;
                return spec;
            } else {
                if (!this.comparation) {
                    this.comparation = spec as Comparation;
                    return this;
                }
                return this.newNext(spec as Comparation);
            }
        }
        return this;
    }

    public or(spec: IBoolComparator | null): IBoolOperator {
        if (spec) {
            this.opertator = BoolOperatorEnum.or;
            if (spec instanceof BoolOperator) {
                spec._root = this._root;
                spec.top = this.top;
                this.next = spec;
                return spec;
            } else {
                if (!this.comparation) {
                    this.comparation = spec as Comparation;
                    return this;
                }
                return this.newNext(spec as Comparation);
            }
        }
        return this;
    }

    private initTree(tree: IBoolRootOperator[]) {
        tree.forEach((ope) => {
            const op = ope as BoolOperator;
            op._root = this._root
            op.top = this;
        })
    }

    public andGroup(andGroup: IBoolRootOperator[]) {
        this.treeAnd = andGroup;
        this.initTree(andGroup);
        return this._root as IBoolRootOperator;
    }

    public orGroup(orGroup: IBoolRootOperator[]) {
        this.treeAnd = orGroup;
        this.initTree(orGroup);
        return this._root as IBoolRootOperator;
    }



    private groupAndToString(): string {
        let result = "";
        if (!this.treeAnd.length) return result;
        result = this.opertator + "(";
        let firts = 0;
        this.treeAnd.forEach((op) => {
            const opi = (op as BoolOperator)
            opi._root = this._root;
            opi.top = this;
            result += (firts ? BoolOperatorEnum.and : "") + op.toString();
            firts = 1;
        })

        return result + ")";
    }

    private groupOrToString(): string {
        let result = "";
        if (!this.treeOr.length) return result;
        result = this.opertator + "(";
        let firts = 0;
        this.treeOr.forEach((op) => {
            const opi = (op as BoolOperator)
            opi._root = this._root;
            opi.top = this;
            result += (firts ? BoolOperatorEnum.or : "") + op.toString();
            firts = 1;
        })
        return result + ")";
    }

    public findNextOperator() {
        let result = this.opertator;
        let under = this.under;
        while (under) {
            result = under.opertator;
            under = under.next;
        }
        return result;
    }

    public toString(): string {
        if (this.comparation)
            return this.comparation.toString() +
                (this.groupAndToString() +
                    this.groupOrToString()) +
                (this.under ? this.opertator +
                    this.under.toString() : "") +
                (this.next ? (this.findNextOperator() + this.next.toString()) : "")
        return "";
    }

}

export class Specificator {

    public static Exception = Exception;
    public static Comparation = Comparation;
    public static BoolOperator = BoolOperator;
    public static ComparatorEnum = ComparatorEnum;
    public static BoolOperatorEnum = BoolOperatorEnum;

    static parse(specStr: SpecDecodedURIComponentString): IBoolRootOperator {
        const matches = js.Functions.regexSpesificator(specStr, StringToComparatorEnum);
        let spec: BoolOperator = new BoolOperator();
        if (matches)
            if (matches.length) {
                matches.forEach((value) => {
                    if (value && value.groups) {
                        const field = value.groups["field"];
                        const comparator = value.groups["comparator"];
                        const data = value.groups["value"];
                        const operator = value.groups["operator"];
                        if (field && comparator &&
                            (operator || operator === "") && (data || data === "")) {
                            const comparatorEnum = StringToComparatorEnum[comparator];
                            const operatorEnum = StringToOperatorEnum[operator];
                            if (spec.comparation) {
                                const newSpec = new BoolOperator(
                                    new Comparation(field, comparatorEnum, data),
                                    spec.root as BoolOperator
                                )

                                newSpec.top = spec.top;
                                if (spec.opertator == BoolOperatorEnum.and ||
                                    spec.opertator == BoolOperatorEnum.or) {
                                    spec.next = newSpec;
                                } else if (spec.opertator == BoolOperatorEnum.orUnder ||
                                    spec.opertator == BoolOperatorEnum.andUnder) {
                                    spec.under = newSpec;
                                    newSpec.top = spec;
                                } else if (spec.opertator == BoolOperatorEnum.topNextAnd ||
                                    spec.opertator == BoolOperatorEnum.topNextOr) {
                                    const aux = spec.top;
                                    if (!aux) throw new Exception.
                                        NotMatchSpecificator(
                                            `specification with error ${specStr} near to` +
                                            `${spec.comparation.field.toString()}` +
                                            ` in operator ${spec.opertator}.`
                                        )
                                    newSpec._root = aux._root;
                                    spec = aux;
                                    spec.next = newSpec;
                                }

                                spec = newSpec;

                            } else {
                                spec = new BoolOperator(
                                    Comparation.on(field, comparatorEnum, data) as Comparation
                                )


                            }
                            if (operatorEnum) {
                                spec.opertator = operatorEnum;
                            }

                        } else {
                            throw new Exception.
                                NotMatchSpecificator(`specification with error ${specStr}.`)
                        }
                    } else {
                        throw new Exception.
                            NotMatchSpecificator(`specification with error ${specStr}.`)
                    }
                })

            } else {
                throw new Exception.NotMatchSpecificator(`specification with error ${specStr}.`)
            }
        else {
            throw new Exception.NotMatchSpecificator(`specification with error ${specStr}.`)
        }

        return spec.root;
    }


    static equal<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.eq, value)
    }

    static no<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.ne, value)
    }

    static lessTo<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.lt, value)
    }

    static greatTo<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.gt, value)
    }

    static greatEqualTo<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.gte, value)
    }

    static lessEqualTo<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.lte, value)
    }

    static statsWith<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.startWith, value)
    }

    static endsWith<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.endsWith, value)
    }

    static similiarTo<T>(field: keyof T, value: any) {
        return Comparation.on(field, ComparatorEnum.similar, value)
    }

    static where(comparation: IBoolComparator | null): IBoolOperator {
        return new BoolOperator(comparation as Comparation);
    }

}


