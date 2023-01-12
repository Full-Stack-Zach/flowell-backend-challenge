import { Injectable } from '@nestjs/common';

export class Healthcheck {
  status: string
}
@Injectable()
export class AppService {
  getHealthcheck(): Healthcheck {
    return {status: "ok!"};
  }
}
