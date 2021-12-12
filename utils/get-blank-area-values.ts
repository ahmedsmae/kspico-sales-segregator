import { AreaIds } from '../constants/strings';

export const getBlankAreaValues = () =>
  AreaIds.reduce((final, areaId) => ({ ...final, [areaId]: 0 }), {}) as Record<
    typeof AreaIds[number],
    number
  >;
