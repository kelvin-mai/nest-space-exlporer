import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TripUpdateResponseModel } from '@space-explorer/types';

import { LaunchService } from '../launch/launch.service';

@Resolver('TripUpdateResponse')
export class TripUpdateResponseResolver {
  constructor(private launchService: LaunchService) {}

  @ResolveField()
  launches(@Parent() trip: TripUpdateResponseModel) {
    return this.launchService.getLaunchByIds(trip.launches);
  }
}
