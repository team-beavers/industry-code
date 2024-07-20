// jsic分類項目表から[大分類、中分類、小分類、最分類]4つのmasterデータを出力する。

import fs from 'fs';
import _ from 'lodash';
import iconv from 'iconv-lite';
import { parse } from 'csv-parse/sync';


interface CSVLabelRow {
  '大分類コード': string;
  '中分類コード': string;
  '小分類コード': string;
  '細分類コード': string;
  '項目名': string;
}

interface CSVRow {
  section_code: string;
  division_code: string;
  group_code: string;
  class_code: string;
  name: string;
}


const columnMapping: { [key in keyof CSVLabelRow]: keyof CSVRow } = {
  '大分類コード': 'section_code',
  '中分類コード': 'division_code',
  '小分類コード': 'group_code',
  '細分類コード': 'class_code',
  '項目名': 'name',
};

const headerMap = {
  section: ['external_id', 'name'], // section_codeとname
  division: ['external_id', 'jsic_section_id', 'name'], // division_codeとsection_codeとname
  group: ['external_id', 'jsic_division_id', 'name'], // group_codeとdivision_codeとname
  class: ['external_id', 'jsic_group_id', 'name'], // class_codeとgroup_codeとname
} as const;

const writeCSV = (filePath: string, data: CSVRow[], type: keyof typeof headerMap) => {
  const header = `${headerMap[type]}\n`;
  const rows = _.map(data, row => _.map(row, item => `"${item}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, header + rows);
};

(async () => {
  const filePath = './resource/jsic.csv';
  const fileBuffer = fs.readFileSync(filePath);
  const decodedData = iconv.decode(fileBuffer, 'shift_jis');
  const masterData = parse(decodedData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });
  const props: Array<keyof CSVLabelRow> = masterData[0];

  const sectionData: any[] = [];
  const divisionData: any[] = [];
  const groupData: any[] = [];
  const classData: any[] = [];

  for (let i = 1; i < masterData.length; i++) {
    const row = _.transform(masterData[i], (result: CSVRow, value: string, index: number) => {
      const key = columnMapping[props[index]];
      result[key] = value;
    }, {} as CSVRow);

    if (Number(row.class_code)) { // 細分類
      classData.push([
        row.class_code,
        row.group_code,
        row.name,
      ]);
    } else if (Number(row.group_code)) { // 小分類
      groupData.push([
        row.group_code,
        row.division_code,
        row.name,
      ]);
    } else if (Number(row.division_code)) { // 中分類
      divisionData.push([
        row.division_code,
        row.section_code,
        row.name,
      ]);
    } else { // 大分類
      sectionData.push([
        row.section_code,
        row.name,
      ]);
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
