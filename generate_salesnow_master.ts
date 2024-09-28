// jsic分類項目表(第12回改訂)から[大分類、中分類、小分類、最分類]4つのmasterデータを出力する。
// jsicとtsrの差分を考慮[https://www.tsr-net.co.jp/service/detail/pdf/code_book.pdf]

import fs from 'fs';
import _ from 'lodash';
import { parse } from 'csv-parse/sync';

const headerMap = {
  section: ['id', 'name'],
  division: ['id', 'section_id', 'name'],
} as const;


const writeCSV = (filePath: string, data: any[], type: keyof typeof headerMap) => {
  const header = `${headerMap[type]}\n`;
  const rows = _.map(data, row => _.map(row, item => `"${item}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, header + rows);
};


(async () => {
  const filePath = './resource/salesnow.csv';
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const salesnowMasterData = parse(fileData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });

  const sectionData: any[] = [];
  const divisionData: any[] = [];

  let sectionIndex: number = 1;
  const sectionMap: { [key: string]: number } = {};

  for (let i = 1; i < salesnowMasterData.length; i++) {
    const row = salesnowMasterData[i];
    // 大分類、中分類
    const [sectionName, divisionName] = row;
    // 大分類の処理
    if (!sectionMap[sectionName]) {
      sectionData.push({
        id: sectionIndex,
        name: sectionName
      });
      sectionMap[sectionName] = sectionIndex;
      sectionIndex++;
    }

    const sectionId = sectionMap[sectionName];
    // 中分類の処理
    divisionData.push({
      id: i,
      section_id: sectionId,
      name: divisionName
    });
  }

  console.log(sectionData, 'sectionData');
  console.log(divisionData, 'divisionData');

  writeCSV('./resource/salesnow/salesnow_section_master.csv', sectionData, 'section');
  writeCSV('./resource/salesnow/salesnow_division_master.csv', divisionData, 'division');
})().then(() => {
  console.log('done');
}).catch((e) => {
  console.log(e);
  process.exit(1);
});
