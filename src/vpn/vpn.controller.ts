import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Query, InternalServerErrorException, Res, Req } from '@nestjs/common';
import { VpnService } from './vpn.service';
import { Vpn } from './schemas/vpn.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { exec, spawn } from 'child_process';
import { HttpStatus, HttpException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
const execPromise = promisify(exec);
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
  @UseGuards(JwtAuthGuard)
  @Get(':id/details')
  @ApiOperation({ summary: 'Get VPN connection details' })
  @ApiResponse({ status: 200, description: 'VPN details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'VPN not found.' })
  @ApiParam({ name: 'id', description: 'ID of the VPN to retrieve', example: '60d0fe4f5311236168a109ca' })
  async getVpnById(@Param('id') id: string): Promise<Vpn> {
    return this.vpnService.getVpnById(id);
  }

  
  @Post('connect')
  async connectToVpn(@Body() vpn: Vpn): Promise<string> {
    try {
      // Ensure that the vpn object has the necessary properties
      if (!vpn || !vpn.url || !vpn.description || !vpn.pwd) {
        throw new HttpException('Invalid VPN data provided', HttpStatus.BAD_REQUEST);
      }

      // Attempt to connect using the full VPN object
      const connectionResult = await this.vpnService.connectToVpn(vpn);

      return `Connected to VPN: ${vpn.description}`;
    } catch (error) {
      console.error('Error connecting to VPN:', error.message);
      throw new HttpException(`Error connecting to VPN: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

