import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data, ctx: ExecutionContext) => {
        // console.log({ data });

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new InternalServerErrorException('Usuario no encontrado en request');

        if (data) return user[data];

        return user;
    }
)