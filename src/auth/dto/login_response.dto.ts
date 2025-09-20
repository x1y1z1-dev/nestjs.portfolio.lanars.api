import { ApiProperty } from '@nestjs/swagger';

export class LoginTokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzM2MzYzQ5Yy0yMzk5LTRmMzAtOWU2MC1kYzY5MmZhMTU0MWYiLCJ' +
      'lbWFpbCI6InRlc3RlckBnbWFpbC5jb20iLCJpYXQiOjE3NTgzNzg0MDcsImV4cCI6MTc1ODM4MjAwN30.L3oa0Rc58zUHeizuMALVTT_xgPE7Vz6GTELQ_8BgNnQ'
  })
  access_token: string;


  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzM2MzYzQ5Yy0yMzk5LTRmMzAtOWU2MC1kYzY5MmZ' +
      'hMTU0MWYiLCJpYXQiOjE3NTgzNzg0MDcsImV4cCI6MTc1ODk4MzIwN30.ip7_jkcd8vfPXH0DjERSQDpqrioPKV-lIGPENIybPB8'
  })
  refresh_token: string;
}