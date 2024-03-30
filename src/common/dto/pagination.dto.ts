import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @ApiProperty({
        default: 10,
        description: 'How many rows do you need',
        minimum: 1,
    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number )
    limit? : number;

    @ApiProperty({
        default: 0,
        description: 'How many rows do you need to skip',
        minimum: 0,
    })
    @IsOptional()
    @IsPositive()
    @Min( 0 )
    @Type( () => Number )
    offset? : number;
}