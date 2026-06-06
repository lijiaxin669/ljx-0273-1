import { Controller, Get, Post, Patch, Body, Param, Query, Inject } from '@nestjs/common';
import { GroupService } from './group.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { JoinGroupDto } from './dto/join-group.dto.js';

@Controller('api/groups')
export class GroupController {
  constructor(@Inject(GroupService) private readonly groupService: GroupService) {}

  @Post()
  create(@Body() dto: CreateGroupDto) {
    const leaderId = 1;
    return this.groupService.create(leaderId, dto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.groupService.findAll(status);
  }

  @Get('managed')
  findManaged() {
    const leaderId = 1;
    return this.groupService.findManagedGroups(leaderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findById(Number(id));
  }

  @Get(':id/progress')
  getProgress(@Param('id') id: string) {
    return this.groupService.getProgress(Number(id));
  }

  @Post(':id/join')
  join(@Param('id') id: string, @Body() dto: JoinGroupDto) {
    return this.groupService.joinGroup(Number(id), dto);
  }

  @Patch(':id/close')
  close(@Param('id') id: string) {
    return this.groupService.closeGroup(Number(id));
  }
}
