type ILineId = 'promotion' | 'otc' | 'iv';

type IAreasNumbers = {
  ksp_1_uae: number;
  ksp_2_uae: number;
  ksp_3_uae: number;
  ksp_4_uae: number;
  ksp_5_uae: number;
  ksp_6_uae: number;
  ksp_7_uae: number;
  ksp_8_uae: number;
  ksp_9_uae: number;
};

type IPercentageDistribution = IAreasNumbers & {
  account_id: string;
  account_name: string;
};

type IItem = {
  item_id: string;
  item_name: string;
  line_id: ILineId;
};

type IRep = {
  rep_name: string;
  area_id: keyof IAreasNumbers;
  line_id: ILineId;
};

interface IXlsxSale {
  'Ship To': string; // account id
  'Customer name': string; // account
  Material: string; // item id
  'Material Name': string; // item
  'Nett Sales Quantity': number; // sales quantity
}

interface IRawSale {
  account_id: string;
  account_name: string;
  item_id: string;
  item_name: string;
  quantity: number;
}

type IDirectOrder = IPercentageDistribution & {
  item_id: string;
  item_name: string;
};

type ISegregatedItem = IAreasNumbers & {
  item_id: string;
  item_name: string;
  quantity: number;
};

interface IResponseData {
  status: 'success' | 'error';
  message: string;
}
