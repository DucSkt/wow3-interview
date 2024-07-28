import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name: string): string {
    console.log('AppService');
    return `Hello, ${name || 'World'}! 22233`;
  }
}
