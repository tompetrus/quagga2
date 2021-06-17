import ArrayHelper from '../common/array_helper';

export enum BarcodeDirection {
    Forward = 1,
    Reverse = -1,
};

export type BarcodeReaderType = string;
export type BarcodeFormat = string;

export interface BarcodeReaderConfig {
    normalizeBarSpaceWidth?: boolean,
    supplements?: Array<BarcodeReaderType>,
};

export interface BarcodeCorrection {
    bar: number,
    space: number,
};

export interface BarcodePosition {
    start: number,
    startCounter?: number,
    end: number,
    endCounter?: number,
    error?: number,
};

export interface BarcodeInfo extends BarcodePosition {
    code: number,
    codeset?: number,
    correction?: BarcodeCorrection,
};

export interface Barcode {
    code: string,
    codeset?: number,
    correction?: BarcodeCorrection,
    decodedCodes?: Array<string | BarcodeInfo | BarcodePosition>,
    direction?: BarcodeDirection,
    end: number,
    endInfo?: BarcodePosition,
    format: BarcodeFormat,
    start: number,
    startInfo: BarcodePosition,
    supplement?: Barcode,
};

export abstract class BarcodeReader {
    _row: Array<number> = [];
    config: BarcodeReaderConfig = {};
    supplements: Array<BarcodeReader> = [];
    SINGLE_CODE_ERROR = 0;
    FORMAT: BarcodeFormat = 'unknown';
    CONFIG_KEYS: BarcodeReaderConfig = {};
    // TODO: should add ALPHABETH_STRING, ALPHABET, CHARACTER_ENCODINGS to base class, if they
    // are useful in most readers.

    public abstract decode(row?: Array<number>, start?: BarcodePosition | number): Barcode | null;

    static get Exception() {
        return {
            StartNotFoundException: 'Start-Info was not found!',
            CodeNotFoundException: 'Code could not be found!',
            PatternNotFoundException: 'Pattern could not be found!'
        };
    }

    constructor(config: BarcodeReaderConfig, supplements?: Array<BarcodeReader>) {

        this._row = [];
        this.config = config || {};
        if (supplements) {
            this.supplements = supplements;
        }
        return this;
    }

    protected _nextUnset(line: ReadonlyArray<number>, start: number = 0): number {
        for (let i = start; i < line.length; i++) {
            if (!line[i]) return i;
        }
        return line.length;
    }

    protected _matchPattern(counter: ReadonlyArray<number>, code: ReadonlyArray<number>, maxSingleError?: number): number {
        let error = 0;
        let singleError = 0;
        let sum = 0;
        let modulo = 0;
        let barWidth = 0;
        let count = 0;
        let scaled = 0;

        maxSingleError = maxSingleError || this.SINGLE_CODE_ERROR || 1;

        for (let i = 0; i < counter.length; i++) {
            sum += counter[i];
            modulo += code[i];
        }
        if (sum < modulo) {
            return Number.MAX_VALUE;
        }

        barWidth = sum / modulo;
        maxSingleError *= barWidth;
        for (let i = 0; i < counter.length; i++) {
            count = counter[i];
            scaled = code[i] * barWidth;
            singleError = Math.abs(count - scaled) / scaled;
            if (singleError > maxSingleError) {
                return Number.MAX_VALUE;
            }
            error += singleError;
        }
        return error / modulo;
    }

    protected _nextSet(line: ReadonlyArray<number>, offset: number = 0) {
        for (let i = offset; i < line.length; i++) {
            if (line[i]) return i;
        }
        return line.length;
    }

    protected _correctBars(counter: Array<number>, correction: number, indices: Array<number>) {
        let length = indices.length;
        let tmp = 0;
        while (length--) {
            tmp = counter[indices[length]] * (1 - ((1 - correction) / 2));
            if (tmp > 1) {
                counter[indices[length]] = tmp;
            }
        }
    }

    public decodePattern(pattern: Array<number>) {
        // console.warn('* decodePattern', pattern);
        this._row = pattern;
        // console.warn('* decodePattern calling decode', typeof this, this.constructor, this.FORMAT, JSON.stringify(this));
        let result = this.decode();
        // console.warn('* first result=', result);
        if (result === null) {
            this._row.reverse();
            result = this.decode();
            // console.warn('* reversed result=', result);
            if (result) {
                result.direction = BarcodeDirection.Reverse;
                result.start = this._row.length - result.start;
                result.end = this._row.length - result.end;
            }
        } else {
            result.direction = BarcodeDirection.Forward;
        }
        if (result) {
            result.format = this.FORMAT;
        }
        // console.warn('* returning', result);
        return result;
    }

    protected _matchRange(start: number, end: number, value: number) {
        var i;
        start = start < 0 ? 0 : start;
        for (i = start; i < end; i++) {
            if (this._row[i] !== value) {
                return false;
            }
        }
        return true;
    }

    protected _fillCounters(offset: number = this._nextUnset(this._row), end: number = this._row.length, isWhite: boolean = true) {
        const counters: Array<number> = [];
        let counterPos = 0;
        counters[counterPos] = 0;
        for (let i = offset; i < end; i++) {
            if (this._row[i] ^ (isWhite ? 1 : 0)) {
                counters[counterPos]++;
            } else {
                counterPos++;
                counters[counterPos] = 1;
                isWhite = !isWhite;
            }
        }
        return counters;
    }

    protected _toCounters(start: number, counters: Uint16Array | Array<number>) {
        const numCounters = counters.length;
        const end = this._row.length;
        let isWhite = !this._row[start];
        let counterPos = 0;

        ArrayHelper.init(counters, 0);
        for (let i = start; i < end; i++) {
            if (this._row[i] ^ (isWhite ? 1 : 0)) {
                counters[counterPos]++;
            } else {
                counterPos++;
                if (counterPos === numCounters) {
                    break;
                } else {
                    counters[counterPos] = 1;
                    isWhite = !isWhite;
                }
            }
        }
        return counters;
    }
}

export default BarcodeReader;
