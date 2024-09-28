import fs from 'fs';
import _ from 'lodash';
import { parse } from 'csv-parse/sync';

const headerMap = {
  section: ['id', 'name'],
  division: ['id', 'section_id', 'name'],
} as const;

type HeaderMap = typeof headerMap;

type DataType = {
  [K in keyof HeaderMap]: {
    [Field in HeaderMap[K][number]]: string | number;
  };
};


const writeCSV = <T extends keyof HeaderMap>(
  filePath: string,
  data: DataType[T][],
  type: T
) => {
  const header = `${headerMap[type]}\n`;
  const rows = _.map(data, (row) => {
    // nameは・周りやる
    return _.map(headerMap[type], (key) => {
      return `"${row[key]}"`
    }).join(',');
  }).join('\n');
  fs.writeFileSync(filePath, header + rows);
};


(async () => {
  const filePath = './resource/salesnow.csv';
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const salesnowMasterData = parse(fileData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });

  const sectionData: DataType['section'][] = [];
  const divisionData: DataType['division'][] = [];

  let sectionIndex: number = 1;
  const sectionMap: { [key: string]: number } = {};

  for (let i = 1; i < salesnowMasterData.length; i++) {
    const row = salesnowMasterData[i];
    const [sectionName, divisionName] = row;
    if (!sectionMap[sectionName]) {
      sectionData.push({
        id: sectionIndex,
        name: sectionName
      });
      sectionMap[sectionName] = sectionIndex;
      sectionIndex++;
    }

    const sectionId = sectionMap[sectionName];
    divisionData.push({
      id: i,
      section_id: sectionId,
      name: divisionName
    });
  }

  writeCSV('./resource/salesnow/salesnow_section_master.csv', sectionData, 'section');
  writeCSV('./resource/salesnow/salesnow_division_master.csv', divisionData, 'division');
})().then(() => {
  console.log('done');
}).catch((e) => {
  console.log(e);
  process.exit(1);
});
