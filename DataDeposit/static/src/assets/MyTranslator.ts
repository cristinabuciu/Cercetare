import eng from "./translations/en.json"
import ro from "./translations/ro.json"

class MyTranslator {

  readonly languages = ["GB", "RO"];
  readonly component: string;

  constructor(component: string = "None") {
    this.component = component;
  }

  static staticProperty: string = 'GB';

  useTranslation (value: string): string {
    debugger;
    switch(MyTranslator.staticProperty) {
      case "GB":
        if (this.component) {
          if (value in eng[this.component]) {
            return eng[this.component][value];
          } 
        }

        if (value in eng["common"]) {
          return eng["common"][value];
        }

        return "Error-String-Not-Found";
      case "RO":
        if (ro[this.component]) {
          if (value in ro[this.component]) {
            return ro[this.component][value];
          }
        }

        if (value in ro["common"]) {
          return ro["common"][value];
        }

        return "Error-String-Not-Found";
      default:
        console.log(MyTranslator.staticProperty);
        return "Error-Language-Not-Found";
    } 
    
  }
 
}

export default MyTranslator;
