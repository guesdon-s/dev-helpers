class AssertGenerator {

  generateFromFile(file) {
    const fileContent = this.readJsonFile(file);
    const items = this.getPaths(fileContent);
    const jsonAsserts = this.convertPathsToWebTestClientRules(items);
    return jsonAsserts;
  }

  generateFromString(data) {
    const items = this.getPaths(JSON.parse(data));
    const jsonAsserts = this.convertPathsToWebTestClientRules(items);
    return jsonAsserts;
  }

  readJsonFile(filename) {
    const absFilename = `${__dirname}/${filename}`;
    try {
        return require(absFilename);
    } catch(err) {
      throw new Error(`file ${filename} not exist or json is invalid`);
    }
  }

  getPaths(item, res = [], path = '$') {

    if(item === null) {
      res.push({path, type: 'null', value: item});
      return;
    }

    if(typeof item === 'object') {

      if(Array.isArray(item)) {
        res.push({path, type: 'array', value: item});
      }

      for(const index in item) {
        let key = `${path}.${index}`;
        if(!isNaN(index)) {
          key = `${path}[${index}]`;
        }
        this.getPaths(item[index], res, key);
      }

    } else {
      res.push({path, type: typeof item, value: item});
    }

    return res;
  }

  convertPathsToWebTestClientRules(typesAndPaths) {
    return typesAndPaths
      .map(this.buildAssert.bind(this))
      .flatMap(x => x)
      .join("\n.");
  }

  buildAssert(typePath) {
    switch(typePath.type) {
      case 'null':
      case 'number':
      return [
        `jsonPath("${typePath.path}").isEqualTo(${typePath.value})`
      ]
      case 'string':
      return [
        `jsonPath("${typePath.path}").isEqualTo("${typePath.value}")`
      ]
      case 'array':
      return [
        `jsonPath("${typePath.path}").isArray()`,
        `jsonPath("${typePath.path}.size()").isEqualTo(${typePath.value.length})`
      ];
      break;
    }
  }
}

module.exports = AssertGenerator;
