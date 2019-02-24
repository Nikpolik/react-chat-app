import { KeyboardEvent } from 'react';

export const pressEnter = (callback: (...args: any[]) => any) => (event: KeyboardEvent) => {
    if(event.keyCode === 13) {
        callback();
    }
}  