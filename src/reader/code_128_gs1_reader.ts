import Code128Reader from './code_128_reader';
import { BarcodePosition, BarcodeInfo, Barcode } from './barcode_reader';

class Code128GS1Reader extends Code128Reader {
  FNC1 = 102;
  FNC_CHAR = String.fromCharCode(29); // the ASCII "group separator"

  //https://www.gs1.org/standards/barcodes/databar
  public decode(row?: Array<number>, start?: BarcodePosition): Barcode | null {
    console.log('code128gs1reader - decode - start');
    const result = super.decode(row, start);
    console.log('super.decode result', result);

    if (!result) {
        return null;
    }

    if (!result.code) {
        return null;
    }

    let firstCode: BarcodeInfo

    if ( result.decodedCodes ) {
      console.log('result.decodedCodes exists');

      firstCode = result?.decodedCodes[0] as BarcodeInfo
      console.log('firstCode', firstCode);

      if ( firstCode.code != this.FNC1 ) {
        console.log('firstCode.code is NOT FNC1');
        return null;
      }

      console.log('map the decodedCodes...')
      result.code = result.decodedCodes.map( (code, idx) => {
        const code2: BarcodeInfo = code as BarcodeInfo

        console.log('code map iteration ', idx, ' code2: ', code2);

        if ( idx > 0 ) {
          console.log('idx > 0');
          if (code2.code === this.FNC1) {
            console.log('FNC1');
            return this.FNC_CHAR
          } else {
            console.log('not FNC1 -> ', code2.code)
            return super.translateCode(code2)
          }
        }
        return ""
      }).join('')
    }
    console.log('result', result);

    return result
  }
}

export default Code128GS1Reader