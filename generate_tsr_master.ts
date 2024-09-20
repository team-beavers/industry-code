// jsic分類項目表(第12回改訂)から[大分類、中分類、小分類、最分類]4つのmasterデータを出力する。
// jsicとtsrの差分を考慮[https://www.tsr-net.co.jp/service/detail/pdf/code_book.pdf]

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
  division: ['id', 'code', 'tsr_section_code', 'name'],
  group: ['id', 'code', 'tsr_division_code', 'name'],
  class: ['id', 'code', 'tsr_group_code', 'name'],
} as const;

// tsr固有の追加コード
const additionalCode = [
  ['3319', 'その他の電気事業所（管理事務）'],
  ['3419', 'その他のガス事業所（管理事務）'],
  ['3639', 'その他の下水道事業所（管理事務）'],
];

// jsicに含まれるが、TSRには含まれない分類名
const excludeCodeMap = {
  group: ['管理，補助的経済活動を行う事業所'],
  class: ['管理，補助的経済活動を行う事業所', '主として管理事務を行う本社等', 'その他の管理，補助的経済活動を行う事業所', '自家用倉庫'],
};


const writeCSV = (filePath: string, data: any[], type: keyof typeof headerMap) => {
  const header = `${headerMap[type]}\n`;
  const rows = _.map(data, row => _.map(row, item => `"${item}"`).join(',')).join('\n');
  fs.writeFileSync(filePath, header + rows);
};

(async () => {
  const filePath = './resource/jsic_v12.csv';
  const fileData = fs.readFileSync(filePath, 'utf-8');
  const jsicMasterData = parse(fileData, { quote: '"', ltrim: true, rtrim: true, delimiter: ',' });

  const tsrMasterData = [
    ...jsicMasterData,
    ...additionalCode,
  ];

  const sectionData: any[] = [];
  const divisionData: any[] = [];
  const groupData: any[] = [];
  const classData: any[] = [];

  let sectionId: number = 1;
  let divisionId: number = 1;
  let groupId: number = 1;
  let classId: number = 1;

  let sectionCode: string = '';
  let divisionCode: string = '';
  let groupCode: string = '';
  let classCode: string = '';

  for (let i = 1; i < tsrMasterData.length; i++) {
    const row = tsrMasterData[i];
    const [code, name] = row;

    const type = code.length === 1 ? 'section' : code.length === 2 ? 'division' : code.length === 3 ? 'group' : 'class';

    switch (type) {
      case 'section':
        sectionCode = code;
        sectionData.push([sectionId, sectionCode, name.replaceAll('･','・',)]);
        sectionId++;
        break;
      case 'division':
        divisionCode = code;
        divisionData.push([divisionId, divisionCode, sectionCode, name.replaceAll('･','・',)]);
        divisionId++;
        break;
      case 'group':
        if (_.some(excludeCodeMap.group, (val) => _.includes(name, val))) {
          continue;
        }
        groupCode = code;
        groupData.push([groupId, groupCode, divisionCode, name.replaceAll('･','・',)]);
        groupId++;
        break;
      case 'class':
        if (_.some(excludeCodeMap.class, (val) => _.includes(name, val))) {
          continue;
        }
        classCode = code;
        classData.push([classId, classCode, groupCode, name.replaceAll('･','・')]);
        classId++;
        break;
    }
  }

  writeCSV('./resource/tsr/tsr_section_master.csv', sectionData, 'section');
  writeCSV('./resource/tsr/tsr_division_master.csv', divisionData, 'division');
  writeCSV('./resource/tsr/tsr_group_master.csv', groupData, 'group');
  writeCSV('./resource/tsr/tsr_class_master.csv', classData, 'class');

})().then(() => {
  console.log('done');
}).catch((e) => {
  console.log(e);
  process.exit(1);
});
