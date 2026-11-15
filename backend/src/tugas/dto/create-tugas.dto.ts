import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTugasDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  judul: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  mataKuliah: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsOptional()
  @IsIn(['Belum Dikerjakan', 'Sedang Dikerjakan', 'Selesai'])
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Rendah', 'Sedang', 'Tinggi'])
  prioritas?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  estimasiJam?: number;

  @IsBoolean()
  @IsOptional()
  sudahSelesai?: boolean;
}
