interface FileTs {
  name: string;
  shareLink: string;
  thumbnail: string;
  status: string;
  data: FileTs;
}

export const fileArr = (arr: any) => {
  const newField = arr?.map((val: FileTs) => {
    return {
      name: val?.name,
      url: val?.shareLink,
      thumbUrl: val?.thumbnail,
      status: 'done',
      data: val,
    };
  });
  return newField;
};
