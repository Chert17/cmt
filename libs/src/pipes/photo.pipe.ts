import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ValidatorConstraint } from 'class-validator';

import { MulterFileType } from '../types';

const InvalidFileTypeExceptionMsg = (field: string | string[]) => {
  if (typeof field === 'string') {
    return {
      errorsMessages: [{ message: 'Invalid image file type', field }],
    };
  }
  return {
    errorsMessages: field.map((v) => ({
      message: 'Invalid image file type',
      field: v,
    })),
  };
};

@ValidatorConstraint({ async: true })
export class PhotoPipe implements PipeTransform {
  async transform(value: MulterFileType) {
    if (!value) return null;

    if (!value.originalname.match(/\.(jpg|jpeg|png|img|heic)$/i)) {
      throw new BadRequestException(
        InvalidFileTypeExceptionMsg(value.fieldname),
      );
    }

    return value;
  }
}

@ValidatorConstraint({ async: true })
export class PhotosPipe implements PipeTransform {
  async transform(value: MulterFileType) {
    if (!value) return null;

    const err = [];

    for (const file of Object.keys(value)) {
      const currentFile = value[file][0];
      if (!currentFile.originalname.match(/\.(jpg|jpeg|png|img|heic)$/i)) {
        err.push(currentFile.fieldname);
      }
    }

    if (err.length) {
      throw new BadRequestException(InvalidFileTypeExceptionMsg(err));
    }

    return value;
  }
}
