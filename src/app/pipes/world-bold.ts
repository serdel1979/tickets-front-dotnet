import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstWordBold' })
export class FirstWordBoldPipe implements PipeTransform {
  transform(value: string, userLogged: string): string {
    const words = value.split(' ');

    if (words.length > 0) {
      if (words[0].slice(0, -1) === userLogged) {
        words[0] = `<span style="font-weight: bold; color: brown">${words[0]}</span>`;
      } else {
        words[0] = `<b>${words[0]}</b>`;
      }
    }

    return words.join(' ');
  }
}
