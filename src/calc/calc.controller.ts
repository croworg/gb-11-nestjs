import { Controller, Get, Param, Headers } from '@nestjs/common';
import { CalcService } from './calc.service';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Get(':a&:b')
  calc(
    @Param('a') a: string,
    @Param('b') b: string,
    @Headers('Type-Operation') operation: string,
  ) {
    const aInt: number = parseInt(a);
    const bInt: number = parseInt(b);
    return this.calcService.calculate(aInt, bInt, operation);
  }
}
