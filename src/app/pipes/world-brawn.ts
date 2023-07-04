import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'firstWordBold' })
export class FirstWordBoldPipe implements PipeTransform {
  transform(value: string): string {
    const words = value.split(' ');

    if (words.length > 1) {
      words[0] = `<b>${words[0]}</b>`;
    }

    return words.join(' ');
  }
}
