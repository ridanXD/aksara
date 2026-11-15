import { PartialType } from '@nestjs/mapped-types';
import { CreateTugasDto } from './create-tugas.dto.js';

export class UpdateTugasDto extends PartialType(CreateTugasDto) {}
