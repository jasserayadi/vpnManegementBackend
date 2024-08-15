import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { Vpn } from './schemas/vpn.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('vpn')
@Controller('vpn')
export class VpnController {
  constructor(private readonly vpnService: VpnService) {}

 // @UseGuards(JwtAuthGuard)
 
 @Post()
 @ApiOperation({ summary: 'Create a new VPN' })
 @ApiResponse({ status: 201, description: 'VPN created successfully.' })
 @ApiBody({
   schema: {
     example: {
       description: 'Example VPN',
       url: 'http://example.com',
       port: '443',
       pwd: 'examplePassword',
       address: '123.456.789.000',
       userId: '60d0fe4f5311236168a109ca',  // Example ObjectId
       
     }
   }
 })
 async createVpn(@Body() vpn: Vpn, @Query('clientId') clientId: string) {
   return this.vpnService.createVpn(vpn, clientId);
 }
 

  @Get()
  @ApiOperation({ summary: 'Find VPNs by client' })
  @ApiResponse({ status: 200, description: 'VPNs retrieved successfully.' })
  @ApiQuery({ name: 'clientId', type: String, description: 'Client ID to filter VPNs' })
  async findAllByClient(@Query('clientId') clientId: string): Promise<Vpn[]> {
    return this.vpnService.findAllByClient(clientId);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a specific VPN by ID' })
  @ApiResponse({ status: 200, description: 'VPN found successfully.' })
  @ApiResponse({ status: 404, description: 'VPN not found.' })
  @ApiParam({ name: 'id', description: 'ID of the VPN to retrieve', example: '60d0fe4f5311236168a109ca' })
  async findOne(@Param('id') id: string): Promise<Vpn> {
    return this.vpnService.findOne(id);
  }


  @Put(':id')
  @ApiOperation({ summary: 'Update a specific VPN by ID' })
  @ApiResponse({ status: 200, description: 'VPN updated successfully.' })
  @ApiResponse({ status: 404, description: 'VPN not found.' })
  @ApiParam({ name: 'id', description: 'ID of the VPN to update', example: '60d0fe4f5311236168a109ca' })
  @ApiBody({
    schema: {
      example: {
        description: 'Updated VPN',
        url: 'http://newexample.com',
        port: '80',
        pwd: 'newPassword',
        address: '987.654.321.000',
        userId: '60d0fe4f5311236168a109ca',
        clients: ['60d0fe4f5311236168a109cb', '60d0fe4f5311236168a109cc'],
      }
    }
  })
  async update(@Param('id') id: string, @Body() vpnData: Vpn): Promise<Vpn> {
    return this.vpnService.update(id, vpnData);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific VPN by ID' })
  @ApiResponse({ status: 204, description: 'VPN deleted successfully.' })
  @ApiResponse({ status: 404, description: 'VPN not found.' })
  @ApiParam({ name: 'id', description: 'ID of the VPN to delete', example: '60d0fe4f5311236168a109ca' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.vpnService.delete(id);
  }
}
