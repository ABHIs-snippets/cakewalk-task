import reader from "xlsx";

const file = reader.readFile("./SearchResults_638145486235085918.xlsx");

const jsonArray = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

let names = jsonArray.map((_) => _["Generic Name"]);

const finalName = [];

const isPresent = (ele) => {
  let isMatch = false;
  let replaceInex = [];
  finalName.forEach((_, i) => {
    ele = ele.split(" ").join("");
    _ = _.split(" ").join("");
    if (ele.length >= _.length && !ele.indexOf(_)) {
      isMatch = true;
    } else if (_.length >= ele.length && !_.indexOf(ele)) {
      isMatch = true;
      replaceInex.push(i);
    }
  });
  return { isMatch, replaceInex };
};

names.forEach((name, i) => {
  if (i === 0) finalName.push(name);
  const data = isPresent(name);
  if (data.isMatch) {
    if (data.replaceInex.length) data.replaceInex.forEach((ele , idx)=>{
      if(idx === 0) finalName[ele] = name;
      else finalName.splice(ele , 1)
    })
  } else {
    finalName.push(name);
  }
});

console.log(finalName, "this is final arr");
console.log(names.length, finalName.length);



function saveToExcel(){
const sheetColumnName = ['Generic Name'];
const sheetName = 'Prefix Names';

const workbook = reader.utils.book_new();

const dataList = finalName.map(name=>[name]);

const worksheet = reader.utils.aoa_to_sheet([sheetColumnName,...dataList]);

reader.utils.book_append_sheet(workbook,worksheet,sheetName);
reader.writeFile(workbook,'./prefixName2.xlsx');
}

saveToExcel();

