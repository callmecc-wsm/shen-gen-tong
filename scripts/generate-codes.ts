/**
 * 激活码批量生成脚本
 * 用途: 生成指定数量的激活码并插入到 InstantDB
 * 使用方法: npx tsx scripts/generate-codes.ts [数量] [产品类型] [有效期天数]
 * 示例: npx tsx scripts/generate-codes.ts 100 schengen 365
 */

// 加载环境变量
import { config } from "dotenv";
config({ path: ".env.local" });

import { batchInsertCodes } from "../lib/instantdb-admin";

// 生成随机激活码
function generateCode(): string {
  const prefix = "VISA";
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 移除易混淆字符
  let randomPart = "";

  for (let i = 0; i < 8; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // 格式: VISA-2025-ABCD1234
  return `${prefix}-${year}-${randomPart}`;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  // 默认值
  const count = parseInt(args[0]) || 10;
  const productType = (args[1] as "schengen" | "study_abroad" | "consulting") || "schengen";
  const validDays = parseInt(args[2]) || 365;

  console.log("📋 激活码生成配置:");
  console.log(`   数量: ${count}`);
  console.log(`   产品类型: ${productType}`);
  console.log(`   有效期: ${validDays} 天`);
  console.log("");

  // 生成激活码
  console.log("🔄 正在生成激活码...");
  const codes = [];
  const expiresAt = validDays > 0 ? Date.now() + validDays * 24 * 60 * 60 * 1000 : undefined;

  for (let i = 0; i < count; i++) {
    codes.push({
      code: generateCode(),
      productType,
      expiresAt,
    });
  }

  console.log(`✅ 已生成 ${codes.length} 个激活码`);
  console.log("");

  // 插入到数据库
  console.log("🔄 正在插入到 InstantDB...");
  const success = await batchInsertCodes(codes);

  if (success) {
    console.log("✅ 激活码已成功插入到数据库");
    console.log("");
    console.log("📋 生成的激活码列表:");
    console.log("━".repeat(50));
    codes.forEach((item, index) => {
      console.log(`${(index + 1).toString().padStart(3, " ")}. ${item.code}`);
    });
    console.log("━".repeat(50));
    console.log("");
    console.log("💾 您可以将这些激活码保存下来，分发给用户。");
  } else {
    console.error("❌ 插入失败，请检查数据库配置和网络连接");
    process.exit(1);
  }
}

// 执行
main().catch((error) => {
  console.error("❌ 脚本执行失败:", error);
  process.exit(1);
});

