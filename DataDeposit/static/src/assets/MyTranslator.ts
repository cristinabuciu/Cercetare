import eng from "./translations/en.json"
import ro from "./translations/ro.json"

class MyTranslator {

  readonly language: string;
  readonly languages = ["GB", "RO"];
  readonly component: string;

  

  constructor(language: string = "GB", component: string = "None") {
    this.language = language;
    this.component = component;
  }

  static staticProperty: string = 'GB';

  useTranslation (value: string): string {
    debugger;
    switch(MyTranslator.staticProperty) {
      
    // switch(currentLanguage) {
      case "GB":
        if (this.component) {
          if (value in eng[this.component]) {
            return eng[this.component][value];
          }
          else if (value in eng["common"]) {
            return eng["common"][value]
          }
        }
        return "Error-String-Not-Found";
      case "RO":
        if (ro[this.component]) {
          if (value in ro[this.component]) {
            return ro[this.component][value];
          } else if (value in ro["common"]) {
            return eng["common"][value]
          }
          
        }
        return "Error-String-Not-Found";

      default:
        return "Error-Language-Not-Found";
    } 
    
  }
 
}

export default MyTranslator;
