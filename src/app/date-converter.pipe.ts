import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateConverter'
})
export class DateConverterPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.replace("T"," ").substring(0,19)
  }

}
