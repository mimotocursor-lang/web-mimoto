import { Controller, Get } from '@nestjs/common';
import { UsedMotorcyclesService } from './used-motorcycles.service';

@Controller('used-motorcycles')
export class UsedMotorcyclesController {
  constructor(private readonly usedService: UsedMotorcyclesService) {}

  @Get()
  async findAll() {
    return this.usedService.findAllActive();
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { UsedMotorcyclesService } from './used-motorcycles.service';

@Controller('used-motorcycles')
export class UsedMotorcyclesController {
  constructor(private readonly usedService: UsedMotorcyclesService) {}

  @Get()
  async findAll() {
    return this.usedService.findAllActive();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usedService.findOne(Number(id));
  }
}


