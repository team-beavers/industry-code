// jsic分類項目表(第14回改訂)から[大分類、中分類、小分類、最分類]4つのmasterデータを出力する。

import fs from 'fs';
import _ from 'lodash';
import { parse } from 'csv-parse/sync';

const headerMap = {
  section: ['id', 'code', 'name'],
  division: ['id', 'code', 'jsic_section_code', 'name'],
  group: ['id', 'code', 'jsic_division_code', 'name'],
  class: ['id', 'code', 'jsic_group_code', 'name'],
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
    return _.map(headerMap[type], (key: keyof DataType[T]) => `"${row[key]}"`).join(',');
  }).join('\n');
  fs.writeFileSync(filePath, header + rows);
};

(async () => {
  const filePath = './resource/jsic_v14.csv';
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const jsicMasterData = parse(fileData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });

  const sectionData: DataType['section'][] = [];
  const divisionData: DataType['division'][] = [];
  const groupData: DataType['group'][] = [];
  const classData: DataType['class'][] = [];

  let sectionId: number = 1;
  let divisionId: number = 1;
  let groupId: number = 1;
  let classId: number = 1;

  let sectionCode: string = '';
  let divisionCode: string = '';
  let groupCode: string = '';
  let classCode: string = '';

  for (let i = 1; i < jsicMasterData.length; i++) {
    const row = jsicMasterData[i];
    const [code, name] = row;

    switch (code.length) {
      case 1:
        sectionCode = code;
        sectionData.push({
          id: sectionId,
          code: sectionCode,
          name: name.replaceAll('･','・')
        });
        sectionId++;
        break;
      case 2:
        divisionCode = code;
        divisionData.push({
          id: divisionId,
          code: divisionCode,
          jsic_section_code: sectionCode,
          name: name.replaceAll('･','・')
        });
        divisionId++;
        break;
      case 3:
        groupCode = code;
        groupData.push({
          id: groupId,
          code: groupCode,
          jsic_division_code: divisionCode,
          name: name.replaceAll('･','・')
        });
        groupId++;
        break;
      case 4:
        classCode = code;
        classData.push({
          id: classId,
          code: classCode,
          jsic_group_code: groupCode,
          name: name.replaceAll('･','・')
        });
        classId++;
        break;
    }
  }

  writeCSV('./resource/jsic/jsic_section_master.csv', sectionData, 'section');
  writeCSV('./resource/jsic/jsic_division_master.csv', divisionData, 'division');
  writeCSV('./resource/jsic/jsic_group_master.csv', groupData, 'group');
  writeCSV('./resource/jsic/jsic_class_master.csv', classData, 'class');

})().then(() => {
  console.log('done');
}).catch((e) => {
  console.log(e);
  process.exit(1);
});
