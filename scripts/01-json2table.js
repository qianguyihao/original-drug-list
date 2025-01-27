const fs = require('fs');
const path = require('path');

// 读取data目录下的所有JSON文件
const dataDir = path.join(__dirname, '../data');
const tableDir = path.join(__dirname, '../table');

// 确保table目录存在
if (!fs.existsSync(tableDir)) {
  fs.mkdirSync(tableDir);
}

// 从文件名提取标题
function getTitleFromFilename(filename) {
  // 移除数字前缀和扩展名，例如: "01-热门药品.json" -> "热门药品"
  return filename.replace(/^\d+-/, '').replace('.json', '');
}

// 转换单个文件
function convertFile(filename) {
  // 读取JSON文件
  const jsonPath = path.join(dataDir, filename);
  const jsonContent = fs.readFileSync(jsonPath, 'utf8');
  const jsonData = JSON.parse(jsonContent);

  // 获取标题
  const title = getTitleFromFilename(filename);

  // 生成markdown内容，添加标题
  let mdContent = `## ${title}\n\n`;
  mdContent += '| 商品名 | 药品通用名 | 生产厂家（简称） | 生产厂家（全称） |\n';
  mdContent += '|--------|------------|------------------|------------------|\n';

  // 添加数据行
  jsonData.data.forEach(item => {
    mdContent += `| ${item.trade_name} | ${item.drug_generic_name} | ${item.company_abbreviation || '-'} | ${item.company_name} |\n`;
  });

  // 写入markdown文件
  const mdFilename = filename.replace('.json', '.md');
  const mdPath = path.join(tableDir, mdFilename);
  fs.writeFileSync(mdPath, mdContent);

  console.log(`Converted ${filename} to ${mdFilename}`);
}

// 处理所有JSON文件
fs.readdirSync(dataDir).forEach(filename => {
  if (filename.endsWith('.json')) {
    convertFile(filename);
  }
});

console.log('Conversion completed!');