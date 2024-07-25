// jsic分類項目表から[大分類、中分類、小分類、最分類]4つのmasterデータを出力する。

import fs from 'fs';
import _ from 'lodash';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';

interface CSVRow {
  section_code: string;
  division_code: string;
  group_code: string;
  class_code: string;
  name: string;
}

const headerMap = {
  section: ['id', 'code', 'name'],
  division: ['id', 'code', 'jsic_section_code', 'name'],
  group: ['id', 'code', 'jsic_division_code', 'name'],
  class: ['id', 'code', 'jsic_group_code', 'name'],
} as const;


const writeCSV = (filePath: string, data: any[], type: keyof typeof headerMap) => {
  const header = `${headerMap[type]}\n`;
  const rows = _.map(data, row => _.map(row, item => `"${item}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, header + rows);
};

(async () => {
  const filePath = './resource/jsic.csv';
  const fileBuffer = fs.readFileSync(filePath);
  const decodedData = iconv.decode(fileBuffer, 'shift_jis');
  const masterData = parse(decodedData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });

  const sectionData: any[] = [];
  const divisionData: any[] = [];
  const groupData: any[] = [];
  const classData: any[] = [];

  let sectionId: number = 1;
  let divisionId: number = 1;
  let groupId: number = 1;
  let classId: number = 1;

  for (let i = 1; i < masterData.length; i++) {
    const row = masterData[i];
    const [code, name] = row;
    if (code.length === 1) {
      sectionData.push([sectionId, code, name]);
      sectionId++;
    } else if (code.length === 2) {
      divisionData.push([divisionId, code, sectionId - 1, name]);
      divisionId++;
    } else if (code.length === 3) {
      groupData.push([groupId, code, divisionId - 1, name]);
      groupId++;
    } else if (code.length === 4) {
      classData.push([classId, code, groupId - 1, name]);
      classId++;
    }
  }

  writeCSV('./resource/jsic_section_master.csv', sectionData, 'section');
  writeCSV('./resource/jsic_division_master.csv', divisionData, 'division');
  writeCSV('./resource/jsic_group_master.csv', groupData, 'group');
  writeCSV('./resource/jsic_class_master.csv', classData, 'class');

})().then(() => {
  console.log('done');
}).catch((e) => {
  console.log(e);
  process.exit(1);
});
