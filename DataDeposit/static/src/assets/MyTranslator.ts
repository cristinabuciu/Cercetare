import * as languages from './translations'

class MyTranslator {

  readonly component: string;

  constructor(component: string = "None") {
    this.component = component;
  }

  static staticProperty: string = 'GB';

  useTranslation (value: string): string {

    switch(MyTranslator.staticProperty) {
      case "GB":
        const eng = languages.getEng();

        if (this.component) {
          if (value in eng[this.component]) {
            return eng[this.component][value];
          } 
        }

        if (value in eng["common"]) {
          return eng["common"][value];
        }

        return "Error: " + value;
      case "RO":
        const ro = languages.getRo();

        if (ro[this.component]) {
          if (value in ro[this.component]) {
            return ro[this.component][value];
          }
        }

        if (value in ro["common"]) {
          return ro["common"][value];
        }

        return "Error: " + value;
      default:
        console.log(MyTranslator.staticProperty);
        return "Error-Language-Not-Found";
    } 
    
  }
 
}

export default MyTranslator;
