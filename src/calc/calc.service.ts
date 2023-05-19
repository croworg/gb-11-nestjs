import { Injectable } from '@nestjs/common';

@Injectable()
export class CalcService {
  calculate(a: number, b: number, operation: string): number | string {
    switch (operation) {
      case 'plus':
        return a + b;
      case 'minus':
        return a > b ? a - b : b - a;
      case 'multiply':
        return a * b;
    }
    return 'Operation is not defined';
  }
}
