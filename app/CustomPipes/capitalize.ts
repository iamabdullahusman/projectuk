import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'capitalize'
})
/**
 * Place the first letter of each word in capital letters and the other in lower case. Ex: The LORO speaks = The Loro Speaks
 */
export class CapitalizePipe implements PipeTransform {
    transform(value: any): any {
        value = value.replace('  ', ' ');
        let w = '';
        if (value) {
            if (value.split('  ').length > 0) {
                value.split('  ').forEach(word => {
                    w += word.charAt(0).toUpperCase() + word.toString().substr(1, word.length).toLowerCase() + ' '
                });
            } else {
                w = value.charAt(0).toUpperCase() + value.toString().substr(1, value.length).toLowerCase();
            }
            return w;
        }
        return w;
    }
}