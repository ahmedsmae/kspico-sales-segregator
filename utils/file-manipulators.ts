import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';

const SALES_FILES_DIRECTORY = path.join(process.cwd(), 'sales-data');
const PERCENTAGE_DISTRIBUTION_FILE_PATH = path.join(
  process.cwd(),
  'database',
  'percentage-distribution.json'
);
const ITEMS_FILE_PATH = path.join(process.cwd(), 'database', 'items.json');
const REPS_FILE_PATH = path.join(process.cwd(), 'database', 'reps.json');

export const findAllXlsxFileNames = () => {
  return fs
    .readdirSync(SALES_FILES_DIRECTORY)
    .filter(fn => fn.includes('.xlsx'));
};

export const extractRawSalesFromFile = (filename: string): Array<IRawSale> => {
  const salesFilePath = path.join(SALES_FILES_DIRECTORY, filename);
  const workbook = xlsx.readFile(salesFilePath);
  var wbSheetNames = workbook.SheetNames;
  const salesSheetName = workbook.Sheets[wbSheetNames[0]];
  const salesArray: Array<IXlsxSale> = xlsx.utils.sheet_to_json(salesSheetName);
  return salesArray
    .map(sale => ({
      account_id: sale['Ship To'],
      account_name: sale['Customer name'],
      item_id: sale.Material,
      item_name: sale['Material Name'],
      quantity: sale['Nett Sales Quantity']
    }))
    .filter(sale => sale.item_id);
};

export const findAllPercentageDistribution = () => {
  const fileData = fs
    .readFileSync(PERCENTAGE_DISTRIBUTION_FILE_PATH)
    .toString();
  return JSON.parse(fileData) as Array<IPercentageDistribution>;
};

export const findAllItems = () => {
  const fileData = fs.readFileSync(ITEMS_FILE_PATH).toString();
  const items = JSON.parse(fileData) as Array<IItem>;
  return items.sort((iA, iB) => {
    if (iA.item_name > iB.item_name) return 1;
    if (iA.item_name < iB.item_name) return -1;
    return 0;
  });
};

export const findAllReps = () => {
  const fileData = fs.readFileSync(REPS_FILE_PATH).toString();
  const reps = JSON.parse(fileData) as Array<IRep>;
  return reps.sort((rA, rB) => {
    if (rA.rep_name > rB.rep_name) return 1;
    if (rA.rep_name < rB.rep_name) return -1;
    return 0;
  });
};

export const saveToPercentageDistribution = (
  newList: Array<IPercentageDistribution>
) => {
  fs.writeFileSync(PERCENTAGE_DISTRIBUTION_FILE_PATH, JSON.stringify(newList));
};

export const saveToItems = (newList: Array<IItem>) => {
  fs.writeFileSync(ITEMS_FILE_PATH, JSON.stringify(newList));
};

export const saveToReps = (newList: Array<IRep>) => {
  fs.writeFileSync(REPS_FILE_PATH, JSON.stringify(newList));
};

const getDirectOrdersFilePath = (xlsxFilename: string) => {
  return path.join(
    SALES_FILES_DIRECTORY,
    xlsxFilename.replace('.xlsx', '.json')
  );
};

export const isDirectOrdersFileExists = (xlsxFilename: string) => {
  const directOrdersFilePath = getDirectOrdersFilePath(xlsxFilename);
  return fs.existsSync(directOrdersFilePath);
};

export const findAllFileDirectOrders = (xlsxFilename: string) => {
  const directOrdersFilePath = getDirectOrdersFilePath(xlsxFilename);
  const directOrdersFile = fs.readFileSync(directOrdersFilePath).toString();
  return JSON.parse(directOrdersFile) as Array<IDirectOrder>;
};

export const saveDirectOrders = (
  xlsxFilename: string,
  directOrders: Array<IDirectOrder>
) => {
  const directOrdersFilePath = getDirectOrdersFilePath(xlsxFilename);
  fs.writeFileSync(directOrdersFilePath, JSON.stringify(directOrders));
};
