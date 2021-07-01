import { Injectable } from '@nestjs/common';
import { set } from 'mongoose';

@Injectable()
export class AppService {
  constructor() {
    // To prevent deprecated messages while using findOneAndUpdate, set useFindAndModify to false
    set('useFindAndModify', false);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
