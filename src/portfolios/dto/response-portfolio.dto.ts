import { ApiProperty } from '@nestjs/swagger';

export class PortfolioResponseDto {
  @ApiProperty({ example: '38d296ce-ad3d-4f5e-a577-5b00f566a0b7' })
  id: string;

  @ApiProperty({ example: 'Travel Portfolio' })
  name: string;

  @ApiProperty({ example: 'My best travel photos' })
  description: string;

  @ApiProperty({ example: [] })
  images: [];

  @ApiProperty({ example: '2025-09-20T05:07:50.865Z' })
  createdAt: Date;
}