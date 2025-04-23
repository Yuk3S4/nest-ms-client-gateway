import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query, Patch } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) private readonly _client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this._client.send('createOrder', createOrderDto)
  }

  @Get()
  findAll( @Query() orderPaginationDto: OrderPaginationDto ) {
    // return orderPaginationDto
    return this._client.send('findAllOrders', orderPaginationDto).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this._client.send('findOneOrder', id).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this._client.send('findAllOrders', {
      ...paginationDto,
      status: statusDto.status
    }).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this._client.send('changeOrderStatus', { id, status: statusDto.status }).pipe(
      catchError( err => { throw new RpcException(err) })
    )
  }
}
