import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzM2MzYzQ5Yy0yMzk5LTRmMzAtOWU2MC1kYzY5MmZ' +
      'hMTU0MWYiLCJpYXQiOjE3NTgzNzg0MDcsImV4cCI6MTc1ODk4MzIwN30.ip7_jkcd8vfPXH0DjERSQDpqrioPKV-lIGPENIybPB8'
  })
  access_token: string;
}