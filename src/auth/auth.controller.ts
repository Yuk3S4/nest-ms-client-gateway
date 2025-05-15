import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth.guard';
import { Token, User } from './decorators';
import { CurrentUser } from './interfaces/current-user.interface';

@Controller('auth')
export class AuthController {
  
  constructor(
      @Inject(NATS_SERVICE) private readonly _client: ClientProxy,
  ) {}

  @Post('register')
  registerUser( @Body() registerUserDto: RegisterUserDto ) {
    return this._client.send('auth.register.user',  registerUserDto ).pipe(
      catchError( err => {
        throw new RpcException(err)
      })
    )
  }

  @Post('login')
  loginUser( @Body() loginUserDto: LoginUserDto ) {
    return this._client.send('auth.login.user', loginUserDto ).pipe(
      catchError( err => {
        throw new RpcException(err)
      })
    )
  }

  @UseGuards( AuthGuard )
  @Get('verify')
  verifyUser( @User() user: CurrentUser, @Token() token: string ) {

    // const user = req['user']
    // const token = req['token']
    
    // return this._client.send('auth.verify.user', {})
    return { user, token }
  }

}
