const AssertGenerator = require('./assert-generator');
const assertGenerator = new AssertGenerator();

if(process.argv.length !== 3) {
    console.error("invalid input");
    console.log("command : npm run generator -- <json_file>");
    return;
}

console.log(assertGenerator.generateFromFile(process.argv[2]));
