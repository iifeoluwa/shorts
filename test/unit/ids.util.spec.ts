import { generateID } from '../../src/utils/ids.util';

describe('id generator util', () => {
  it('should return a string matching given length', async () => {
    const sixCharID = await generateID(6);
    const sevenCharID = await generateID(7);
    expect(sixCharID.length).toEqual(6);
    expect(sevenCharID.length).toEqual(7);
  });
});
