import { Injectable, StreamableFile } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { PassThrough } from 'stream';

@Injectable()
export class ExcelService {
  async export() {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet('guang111');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 20 },
      { header: '姓名', key: 'name', width: 30 },
      { header: '出生日期', key: 'birthday', width: 30 },
      { header: '手机号', key: 'phone', width: 50 },
    ];

    const data = [
      {
        id: 1,
        name: '光光',
        birthday: new Date('1994-07-07'),
        phone: '13255555555',
      },
      {
        id: 2,
        name: '东东',
        birthday: new Date('1994-04-14'),
        phone: '13222222222',
      },
      {
        id: 3,
        name: '小刚',
        birthday: new Date('1995-08-08'),
        phone: '13211111111',
      },
    ];
    worksheet.addRows(data);

    const stream = new PassThrough();

    await workbook.xlsx.write(stream);

    return new StreamableFile(stream, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: 'attachment; filename=exported-data.xlsx',
    });
  }
}
