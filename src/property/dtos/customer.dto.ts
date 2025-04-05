import { IsNotEmpty, IsNumberString } from 'class-validator';
import { QueryParams } from '../../common/dtos/query-params.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetAvailableParkingNearMe extends QueryParams {
  @ApiProperty({ default: '13.0827', type: Number })
  @IsNumberString()
  @IsNotEmpty()
  lat: string;
  @ApiProperty({ default: '80.2707', type: Number })
  @IsNumberString()
  @IsNotEmpty()
  long: string;
  @ApiProperty({ description: 'in meters', type: Number })
  @IsNumberString()
  @IsNotEmpty()
  radius: string;
}
