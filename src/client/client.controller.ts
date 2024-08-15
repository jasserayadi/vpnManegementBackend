import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { Client } from './schemas/client.schema';
import { ClientService } from './client.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
 
  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully.', type: Client })
  @ApiBody({ type: Client })
  create(@Body() clientData: Client) {
    return this.clientService.create(clientData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully.', type: [Client] })
  findAll() {
    return this.clientService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully.', type: Client })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client by ID' })
  @ApiResponse({ status: 200, description: 'Client updated successfully.', type: Client })
  update(@Param('id') id: string, @Body() clientData: Client) {
    return this.clientService.update(id, clientData);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client by ID' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.clientService.delete(id);
  }
}
