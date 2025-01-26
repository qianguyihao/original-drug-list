const fs = require('fs');
const path = require('path');

// 读取 table 目录下的所有 markdown 文件
const tableDir = path.join(__dirname, '../table');
const readmeFile = path.join(__dirname, '../README.md');

// 读取现有的 README.md 内容
let readmeContent = fs.readFileSync(readmeFile, 'utf8');

// 如果 README.md 已经包含了表格内容,先保留头部内容
const startMarker = '已收录约 1300 种药品。';
const startIndex = readmeContent.indexOf(startMarker);
if (startIndex !== -1) {
  readmeContent = readmeContent.substring(0, startIndex + startMarker.length);
}

// 收集所有分类名称和内容
const categories = [];
let allTablesContent = '';

// 读取所有 markdown 文件
fs.readdirSync(tableDir)
  .filter(file => file.endsWith('.md'))
  .sort((a, b) => {
    // 按文件名数字排序
    const numA = parseInt(a.split('-')[0]);
    const numB = parseInt(b.split('-')[0]);
    return numA - numB;
  })
  .forEach(file => {
    const content = fs.readFileSync(path.join(tableDir, file), 'utf8');

    // 提取标题(去掉 ## 和首尾空格)
    const titleMatch = content.match(/##\s+(.+?)\s*\n/);
    if (titleMatch) {
      categories.push(titleMatch[1]);
    }

    // 添加整个文件内容
    allTablesContent += '\n' + content + '\n';
  });

// 将分类名称添加到 README.md
const categoriesText = '\n\n药品分类：\n\n' + categories.join('、') + '。';

// 组合最终内容
const updatedContent = readmeContent +
                      categoriesText +
                      '\n\n' +
                      allTablesContent;

// 写入更新后的内容
fs.writeFileSync(readmeFile, updatedContent);

console.log('README.md has been updated with categories and tables!');
