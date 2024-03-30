import { IsString, minLength } from "class-validator";

export class newMessageDto {

    @IsString()
    message : string;
}