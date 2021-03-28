import eng from "./translations/en.json"
import ro from "./translations/ro.json"

class MyTranslator {

  readonly language: string;
  readonly languages = ["eng", "ro"];
  readonly component: string;

  

  constructor(language: string = "eng", component: string = "None") {
    this.language = language;
    this.component = component;
  }

  static staticProperty: string = 'eng';

  useTranslation (value: string): string {
    debugger;
    switch(MyTranslator.staticProperty) {
      
    // switch(this.language) {
      case "eng":
        if (value in eng[this.component]) {
          return eng[this.component][value];
        }
        else if (value in eng["common"]) {
          return eng["common"][value]
        }
        else {
          return "Error-String-Not-Found";
        }

      case "ro":
        if (value in ro[this.component]) {
          return ro[this.component][value];
        }
        else {
          return "Error-String-Not-Found";
        }

      default:
        return "Error-Language-Not-Found";
    } 
    
  }
 
}

export default MyTranslator;
