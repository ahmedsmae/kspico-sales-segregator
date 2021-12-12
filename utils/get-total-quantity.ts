import { AreaIds } from '../constants/strings';

export const getTotalQuantity = (object: IPercentageDistribution): number =>
  AreaIds.reduce((tot, areaId) => tot + object[areaId], 0);
