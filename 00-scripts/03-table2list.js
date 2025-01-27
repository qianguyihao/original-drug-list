const fs = require('fs');
const path = require('path');

// 创建输出目录
const outputDir = path.join(__dirname, '..', '03-list');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// 读取表格目录
const tableDir = path.join(__dirname, '..', '02-table');
const files = fs.readdirSync(tableDir);

// 处理每个文件
files.forEach(file => {
    if (!file.endsWith('.md')) return;

    // 读取文件内容
    const filePath = path.join(tableDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // 提取表格数据
    const lines = content.split('\n');
    let output = `## ${lines[0].substring(2)}\n\n`; // 提取标题

    const rows = [];
    let isTableContent = false;

    lines.forEach(line => {
        if (line.startsWith('|')) {
            // 跳过表头和分隔行
            if (line.includes('商品名') || line.includes('---')) {
                return;
            }

            // 处理数据行
            const cols = line.split('|').map(col => col.trim()).filter(col => col);
            if (cols.length === 4) {
                rows.push({
                    商品名: cols[0],
                    药品通用名: cols[1],
                    生产厂家: cols[2],
                    厂家全称: cols[3]
                });
            }
        }
    });

    // 生成清单格式输出
    output += rows.map(row =>
        `- 商品名：${row.商品名}\n` +
        `- 药品通用名：${row.药品通用名}\n` +
        `- 生产厂家：${row.生产厂家}\n` +
        `- 厂家全称：${row.厂家全称}\n\n` +
        '---\n'
    ).join('\n');

    // 写入新文件
    const outputFile = path.join(outputDir, file);
    fs.writeFileSync(outputFile, output);

    console.log(`Processed: ${file}`);
});

console.log('All files have been converted to list format.');
