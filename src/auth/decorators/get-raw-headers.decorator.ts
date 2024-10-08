import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();

        const headers = req.rawHeaders;

        if(!headers) throw new InternalServerErrorException('Headers no encontrados en request');

        return headers;
    }
)