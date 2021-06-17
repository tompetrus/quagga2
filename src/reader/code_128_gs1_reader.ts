import Code128Reader from './code_128_reader';
import { BarcodePosition, BarcodeInfo, Barcode } from './barcode_reader';

class Code128GS1Reader extends Code128Reader {
  FNC1 = 102;
  FNC_CHAR = String.fromCharCode(29); // the ASCII "group separator"

  //https://www.gs1.org/standards/barcodes/databar
  public decode(row?: Array<number>, start?: BarcodePosition): Barcode | null {
    const result = super.decode(row, start);
    if (!result) {
        return null;
    }

    if (!result.code) {
        return null;
    }

    let firstCode: BarcodeInfo

    if ( result.decodedCodes ) {
       firstCode = result?.decodedCodes[0] as BarcodeInfo

       if ( firstCode.code != this.FNC1 ) {
        return null;
      }

      result.code = result.decodedCodes.map( (code, idx) => {
        const code2: BarcodeInfo = code as BarcodeInfo

        if ( idx > 0 ) {
          if (code2.code === this.FNC1) {
            return this.FNC_CHAR
          } else {
            return super.translateCode(code2)
          }
        }
        return ""
      }).join('')
    }

    return result
  }
}

export default Code128GS1Reader