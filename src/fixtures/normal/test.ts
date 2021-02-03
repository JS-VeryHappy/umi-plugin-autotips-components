
export default async function (e:any) {
  console.log('====================================');
  console.log(e);
  console.log('====================================');
  const {page, host} = e;
  await page.goto(`${host}/`, {
    waitUntil: 'networkidle2',
  });
  const text = await page.evaluate(
    //@ts-ignore
    () => document.querySelector('h1').innerHTML,
  );
  expect(text).toEqual('umi-plugin-autotips-components');
};
