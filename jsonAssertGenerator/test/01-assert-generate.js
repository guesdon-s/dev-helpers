const assert = require('assert');
const AssertGenerator = require('../assert-generator');
const fs = require('fs');

describe('01-assert-generate', function() {

  const assertGenerator = new AssertGenerator();

  describe('test valid convert', function() {
    it('output comparaison 1', function() {
      const res = assertGenerator.generateFromFile("test/resources/test1.json");
      console.log(res);
      assert.equal(
        fs.readFileSync("test/resources/res1").toString().trim(),
        res.trim()
      );
    });
  });

  describe('test missing file or invalid content', function() {
    it('output comparaison 1', async function() {
      await assert.rejects(async () => {
        const res = assertGenerator.generateFromFile("test/resources/xoxoxo.json");
      }, 'Error: file test/resources/xoxoxo.json not exist or json is invalid');
    });
  });

});
