/**
 * 激活码查询脚本
 * 用途: 列出数据库中的所有激活码及其状态
 * 使用方法: npx tsx scripts/list-codes.ts [筛选条件]
 * 示例: 
 *   npx tsx scripts/list-codes.ts            # 列出所有激活码
 *   npx tsx scripts/list-codes.ts unused     # 只列出未使用的
 *   npx tsx scripts/list-codes.ts active     # 只列出已激活的
 */

// 加载环境变量
import { config } from "dotenv";
config({ path: ".env.local" });

import { adminDb } from "../lib/instantdb-admin";
import type { ActivationCode } from "../lib/instantdb";

// 格式化日期
function formatDate(timestamp: number | null | undefined): string {
  if (!timestamp) return "无";
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", { 
    year: "numeric", 
    month: "2-digit", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// 获取状态标签
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    unused: "未使用",
    active: "已激活",
    expired: "已过期",
  };
  return labels[status] || status;
}

// 获取产品类型标签
function getProductTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    schengen: "申根签证",
    study_abroad: "留学咨询",
    consulting: "专业咨询",
  };
  return labels[type] || type;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const filterStatus = args[0]; // 可选：unused, active, expired

  console.log("🔍 正在查询激活码...\n");

  try {
    // 查询所有激活码
    const result = await adminDb().query({
      activationCodes: {},
    });

    let codes = result.activationCodes as ActivationCode[];

    // 根据状态筛选
    if (filterStatus) {
      codes = codes.filter(code => code.status === filterStatus);
      console.log(`📋 筛选条件: ${getStatusLabel(filterStatus)}\n`);
    }

    if (codes.length === 0) {
      console.log("❌ 没有找到激活码");
      console.log("\n💡 提示: 使用以下命令生成激活码:");
      console.log("   npx tsx scripts/generate-codes.ts 10 schengen 365");
      return;
    }

    console.log(`✅ 找到 ${codes.length} 个激活码\n`);
    console.log("━".repeat(100));

    // 按状态分组统计
    const stats = codes.reduce((acc, code) => {
      acc[code.status] = (acc[code.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("📊 统计信息:");
    Object.entries(stats).forEach(([status, count]) => {
      console.log(`   ${getStatusLabel(status)}: ${count} 个`);
    });
    console.log("━".repeat(100));
    console.log("");

    // 列出所有激活码
    codes.forEach((code, index) => {
      const isExpired = code.expiresAt && code.expiresAt < Date.now();
      const statusLabel = isExpired ? "已过期" : getStatusLabel(code.status);
      
      console.log(`${(index + 1).toString().padStart(3, " ")}. ${code.code}`);
      console.log(`     状态: ${statusLabel}`);
      console.log(`     产品: ${getProductTypeLabel(code.productType)}`);
      console.log(`     创建时间: ${formatDate(code.createdAt)}`);
      
      if (code.activatedAt) {
        console.log(`     激活时间: ${formatDate(code.activatedAt)}`);
      }
      
      if (code.expiresAt) {
        console.log(`     过期时间: ${formatDate(code.expiresAt)}`);
      }
      
      console.log("");
    });

    console.log("━".repeat(100));
    console.log("\n💡 提示:");
    console.log("   - 查看未使用的激活码: npx tsx scripts/list-codes.ts unused");
    console.log("   - 查看已激活的激活码: npx tsx scripts/list-codes.ts active");
    console.log("   - 生成新的激活码: npx tsx scripts/generate-codes.ts 10 schengen 365");

  } catch (error) {
    console.error("❌ 查询失败:", error);
    console.error("\n💡 请检查:");
    console.error("   1. .env.local 文件是否存在且配置正确");
    console.error("   2. INSTANTDB_ADMIN_TOKEN 是否有效");
    console.error("   3. 网络连接是否正常");
    process.exit(1);
  }
}

// 执行
main().catch((error) => {
  console.error("❌ 脚本执行失败:", error);
  process.exit(1);
});

