import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TugasService } from './tugas.service.js';
import { CreateTugasDto } from './dto/create-tugas.dto.js';
import { UpdateTugasDto } from './dto/update-tugas.dto.js';

@Controller('tugas')
export class TugasController {
  constructor(private readonly tugasService: TugasService) {}

  @Post()
  create(@Body() createTugasDto: CreateTugasDto) {
    return this.tugasService.create(createTugasDto);
  }

  @Get()
  findAll() {
    return this.tugasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tugasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTugasDto: UpdateTugasDto,
  ) {
    return this.tugasService.update(id, updateTugasDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tugasService.remove(id);
  }
}
