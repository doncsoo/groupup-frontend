import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanModify'
})
export class BooleanModifyPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    if(value === true) return "IGEN"
    else return "NEM"
  }

}
