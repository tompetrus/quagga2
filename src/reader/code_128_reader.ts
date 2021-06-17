import BarcodeReader, { BarcodeCorrection, BarcodePosition, Barcode, BarcodeInfo } from './barcode_reader';

class Code128Reader extends BarcodeReader {
    CODE_SHIFT = 98;
    CODE_C = 99;
    CODE_B = 100;
    CODE_A = 101;
    START_CODE_A = 103;
    START_CODE_B = 104;
    START_CODE_C = 105;
    STOP_CODE = 106;
    CODE_PATTERN = [
            [2, 1, 2, 2, 2, 2],
            [2, 2, 2, 1, 2, 2],
            [2, 2, 2, 2, 2, 1],
            [1, 2, 1, 2, 2, 3],
            [1, 2, 1, 3, 2, 2],
            [1, 3, 1, 2, 2, 2],
            [1, 2, 2, 2, 1, 3],
            [1, 2, 2, 3, 1, 2],
            [1, 3, 2, 2, 1, 2],
            [2, 2, 1, 2, 1, 3],
            [2, 2, 1, 3, 1, 2],
            [2, 3, 1, 2, 1, 2],
            [1, 1, 2, 2, 3, 2],
            [1, 2, 2, 1, 3, 2],
            [1, 2, 2, 2, 3, 1],
            [1, 1, 3, 2, 2, 2],
            [1, 2, 3, 1, 2, 2],
            [1, 2, 3, 2, 2, 1],
            [2, 2, 3, 2, 1, 1],
            [2, 2, 1, 1, 3, 2],
            [2, 2, 1, 2, 3, 1],
            [2, 1, 3, 2, 1, 2],
            [2, 2, 3, 1, 1, 2],
            [3, 1, 2, 1, 3, 1],
            [3, 1, 1, 2, 2, 2],
            [3, 2, 1, 1, 2, 2],
            [3, 2, 1, 2, 2, 1],
            [3, 1, 2, 2, 1, 2],
            [3, 2, 2, 1, 1, 2],
            [3, 2, 2, 2, 1, 1],
            [2, 1, 2, 1, 2, 3],
            [2, 1, 2, 3, 2, 1],
            [2, 3, 2, 1, 2, 1],
            [1, 1, 1, 3, 2, 3],
            [1, 3, 1, 1, 2, 3],
            [1, 3, 1, 3, 2, 1],
            [1, 1, 2, 3, 1, 3],
            [1, 3, 2, 1, 1, 3],
            [1, 3, 2, 3, 1, 1],
            [2, 1, 1, 3, 1, 3],
            [2, 3, 1, 1, 1, 3],
            [2, 3, 1, 3, 1, 1],
            [1, 1, 2, 1, 3, 3],
            [1, 1, 2, 3, 3, 1],
            [1, 3, 2, 1, 3, 1],
            [1, 1, 3, 1, 2, 3],
            [1, 1, 3, 3, 2, 1],
            [1, 3, 3, 1, 2, 1],
            [3, 1, 3, 1, 2, 1],
            [2, 1, 1, 3, 3, 1],
            [2, 3, 1, 1, 3, 1],
            [2, 1, 3, 1, 1, 3],
            [2, 1, 3, 3, 1, 1],
            [2, 1, 3, 1, 3, 1],
            [3, 1, 1, 1, 2, 3],
            [3, 1, 1, 3, 2, 1],
            [3, 3, 1, 1, 2, 1],
            [3, 1, 2, 1, 1, 3],
            [3, 1, 2, 3, 1, 1],
            [3, 3, 2, 1, 1, 1],
            [3, 1, 4, 1, 1, 1],
            [2, 2, 1, 4, 1, 1],
            [4, 3, 1, 1, 1, 1],
            [1, 1, 1, 2, 2, 4],
            [1, 1, 1, 4, 2, 2],
            [1, 2, 1, 1, 2, 4],
            [1, 2, 1, 4, 2, 1],
            [1, 4, 1, 1, 2, 2],
            [1, 4, 1, 2, 2, 1],
            [1, 1, 2, 2, 1, 4],
            [1, 1, 2, 4, 1, 2],
            [1, 2, 2, 1, 1, 4],
            [1, 2, 2, 4, 1, 1],
            [1, 4, 2, 1, 1, 2],
            [1, 4, 2, 2, 1, 1],
            [2, 4, 1, 2, 1, 1],
            [2, 2, 1, 1, 1, 4],
            [4, 1, 3, 1, 1, 1],
            [2, 4, 1, 1, 1, 2],
            [1, 3, 4, 1, 1, 1],
            [1, 1, 1, 2, 4, 2],
            [1, 2, 1, 1, 4, 2],
            [1, 2, 1, 2, 4, 1],
            [1, 1, 4, 2, 1, 2],
            [1, 2, 4, 1, 1, 2],
            [1, 2, 4, 2, 1, 1],
            [4, 1, 1, 2, 1, 2],
            [4, 2, 1, 1, 1, 2],
            [4, 2, 1, 2, 1, 1],
            [2, 1, 2, 1, 4, 1],
            [2, 1, 4, 1, 2, 1],
            [4, 1, 2, 1, 2, 1],
            [1, 1, 1, 1, 4, 3],
            [1, 1, 1, 3, 4, 1],
            [1, 3, 1, 1, 4, 1],
            [1, 1, 4, 1, 1, 3],
            [1, 1, 4, 3, 1, 1],
            [4, 1, 1, 1, 1, 3],
            [4, 1, 1, 3, 1, 1],
            [1, 1, 3, 1, 4, 1],
            [1, 1, 4, 1, 3, 1],
            [3, 1, 1, 1, 4, 1],
            [4, 1, 1, 1, 3, 1],
            [2, 1, 1, 4, 1, 2],
            [2, 1, 1, 2, 1, 4],
            [2, 1, 1, 2, 3, 2],
            [2, 3, 3, 1, 1, 1, 2],
        ];
    SINGLE_CODE_ERROR = 0.64;
    AVG_CODE_ERROR = 0.30;
    FORMAT = 'code_128';
    MODULE_INDICES = { bar: [0, 2, 4], space: [1, 3, 5] };

    protected _decodeCode(start: number, correction?: BarcodeCorrection): BarcodeInfo | null {
        const bestMatch = {
            error: Number.MAX_VALUE,
            code: -1,
            start: start,
            end: start,
            correction: {
                bar: 1,
                space: 1,
            },
        };
        let counter = [0, 0, 0, 0, 0, 0];
        const offset = start;
        let isWhite = !this._row[offset];
        let counterPos = 0;

        for (let i = offset; i < this._row.length; i++) {
            if (this._row[i] ^ (isWhite ? 1 : 0)) {
                counter[counterPos]++;
            } else {
                if (counterPos === counter.length - 1) {
                    if (correction) {
                        this._correct(counter, correction);
                    }
                    for (let code = 0; code < this.CODE_PATTERN.length; code++) {
                        const error = this._matchPattern(counter, this.CODE_PATTERN[code]);
                        if (error < bestMatch.error) {
                            bestMatch.code = code;
                            bestMatch.error = error;
                        }
                    }
                    bestMatch.end = i;
                    if (bestMatch.code === -1 || bestMatch.error > this.AVG_CODE_ERROR) {
                        return null;
                    }
                    if (this.CODE_PATTERN[bestMatch.code]) {
                        bestMatch.correction.bar = this.calculateCorrection(
                            this.CODE_PATTERN[bestMatch.code], counter,
                            this.MODULE_INDICES.bar);
                        bestMatch.correction.space = this.calculateCorrection(
                            this.CODE_PATTERN[bestMatch.code], counter,
                            this.MODULE_INDICES.space);
                    }
                    return bestMatch;
                } else {
                    counterPos++;
                }
                counter[counterPos] = 1;
                isWhite = !isWhite;
            }
        }
        return null;
    };

    protected _correct(counter: Array<number>, correction: BarcodeCorrection) {
        this._correctBars(counter, correction.bar, this.MODULE_INDICES.bar);
        this._correctBars(counter, correction.space, this.MODULE_INDICES.space);
    };

    // TODO: _findStart and decodeCode share similar code, can we re-use some?
    protected _findStart(): BarcodeInfo | null {
        const counter = [0, 0, 0, 0, 0, 0];
        const offset = this._nextSet(this._row);
        const bestMatch = {
            error: Number.MAX_VALUE,
            code: -1,
            start: 0,
            end: 0,
            correction: {
                bar: 1,
                space: 1,
            },
        };
        let isWhite = false;
        let counterPos = 0;

        for (let i = offset; i < this._row.length; i++) {
            if (this._row[i] ^ (isWhite ? 1 : 0)) {
                counter[counterPos]++;
            } else {
                if (counterPos === counter.length - 1) {
                    const sum = counter.reduce((prev, next) => prev + next, 0);
                    for (let code = this.START_CODE_A; code <= this.START_CODE_C; code++) {
                        const error = this._matchPattern(counter, this.CODE_PATTERN[code]);
                        if (error < bestMatch.error) {
                            bestMatch.code = code;
                            bestMatch.error = error;
                        }
                    }
                    if (bestMatch.error < this.AVG_CODE_ERROR) {
                        bestMatch.start = i - sum;
                        bestMatch.end = i;
                        bestMatch.correction.bar = this.calculateCorrection(
                            this.CODE_PATTERN[bestMatch.code], counter,
                            this.MODULE_INDICES.bar);
                        bestMatch.correction.space = this.calculateCorrection(
                            this.CODE_PATTERN[bestMatch.code], counter,
                            this.MODULE_INDICES.space);
                        return bestMatch;
                    }

                    for (let j = 0; j < 4; j++) {
                        counter[j] = counter[j + 2];
                    }
                    counter[4] = 0;
                    counter[5] = 0;
                    counterPos--;
                } else {
                    counterPos++;
                }
                counter[counterPos] = 1;
                isWhite = !isWhite;
            }
        }
        return null;
    };

    public translateCode(code:BarcodeInfo) : string | null {
        let str = null;
        switch (code.codeset) {
            case this.CODE_A:
                if (code.code < 64) {
                    str = String.fromCharCode(32 + code.code);
                } else if (code.code < 96) {
                    str = String.fromCharCode(code.code - 64);
                }
                break;
            case this.CODE_B:
                if (code.code < 96) {
                    str = String.fromCharCode(32 + code.code);
                }
                break;
            case this.CODE_C:
                if (code.code < 100) {
                    str = code.code < 10 ? ('0' + code.code) : ('' + code.code);
                }
                break;
            }
        return str;
    }

    public decode(row?: Array<number>, start?: BarcodePosition): Barcode | null {
        const startInfo = this._findStart();
        if (startInfo === null) {
            return null;
        }
        // var self = this,
        //     done = false,
        //     result = [],
        //     multiplier = 0,
        //     checksum = 0,
        //     codeset,
        //     rawResult = [],
        //     decodedCodes = [],
        //     shiftNext = false,
        //     unshift,
        //     removeLastCharacter = true;

        let code: BarcodeInfo | null = {
            code: startInfo.code,
            start: startInfo.start,
            end: startInfo.end,
            correction: {
                bar: startInfo.correction!.bar,
                space: startInfo.correction!.space,
            },
        };
        const decodedCodes: BarcodeInfo[] = [];

        let codeset = ((c: number) => {
            switch (c) {
                case this.START_CODE_A:
                    return this.CODE_A;
                case this.START_CODE_B:
                    return this.CODE_B;
                case this.START_CODE_C:
                    return this.CODE_C;
                default:
                    return undefined;
            }
        })(code.code);

        code.codeset = codeset;
        decodedCodes.push(code);
        let checksum = code.code;
        let done = false;
        let shiftNext = false;
        let unshift = shiftNext;
        let removeLastCharacter = true;
        let multiplier = 0;
        let rawResult: Array<number> = [];

        while (!done) {
            unshift = shiftNext;
            shiftNext = false;
            code = this._decodeCode(code!.end, code!.correction);
            if (code !== null) {
                if (code.code !== this.STOP_CODE) {
                    removeLastCharacter = true;
                }

                if (code.code !== this.STOP_CODE) {
                    rawResult.push(code.code);
                    multiplier++;
                    checksum += multiplier * code.code;
                }

                code.codeset = codeset;
                decodedCodes.push(code);

                switch (codeset) {
                case this.CODE_A:
                    if (code.code > 96) {
                        if (code.code !== this.STOP_CODE) {
                            removeLastCharacter = false;
                        }
                        switch (code.code) {
                        case this.CODE_SHIFT:
                            shiftNext = true;
                            codeset = this.CODE_B;
                            break;
                        case this.CODE_B:
                            codeset = this.CODE_B;
                            break;
                        case this.CODE_C:
                            codeset = this.CODE_C;
                            break;
                        case this.STOP_CODE:
                            done = true;
                            break;
                        }
                    }
                    break;
                case this.CODE_B:
                    if (code.code > 96) {
                        if (code.code !== this.STOP_CODE) {
                            removeLastCharacter = false;
                        }
                        switch (code.code) {
                            case this.CODE_SHIFT:
                                shiftNext = true;
                                codeset = this.CODE_A;
                                break;
                            case this.CODE_A:
                                codeset = this.CODE_A;
                                break;
                            case this.CODE_C:
                                codeset = this.CODE_C;
                                break;
                            case this.STOP_CODE:
                                done = true;
                                break;
                        }
                    }
                    break;
                case this.CODE_C:
                    if (code.code > 100) {
                        if (code.code !== this.STOP_CODE) {
                            removeLastCharacter = false;
                        }
                        switch (code.code) {
                        case this.CODE_A:
                            codeset = this.CODE_A;
                            break;
                        case this.CODE_B:
                            codeset = this.CODE_B;
                            break;
                        case this.STOP_CODE:
                            done = true;
                            break;
                        }
                    }
                    break;
                }
            } else {
                done = true;
            }
            if (unshift) {
                codeset = codeset === this.CODE_A ? this.CODE_B : this.CODE_A;
            }
        }

        if (code === null) {
            return null;
        }

        code.end = this._nextUnset(this._row, code.end);
        if (!this._verifyTrailingWhitespace(code)){
            return null;
        }

        checksum -= multiplier * rawResult[rawResult.length - 1];
        if (checksum % 103 !== rawResult[rawResult.length - 1]) {
            return null;
        }

        let resultCodes: Array<BarcodeInfo> = []

        // remove last code from result (checksum)
        if (removeLastCharacter) {
            resultCodes = decodedCodes.slice(0, -1)
        } else {
            resultCodes = decodedCodes
        }

        const result: string =
            resultCodes
            .map(code => this.translateCode(code))
            .filter(val => !!val)
            .join('')
        ;

        if (!result.length) {
            return null;
        }


        return {
            code: result,
            start: startInfo.start,
            end: code.end,
            codeset: codeset as number,
            startInfo: startInfo,
            decodedCodes: decodedCodes,
            endInfo: code,
            format: this.FORMAT,
        };
    };

    protected _verifyTrailingWhitespace(endInfo: BarcodeInfo): BarcodeInfo | null {

        var self = this,
            trailingWhitespaceEnd;

        trailingWhitespaceEnd = endInfo.end + ((endInfo.end - endInfo.start) / 2);
        if (trailingWhitespaceEnd < self._row.length) {
            if (self._matchRange(endInfo.end, trailingWhitespaceEnd, 0)) {
                return endInfo;
            }
        }
        return null;
    };


    public calculateCorrection(expected: ReadonlyArray<number>, normalized: ReadonlyArray<number>, indices: ReadonlyArray<number>): number {
        var length = indices.length,
            sumNormalized = 0,
            sumExpected = 0;

        while (length--) {
            sumExpected += expected[indices[length]];
            sumNormalized += normalized[indices[length]];
        }
        return sumExpected / sumNormalized;
    }
}

export default Code128Reader;
